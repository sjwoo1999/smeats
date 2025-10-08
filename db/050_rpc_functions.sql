-- Function to decrement product stock atomically
CREATE OR REPLACE FUNCTION public.decrement_stock(
  product_id UUID,
  quantity INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET stock = stock - quantity,
      updated_at = NOW()
  WHERE id = product_id
    AND stock >= quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock or product not found';
  END IF;
END;
$$;
