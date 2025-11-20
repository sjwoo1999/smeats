"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRecipeWithItems, calculateRecipe } from "@/server/actions/recipes";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { RecipeWithItems, RecipeCalculationResult } from "@/lib/types";

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeWithItems | null>(null);
  const [servings, setServings] = useState(10);
  const [calculation, setCalculation] = useState<RecipeCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { addMany } = useCart();

  // Load recipe
  useEffect(() => {
    getRecipeWithItems(params.id).then(setRecipe);
  }, [params.id]);

  // Calculate on servings change
  useEffect(() => {
    if (!recipe) return;
    setLoading(true);
    calculateRecipe(recipe.id, servings)
      .then(setCalculation)
      .finally(() => setLoading(false));
  }, [recipe, servings]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  if (!recipe) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-neutral-200 rounded" />
          <div className="h-64 w-full bg-neutral-200 rounded" />
        </div>
      </div>
    );
  }

  const matchedItems = calculation?.items.filter((i) => i.can_add_to_cart) || [];
  const unmatchedItems = calculation?.items.filter((i) => !i.can_add_to_cart) || [];

  function handleBackToList() {
    router.push("/recipes");
  }

  function handleAddToCart() {
    const cartItems = matchedItems
      .filter((item) => item.matched_product)
      .map((item) => ({
        product_id: item.matched_product!.id,
        seller_id: item.matched_product!.seller_id,
        name: item.matched_product!.name,
        price: item.matched_product!.price,
        unit: item.matched_product!.unit,
        quantity: Math.ceil(item.quantity_needed),
        image_path: item.matched_product!.image_path,
      }));

    addMany(cartItems);
    alert(`${cartItems.length}개 상품이 장바구니에 추가되었습니다.`);
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBackToList}
        className="mb-4"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        레시피 목록으로
      </Button>

      {/* Recipe Header */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recipe Image */}
          <div className="relative aspect-video md:aspect-square w-full overflow-hidden bg-neutral-100">
            {recipe.image_path ? (
              <Image
                src={recipe.image_path}
                alt={recipe.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <svg
                  className="h-24 w-24 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge variant="default" className="shadow-sm bg-bg/90 backdrop-blur-sm">
                {recipe.category}
              </Badge>
            </div>
          </div>

          {/* Recipe Info */}
          <div className="p-6 flex flex-col justify-center space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-text">{recipe.name}</h1>
              {recipe.description && (
                <p className="mt-3 text-text-secondary leading-relaxed">
                  {recipe.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>총 {recipe.items.length}가지 재료</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Servings Slider */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-base font-semibold text-text">인분 수 선택</label>
                <p className="text-sm text-text-secondary mt-1">
                  필요한 인분수를 선택하면 자동으로 재료량이 계산됩니다
                </p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-primary tabular-nums">{servings}</span>
                <span className="text-xl text-text ml-1">인분</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-full h-3 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary slider"
            />
            <div className="flex justify-between text-sm text-text-secondary">
              <span>1인분</span>
              <span>200인분</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Results */}
      <Card>
        <CardHeader>
          <CardTitle>필요한 재료 ({servings}인분 기준)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="mt-3 text-sm text-text-secondary">재료 계산중...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Matched Items */}
              {matchedItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold text-text">구매 가능한 재료</h3>
                    <Badge variant="success">{matchedItems.length}개</Badge>
                  </div>
                  <div className="space-y-3">
                    {matchedItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 bg-success-bg/30 border border-success/20 rounded-md"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-text">{item.ingredient_name}</div>
                          <div className="text-sm text-text-secondary mt-1">
                            필요량: {item.quantity_needed.toFixed(1)} {item.unit}
                          </div>
                          {item.matched_product && (
                            <div className="text-xs text-text-muted mt-1">
                              판매자: {item.matched_product.seller.business_name || "판매자"}
                            </div>
                          )}
                        </div>
                        {item.matched_product && (
                          <div className="text-right">
                            <div className="font-bold text-text tabular-nums">
                              {formatPrice(item.matched_product.price)}
                            </div>
                            <div className="text-xs text-text-secondary">
                              / {item.matched_product.unit}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unmatched Items */}
              {unmatchedItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold text-text">구매 불가 재료</h3>
                    <Badge variant="warning">{unmatchedItems.length}개</Badge>
                  </div>
                  <div className="space-y-3">
                    {unmatchedItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 bg-warning-bg/30 border border-warning/20 rounded-md"
                      >
                        <div>
                          <div className="font-medium text-text">{item.ingredient_name}</div>
                          <div className="text-sm text-text-secondary mt-1">
                            필요량: {item.quantity_needed.toFixed(1)} {item.unit}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="warning" size="sm">
                            재고 없음
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => router.push(`/products?search=${item.ingredient_name}`)}
                          >
                            대체 상품 찾기
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-warning bg-warning-bg/50 p-3 rounded-md">
                    💡 일부 재료는 현재 구매할 수 없습니다. 직접 추가 구매해주세요.
                  </p>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="pt-4 border-t border-border">
                {/* Total Price Preview - Enhanced */}
                {matchedItems.length > 0 && (
                  <div className="bg-primary-bg/30 border border-primary/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text-secondary">총 예상 금액</p>
                        <p className="text-xs text-text-muted mt-1">
                          {matchedItems.length}개 재료 • {servings}인분 기준
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary tabular-nums">
                          {formatPrice(
                            matchedItems.reduce(
                              (sum, item) =>
                                sum +
                                (item.matched_product?.price || 0) *
                                Math.ceil(item.quantity_needed),
                              0
                            )
                          )}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          인분당 약{" "}
                          {formatPrice(
                            matchedItems.reduce(
                              (sum, item) =>
                                sum +
                                (item.matched_product?.price || 0) *
                                Math.ceil(item.quantity_needed),
                              0
                            ) / servings
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleAddToCart}
                  disabled={matchedItems.length === 0}
                  className="w-full"
                  size="lg"
                  variant="primary"
                >
                  {matchedItems.length === 0
                    ? "구매 가능한 재료가 없습니다"
                    : `${matchedItems.length}개 재료 장바구니 담기`}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
