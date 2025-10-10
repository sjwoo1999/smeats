-- ============================================
-- 구매자/판매자 기능 개선 마이그레이션
-- ============================================

-- 1. 구매자 프로필 확장 (profiles 테이블 수정)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS region VARCHAR(100),
ADD COLUMN IF NOT EXISTS business_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS store_name VARCHAR(200);

-- 인덱스 추가 (검색 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_profiles_region ON public.profiles(region);
CREATE INDEX IF NOT EXISTS idx_profiles_business_type ON public.profiles(business_type);

-- 2. 배송 정보 테이블 (delivery_info)
CREATE TABLE IF NOT EXISTS public.delivery_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fee INTEGER NOT NULL DEFAULT 0,
  free_threshold INTEGER,
  avg_delivery_days INTEGER NOT NULL DEFAULT 2,
  delivery_schedule JSONB DEFAULT '{"start": "09:00", "end": "18:00"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT positive_fee CHECK (fee >= 0),
  CONSTRAINT positive_threshold CHECK (free_threshold IS NULL OR free_threshold >= 0),
  CONSTRAINT positive_delivery_days CHECK (avg_delivery_days > 0)
);

CREATE INDEX IF NOT EXISTS idx_delivery_info_seller ON public.delivery_info(seller_id);

-- 3. 판매자 영업 시간 테이블 (seller_business_hours)
CREATE TABLE IF NOT EXISTS public.seller_business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seller_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_business_hours_seller ON public.seller_business_hours(seller_id);

-- 4. 상품 가격 관리 테이블 (product_pricing)
CREATE TABLE IF NOT EXISTS public.product_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  base_price INTEGER NOT NULL CHECK (base_price >= 0),
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) CHECK (discount_value >= 0),
  discount_start_date TIMESTAMPTZ,
  discount_end_date TIMESTAMPTZ,
  markup_percentage DECIMAL(5,2) DEFAULT 0 CHECK (markup_percentage >= 0),
  markup_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_discount_dates CHECK (
    discount_start_date IS NULL OR
    discount_end_date IS NULL OR
    discount_end_date >= discount_start_date
  ),
  UNIQUE(product_id)
);

-- 최종 가격 계산 함수
CREATE OR REPLACE FUNCTION calculate_final_price(
  p_base_price INTEGER,
  p_markup_percentage DECIMAL,
  p_discount_type VARCHAR,
  p_discount_value DECIMAL
) RETURNS INTEGER AS $$
DECLARE
  v_price DECIMAL;
BEGIN
  v_price := p_base_price * (1 + COALESCE(p_markup_percentage, 0) / 100);

  IF p_discount_type = 'percentage' THEN
    v_price := v_price * (1 - COALESCE(p_discount_value, 0) / 100);
  ELSIF p_discount_type = 'fixed' THEN
    v_price := v_price - COALESCE(p_discount_value, 0);
  END IF;

  RETURN FLOOR(GREATEST(v_price, 0));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_pricing_product ON public.product_pricing(product_id);
CREATE INDEX IF NOT EXISTS idx_pricing_active_discount ON public.product_pricing(discount_start_date, discount_end_date)
  WHERE discount_start_date IS NOT NULL;

-- 5. 판매 통계 뷰 (판매량 집계)
CREATE OR REPLACE VIEW public.product_sales_stats AS
SELECT
  p.id AS product_id,
  p.name,
  p.seller_id,
  COUNT(DISTINCT o.id) AS total_orders,
  COALESCE(SUM(oi.quantity), 0) AS total_quantity_sold,
  COALESCE(SUM(oi.quantity * oi.price_at_order), 0) AS total_revenue,
  MAX(o.created_at) AS last_sold_at
FROM public.products p
LEFT JOIN public.order_items oi ON oi.product_id = p.id
LEFT JOIN public.orders o ON o.id = oi.order_id AND o.status != 'cancelled'
GROUP BY p.id, p.name, p.seller_id;

-- 6. 판매자 평점 계산 함수 (최근 30일 기준)
CREATE OR REPLACE FUNCTION get_seller_recent_sales(p_seller_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.orders
    WHERE seller_id = p_seller_id
      AND created_at >= NOW() - INTERVAL '30 days'
      AND status != 'cancelled'
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- 7. 지역별 인기 상품 함수
CREATE OR REPLACE FUNCTION get_region_popular_products(
  p_region VARCHAR,
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
  product_id UUID,
  product_name VARCHAR,
  total_orders BIGINT,
  seller_business_name VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS product_id,
    p.name AS product_name,
    COUNT(DISTINCT o.id) AS total_orders,
    seller.business_name AS seller_business_name
  FROM public.products p
  JOIN public.orders o ON o.seller_id = p.seller_id
  JOIN public.order_items oi ON oi.order_id = o.id AND oi.product_id = p.id
  JOIN public.profiles customer ON customer.id = o.customer_id
  JOIN public.profiles seller ON seller.id = p.seller_id
  WHERE customer.region = p_region
    AND o.created_at >= NOW() - INTERVAL '30 days'
    AND o.status != 'cancelled'
  GROUP BY p.id, p.name, seller.business_name
  ORDER BY total_orders DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- 8. 업종별 추천 상품 함수
CREATE OR REPLACE FUNCTION get_business_type_recommendations(
  p_business_type VARCHAR,
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
  product_id UUID,
  product_name VARCHAR,
  category VARCHAR,
  purchase_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.category,
    COUNT(DISTINCT o.id) AS purchase_count
  FROM public.products p
  JOIN public.order_items oi ON oi.product_id = p.id
  JOIN public.orders o ON o.id = oi.order_id
  JOIN public.profiles customer ON customer.id = o.customer_id
  WHERE customer.business_type = p_business_type
    AND o.created_at >= NOW() - INTERVAL '90 days'
    AND o.status != 'cancelled'
  GROUP BY p.id, p.name, p.category
  ORDER BY purchase_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- 9. RLS 정책 추가
ALTER TABLE public.delivery_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_pricing ENABLE ROW LEVEL SECURITY;

-- delivery_info 정책
CREATE POLICY "delivery_info_select_all" ON public.delivery_info
  FOR SELECT USING (true);

CREATE POLICY "delivery_info_insert_own" ON public.delivery_info
  FOR INSERT WITH CHECK (seller_id = auth.uid());

CREATE POLICY "delivery_info_update_own" ON public.delivery_info
  FOR UPDATE USING (seller_id = auth.uid());

CREATE POLICY "delivery_info_delete_own" ON public.delivery_info
  FOR DELETE USING (seller_id = auth.uid());

-- seller_business_hours 정책
CREATE POLICY "business_hours_select_all" ON public.seller_business_hours
  FOR SELECT USING (true);

CREATE POLICY "business_hours_insert_own" ON public.seller_business_hours
  FOR INSERT WITH CHECK (seller_id = auth.uid());

CREATE POLICY "business_hours_update_own" ON public.seller_business_hours
  FOR UPDATE USING (seller_id = auth.uid());

CREATE POLICY "business_hours_delete_own" ON public.seller_business_hours
  FOR DELETE USING (seller_id = auth.uid());

-- product_pricing 정책
CREATE POLICY "pricing_select_all" ON public.product_pricing
  FOR SELECT USING (true);

CREATE POLICY "pricing_insert_own" ON public.product_pricing
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_pricing.product_id
        AND seller_id = auth.uid()
    )
  );

CREATE POLICY "pricing_update_own" ON public.product_pricing
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_pricing.product_id
        AND seller_id = auth.uid()
    )
  );

CREATE POLICY "pricing_delete_own" ON public.product_pricing
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_pricing.product_id
        AND seller_id = auth.uid()
    )
  );

-- 10. 트리거: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_delivery_info_updated_at
  BEFORE UPDATE ON public.delivery_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_pricing_updated_at
  BEFORE UPDATE ON public.product_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
