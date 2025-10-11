"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 가격 조정 정책 설정
const PRICING_POLICY = {
  MAX_DISCOUNT_PERCENTAGE: 50, // 최대 할인율 50%
  MAX_MARKUP_PERCENTAGE: 100, // 최대 인상률 100%
  APPROVAL_THRESHOLD: {
    discount: 30, // 30% 이상 할인 시 관리자 승인 필요
    markup: 50, // 50% 이상 인상 시 관리자 승인 필요
  },
} as const;

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

  const validatePricing = () => {
    const warnings: string[] = [];
    const errors: string[] = [];

    // 할인율 검증
    if (
      formData.discount_type === "percentage" &&
      formData.discount_value > 0
    ) {
      if (formData.discount_value > PRICING_POLICY.MAX_DISCOUNT_PERCENTAGE) {
        errors.push(
          `할인율은 최대 ${PRICING_POLICY.MAX_DISCOUNT_PERCENTAGE}%까지 가능합니다.`
        );
      } else if (
        formData.discount_value >= PRICING_POLICY.APPROVAL_THRESHOLD.discount
      ) {
        warnings.push(
          `${formData.discount_value}% 할인은 관리자 승인이 필요할 수 있습니다.`
        );
      }
    }

    // 인상률 검증
    if (formData.markup_percentage > 0) {
      if (formData.markup_percentage > PRICING_POLICY.MAX_MARKUP_PERCENTAGE) {
        errors.push(
          `인상률은 최대 ${PRICING_POLICY.MAX_MARKUP_PERCENTAGE}%까지 가능합니다.`
        );
      } else if (
        formData.markup_percentage >= PRICING_POLICY.APPROVAL_THRESHOLD.markup
      ) {
        warnings.push(
          `${formData.markup_percentage}% 인상은 관리자 승인이 필요할 수 있습니다.`
        );
      }
    }

    return { warnings, errors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { warnings, errors } = validatePricing();

    // 에러가 있으면 제출 중단
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    // 경고가 있으면 사용자에게 확인
    if (warnings.length > 0) {
      const confirmed = confirm(
        `다음 경고사항을 확인하세요:\n\n${warnings.join("\n")}\n\n계속 진행하시겠습니까?`
      );
      if (!confirmed) return;
    }

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
  const { warnings, errors } = validatePricing();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 정책 안내 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span>ℹ️</span>
            <span>가격 조정 정책</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p>• 최대 할인율: {PRICING_POLICY.MAX_DISCOUNT_PERCENTAGE}%</p>
          <p>• 최대 인상률: {PRICING_POLICY.MAX_MARKUP_PERCENTAGE}%</p>
          <p className="text-xs text-gray-600 mt-2">
            ⚠️ 할인율 {PRICING_POLICY.APPROVAL_THRESHOLD.discount}% 이상 또는
            인상률 {PRICING_POLICY.APPROVAL_THRESHOLD.markup}% 이상 시 관리자
            승인이 필요할 수 있습니다.
          </p>
        </CardContent>
      </Card>

      {/* 실시간 검증 피드백 */}
      {(errors.length > 0 || warnings.length > 0) && (
        <Card
          className={
            errors.length > 0
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
          }
        >
          <CardContent className="pt-4">
            <div className="space-y-2">
              {errors.map((error, idx) => (
                <p key={idx} className="text-sm text-red-700 flex items-start gap-2">
                  <span>❌</span>
                  <span>{error}</span>
                </p>
              ))}
              {warnings.map((warning, idx) => (
                <p key={idx} className="text-sm text-yellow-700 flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{warning}</span>
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
            <label className="block text-sm font-medium mb-2">
              인상률 (%) - 최대 {PRICING_POLICY.MAX_MARKUP_PERCENTAGE}%
            </label>
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
              max={PRICING_POLICY.MAX_MARKUP_PERCENTAGE}
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
            <label className="block text-sm font-medium mb-2">
              할인 값
              {formData.discount_type === "percentage" &&
                ` - 최대 ${PRICING_POLICY.MAX_DISCOUNT_PERCENTAGE}%`}
            </label>
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
              max={
                formData.discount_type === "percentage"
                  ? PRICING_POLICY.MAX_DISCOUNT_PERCENTAGE
                  : undefined
              }
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
