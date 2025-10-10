import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image_path: string | null;
  category: string;
}

interface PopularProduct {
  product_id: string;
  product_name: string;
  total_orders: number;
  seller_business_name: string;
}

interface RecommendedProduct {
  product_id: string;
  product_name: string;
  category: string;
  purchase_count: number;
}

async function getMainContent(userId: string, profile: { region?: string | null; business_type?: string | null }) {
  const supabase = await createServerSupabaseClient();

  // 최근 구매 상품 (30일 이내)
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_items (
        product_id,
        products (
          id,
          name,
          price,
          unit,
          image_path,
          category
        )
      )
    `
    )
    .eq("customer_id", userId)
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: false })
    .limit(5);

  const recentProducts: Product[] =
    recentOrders
      ?.flatMap((order: { order_items: { products: Product }[] }) =>
        order.order_items.map((item: { products: Product }) => item.products)
      )
      .filter(Boolean)
      .slice(0, 4) || [];

  // 지역별 인기 상품
  let nearbyPopular: PopularProduct[] = [];
  if (profile.region) {
    const { data } = await supabase.rpc("get_region_popular_products", {
      p_region: profile.region,
      p_limit: 4,
    });
    nearbyPopular = data || [];
  }

  // 업종별 추천 상품
  let recommendations: RecommendedProduct[] = [];
  if (profile.business_type) {
    const { data } = await supabase.rpc("get_business_type_recommendations", {
      p_business_type: profile.business_type,
      p_limit: 4,
    });
    recommendations = data || [];
  }

  return { recentProducts, nearbyPopular, recommendations };
}

export default async function MainPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  // 역할별 리다이렉트
  if (profile.role === "seller") {
    redirect("/seller");
  }

  if (profile.role === "admin") {
    redirect("/admin");
  }

  const { recentProducts, nearbyPopular, recommendations } = await getMainContent(
    profile.id,
    profile
  );

  // 프로필 완성도 체크
  const isProfileComplete =
    profile.region && profile.business_type && profile.store_name;

  return (
    <div className="space-y-8">
      {/* 환영 메시지 */}
      <div>
        <h1 className="text-3xl font-bold">
          {profile.store_name
            ? `${profile.store_name}님, 환영합니다!`
            : "환영합니다!"}
        </h1>
        <p className="mt-2 text-gray-600">
          {isProfileComplete
            ? "오늘도 최고의 식자재로 장사 번창하세요!"
            : "프로필을 완성하고 맞춤 추천을 받아보세요."}
        </p>
      </div>

      {/* 프로필 미완성 알림 */}
      {!isProfileComplete && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-amber-900">
                  ⚠️ 프로필을 완성해주세요
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  지역과 업종을 등록하면 맞춤 상품 추천을 받을 수 있습니다.
                </p>
              </div>
              <Link
                href="/mypage"
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                설정하기
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 최근 구매 상품 */}
      {recentProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🛒 최근 구매한 상품</h2>
            <Link
              href="/orders"
              className="text-sm text-blue-600 hover:underline"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {product.image_path && (
                  <div className="aspect-square bg-gray-100 rounded-md mb-2" />
                )}
                <h3 className="font-medium text-sm line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  ₩{product.price.toLocaleString()}/{product.unit}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 내 주변 인기 상품 */}
      {nearbyPopular.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              📍 {profile.region} 인기 상품
            </h2>
            <Link
              href={`/products?region=${profile.region}`}
              className="text-sm text-blue-600 hover:underline"
            >
              더 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {nearbyPopular.map((item) => (
              <Link
                key={item.product_id}
                href={`/products/${item.product_id}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-sm line-clamp-2">
                  {item.product_name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {item.seller_business_name}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  🔥 {item.total_orders}명이 구매
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 업종별 추천 */}
      {recommendations.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              💡 {profile.business_type} 추천 상품
            </h2>
            <Link
              href={`/products?business_type=${profile.business_type}`}
              className="text-sm text-blue-600 hover:underline"
            >
              더 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.map((item) => (
              <Link
                key={item.product_id}
                href={`/products/${item.product_id}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded mb-2">
                  {item.category}
                </span>
                <h3 className="font-medium text-sm line-clamp-2">
                  {item.product_name}
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  같은 업종 {item.purchase_count}회 구매
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 빠른 시작 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>🔍 상품 검색</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              필터와 정렬로 최저가 상품을 찾아보세요
            </p>
            <Link
              href="/products"
              className="text-sm text-blue-600 hover:underline"
            >
              상품 보기 →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 레시피 발주</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              레시피로 필요한 재료를 한번에 주문하세요
            </p>
            <Link
              href="/recipes"
              className="text-sm text-blue-600 hover:underline"
            >
              레시피 보기 →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📦 주문 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              주문 내역과 배송 현황을 확인하세요
            </p>
            <Link
              href="/orders"
              className="text-sm text-blue-600 hover:underline"
            >
              주문 보기 →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
