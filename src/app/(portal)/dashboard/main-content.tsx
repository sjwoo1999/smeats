"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Database } from "@/lib/database.types";
import { Card } from "@/components/ui/card";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  seller?: {
    business_name: string | null;
  };
};

interface MainContentProps {
  userId: string;
  userRegion?: string;
  userBusinessType?: string;
}

export default function MainContent({
  userId,
  userRegion,
  userBusinessType,
}: MainContentProps) {
  const [recentPurchases, setRecentPurchases] = useState<Product[]>([]);
  const [nearbyPopular, setNearbyPopular] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockRecentPurchases = [
        {
          id: "1",
          seller_id: "s1",
          name: "한우 등심",
          category: "육류",
          price: 45000,
          unit: "kg",
          origin: "국내산",
          stock: 50,
          image_path: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          seller: { business_name: "프리미엄 정육점" },
        },
      ];

      const mockNearbyPopular = [
        {
          product_id: "2",
          product_name: "대패 삼겹살",
          total_orders: 124,
          seller_business_name: "신선육류 도매",
        },
      ];

      const mockRecommendations = [
        {
          product_id: "3",
          product_name: "양파",
          category: "채소",
          purchase_count: 89,
        },
      ];

      const mockRecipes = userBusinessType
        ? [
            {
              recipe_id: "1",
              recipe_name: "김치찌개",
              category: userBusinessType,
              servings: 100,
            },
          ]
        : [];

      setRecentPurchases(mockRecentPurchases);
      setNearbyPopular(userRegion ? mockNearbyPopular : []);
      setRecommendations(userBusinessType ? mockRecommendations : []);
      setRecipes(mockRecipes);
      setLoading(false);
    };

    fetchContent();
  }, [userId, userRegion, userBusinessType]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 최근 구매한 상품 */}
      {recentPurchases.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">최근 구매한 상품</h2>
            <Link
              href="/orders"
              className="text-sm text-blue-600 hover:underline"
            >
              전체보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentPurchases.slice(0, 4).map((product) => (
              <ProductQuickCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 내 주변 인기 상품 */}
      {nearbyPopular.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              내 주변 인기 상품
              {userRegion && (
                <span className="text-sm text-gray-500 ml-2">({userRegion})</span>
              )}
            </h2>
            <Link
              href="/products?sort=sales_desc"
              className="text-sm text-blue-600 hover:underline"
            >
              전체보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {nearbyPopular.slice(0, 4).map((item: any) => (
              <PopularProductCard key={item.product_id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* 업종별 추천 */}
      {recommendations.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {userBusinessType} 추천 상품
            </h2>
            <Link
              href="/products"
              className="text-sm text-blue-600 hover:underline"
            >
              전체보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.slice(0, 4).map((item: any) => (
              <RecommendedProductCard key={item.product_id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* 업종별 추천 레시피 */}
      {recipes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {userBusinessType} 추천 레시피
            </h2>
            <Link
              href="/recipes"
              className="text-sm text-blue-600 hover:underline"
            >
              전체보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recipes.slice(0, 4).map((recipe: any) => (
              <RecipeCard key={recipe.recipe_id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* 프로필 미완성 안내 */}
      {(!userRegion || !userBusinessType) && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-2">맞춤 추천을 받으려면?</h3>
          <p className="text-sm text-gray-700 mb-4">
            지역과 업종 정보를 등록하면 더 정확한 상품 추천을 받을 수 있습니다.
          </p>
          <Link
            href="/profile"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            프로필 완성하기 →
          </Link>
        </Card>
      )}
    </div>
  );
}

function ProductQuickCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gray-100 relative">
          {product.image_path ? (
            <img
              src={product.image_path}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-sm font-medium truncate">{product.name}</p>
          <p className="text-lg font-bold text-blue-600">
            ₩{product.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-600">
              /{product.unit}
            </span>
          </p>
        </div>
      </Card>
    </Link>
  );
}

function PopularProductCard({ item }: { item: any }) {
  return (
    <Link href={`/products/${item.product_id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <p className="font-medium text-sm">{item.product_name}</p>
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
            인기
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-2">
          {item.seller_business_name}
        </p>
        <p className="text-xs text-gray-500">주문 {item.total_orders}건</p>
      </Card>
    </Link>
  );
}

function RecommendedProductCard({ item }: { item: any }) {
  return (
    <Link href={`/products/${item.product_id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <p className="font-medium text-sm">{item.product_name}</p>
          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
            추천
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-2">{item.category}</p>
        <p className="text-xs text-gray-500">
          구매 {item.purchase_count}건
        </p>
      </Card>
    </Link>
  );
}

function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <Link href={`/recipes/${recipe.recipe_id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <p className="font-medium text-sm">{recipe.recipe_name}</p>
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
            레시피
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-2">{recipe.category}</p>
        <p className="text-xs text-gray-500">
          {recipe.servings}인분
        </p>
      </Card>
    </Link>
  );
}
