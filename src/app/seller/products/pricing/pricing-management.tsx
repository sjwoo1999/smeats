"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Pricing {
  base_price: number;
  discount_type: string | null;
  discount_value: number | null;
  markup_percentage: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  product_pricing: Pricing[];
}

interface PricingManagementProps {
  products: Product[];
}

export function PricingManagement({ products }: PricingManagementProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [batchMode, setBatchMode] = useState(false);
  const [batchOperation, setBatchOperation] = useState<"discount" | "markup">(
    "discount"
  );
  const [batchValue, setBatchValue] = useState("");
  const [batchType, setBatchType] = useState<"percentage" | "fixed">(
    "percentage"
  );

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleBatchUpdate = async () => {
    if (!batchValue || selectedProducts.length === 0) {
      alert("상품을 선택하고 값을 입력하세요");
      return;
    }

    try {
      const response = await fetch("/api/seller/batch-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_ids: selectedProducts,
          operation: batchOperation,
          value: parseFloat(batchValue),
          type: batchType,
        }),
      });

      if (!response.ok) {
        throw new Error("일괄 수정 실패");
      }

      alert("가격이 성공적으로 업데이트되었습니다");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("가격 업데이트에 실패했습니다");
    }
  };

  const calculateFinalPrice = (
    basePrice: number,
    markup: number,
    discountType: string | null,
    discountValue: number | null
  ) => {
    let price = basePrice * (1 + (markup || 0) / 100);

    if (discountType === "percentage" && discountValue) {
      price = price * (1 - discountValue / 100);
    } else if (discountType === "fixed" && discountValue) {
      price = price - discountValue;
    }

    return Math.floor(Math.max(price, 0));
  };

  return (
    <div className="space-y-6">
      {/* 일괄 수정 모드 */}
      {batchMode && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>일괄 가격 수정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">작업 유형:</label>
              <select
                value={batchOperation}
                onChange={(e) =>
                  setBatchOperation(e.target.value as "discount" | "markup")
                }
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="discount">할인</option>
                <option value="markup">인상</option>
              </select>

              <select
                value={batchType}
                onChange={(e) =>
                  setBatchType(e.target.value as "percentage" | "fixed")
                }
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="percentage">비율 (%)</option>
                <option value="fixed">고정 금액 (원)</option>
              </select>

              <Input
                type="number"
                value={batchValue}
                onChange={(e) => setBatchValue(e.target.value)}
                placeholder="값 입력"
                className="w-32"
              />

              <Button onClick={handleBatchUpdate} disabled={selectedProducts.length === 0}>
                적용 ({selectedProducts.length}개 선택)
              </Button>

              <Button variant="outline" onClick={() => setBatchMode(false)}>
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          총 {products.length}개 상품
        </div>
        {!batchMode && (
          <Button onClick={() => setBatchMode(true)}>일괄 수정</Button>
        )}
      </div>

      {/* 상품 목록 */}
      <div className="space-y-4">
        {products.map((product) => {
          const pricing = product.product_pricing?.[0];
          const basePrice = pricing?.base_price || product.price;
          const finalPrice = pricing
            ? calculateFinalPrice(
                pricing.base_price,
                pricing.markup_percentage,
                pricing.discount_type,
                pricing.discount_value
              )
            : product.price;

          return (
            <Card key={product.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  {batchMode && (
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="w-5 h-5"
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      단위: {product.unit}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">기본 단가</p>
                      <p className="text-sm font-medium">
                        ₩{basePrice.toLocaleString()}
                      </p>
                    </div>

                    {pricing && (
                      <>
                        {pricing.markup_percentage > 0 && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500">인상률</p>
                            <p className="text-sm text-orange-600">
                              +{pricing.markup_percentage}%
                            </p>
                          </div>
                        )}

                        {pricing.discount_value && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500">할인</p>
                            <p className="text-sm text-green-600">
                              {pricing.discount_type === "percentage"
                                ? `-${pricing.discount_value}%`
                                : `-₩${pricing.discount_value.toLocaleString()}`}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    <div className="text-right border-l pl-6">
                      <p className="text-xs text-gray-500">최종 판매가</p>
                      <p className="text-lg font-bold text-blue-600">
                        ₩{finalPrice.toLocaleString()}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        (window.location.href = `/seller/products/${product.id}/pricing`)
                      }
                    >
                      수정
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
