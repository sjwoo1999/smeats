import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

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

interface Recipe {
  id: string;
  name: string;
  description: string;
  servings: number;
  total_ingredients: number;
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

  // 업종별 추천 레시피
  const { data: recipes } = await supabase
    .from("recipes")
    .select(
      `
      id,
      name,
      description,
      servings,
      recipe_ingredients (count)
    `
    )
    .limit(3);

  const recommendedRecipes: Recipe[] =
    recipes?.map((recipe: { id: string; name: string; description: string; servings: number; recipe_ingredients: { count: number }[] }) => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      servings: recipe.servings,
      total_ingredients: recipe.recipe_ingredients?.[0]?.count || 0,
    })) || [];

  return { recentProducts, nearbyPopular, recommendations, recommendedRecipes };
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

  const { recentProducts, nearbyPopular, recommendations, recommendedRecipes } =
    await getMainContent(profile.id, profile);

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
                className="group border rounded-lg overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="relative aspect-square bg-gray-100">
                  {product.image_path ? (
                    <Image
                      src={product.image_path}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">🛒</span>
                    </div>
                  )}
                  <Badge
                    variant="default"
                    className="absolute top-2 left-2 bg-blue-600 text-white"
                  >
                    {product.category}
                  </Badge>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-primary">
                    ₩{product.price.toLocaleString()}
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      /{product.unit}
                    </span>
                  </p>
                </div>
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
              <Card
                key={item.product_id}
                className="group hover:shadow-lg transition-all cursor-pointer"
              >
                <Link href={`/products/${item.product_id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="default" className="text-xs">
                        인기
                      </Badge>
                      <span className="text-xs text-red-600 font-medium">
                        🔥 {item.total_orders}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 mb-2">
                      {item.product_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {item.seller_business_name}
                    </p>
                  </CardContent>
                </Link>
              </Card>
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
              <Card
                key={item.product_id}
                className="group hover:shadow-lg transition-all cursor-pointer"
              >
                <Link href={`/products/${item.product_id}`}>
                  <CardContent className="p-4">
                    <Badge variant="info" className="mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="font-medium text-sm line-clamp-2 mb-2">
                      {item.product_name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>👥</span>
                      <span>같은 업종 {item.purchase_count}회 구매</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 업종별 추천 레시피 */}
      {recommendedRecipes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              👨‍🍳 {profile.business_type ? `${profile.business_type}를 위한` : ""}{" "}
              추천 레시피
            </h2>
            <Link
              href="/recipes"
              className="text-sm text-blue-600 hover:underline"
            >
              레시피 전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="hover:shadow-lg transition-all cursor-pointer"
              >
                <Link href={`/recipes/${recipe.id}`}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span>📋</span>
                      <span className="line-clamp-1">{recipe.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {recipe.description || "맛있는 레시피를 확인해보세요"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span>👥</span>
                        <span>{recipe.servings}인분</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🥘</span>
                        <span>{recipe.total_ingredients}가지 재료</span>
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
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
