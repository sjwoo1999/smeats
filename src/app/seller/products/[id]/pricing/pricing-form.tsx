"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  product_pricing?: {
    base_price: number;
    discount_type: string | null;
    discount_value: number | null;
    discount_start_date: string | null;
    discount_end_date: string | null;
    markup_percentage: number;
    markup_reason: string | null;
  }[];
}

interface PricingFormProps {
  product: Product;
}

export function PricingForm({ product }: PricingFormProps) {
  const router = useRouter();
  const pricing = product.product_pricing?.[0];

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    base_price: pricing?.base_price || product.price,
    discount_type: pricing?.discount_type || "percentage",
    discount_value: pricing?.discount_value || 0,
    discount_start_date: pricing?.discount_start_date?.slice(0, 10) || "",
    discount_end_date: pricing?.discount_end_date?.slice(0, 10) || "",
    markup_percentage: pricing?.markup_percentage || 0,
    markup_reason: pricing?.markup_reason || "",
  });

  const calculateFinalPrice = () => {
    let price = formData.base_price * (1 + formData.markup_percentage / 100);

    if (formData.discount_type === "percentage") {
      price = price * (1 - formData.discount_value / 100);
    } else if (formData.discount_type === "fixed") {
      price = price - formData.discount_value;
    }

    return Math.floor(Math.max(price, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/seller/products/${product.id}/pricing`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("가격 설정 실패");
      }

      alert("가격이 성공적으로 업데이트되었습니다");
      router.push("/seller/products/pricing");
    } catch (error) {
      console.error(error);
      alert("가격 업데이트에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const finalPrice = calculateFinalPrice();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>기본 단가</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={formData.base_price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  base_price: parseInt(e.target.value) || 0,
                })
              }
              min={0}
              required
            />
            <span className="text-sm text-gray-600">원 / {product.unit}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📈 인상률 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">인상률 (%)</label>
            <Input
              type="number"
              value={formData.markup_percentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  markup_percentage: parseFloat(e.target.value) || 0,
                })
              }
              min={0}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">인상 사유</label>
            <Input
              type="text"
              value={formData.markup_reason}
              onChange={(e) =>
                setFormData({ ...formData, markup_reason: e.target.value })
              }
              placeholder="예: 원재료 가격 상승"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📉 할인 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">할인 유형</label>
            <select
              value={formData.discount_type}
              onChange={(e) =>
                setFormData({ ...formData, discount_type: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="percentage">비율 (%)</option>
              <option value="fixed">고정 금액 (원)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">할인 값</label>
            <Input
              type="number"
              value={formData.discount_value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount_value: parseFloat(e.target.value) || 0,
                })
              }
              min={0}
              step={0.1}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                할인 시작일
              </label>
              <Input
                type="date"
                value={formData.discount_start_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_start_date: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                할인 종료일
              </label>
              <Input
                type="date"
                value={formData.discount_end_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_end_date: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 최종 가격 미리보기 */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">최종 판매가</p>
            <p className="text-3xl font-bold text-blue-600">
              ₩{finalPrice.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              (기본가 ₩{formData.base_price.toLocaleString()}
              {formData.markup_percentage > 0 &&
                ` +${formData.markup_percentage}%`}
              {formData.discount_value > 0 &&
                ` -${formData.discount_type === "percentage" ? `${formData.discount_value}%` : `₩${formData.discount_value}`}`}
              )
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          취소
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "저장 중..." : "저장하기"}
        </Button>
      </div>
    </form>
  );
}
