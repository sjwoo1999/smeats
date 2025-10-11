"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Database } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  product_pricing?: Database["public"]["Tables"]["product_pricing"]["Row"][];
};

interface PricingManagementProps {
  products: Product[];
}

export default function PricingManagement({ products }: PricingManagementProps) {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* 일괄 수정 버튼 */}
      {selectedProducts.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <p className="font-medium">
              {selectedProducts.length}개 상품 선택됨
            </p>
            <Button onClick={() => setShowBatchModal(true)}>
              일괄 가격 수정
            </Button>
          </div>
        </Card>
      )}

      {/* 상품 목록 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded">
          <input
            type="checkbox"
            checked={selectedProducts.length === products.length}
            onChange={toggleAll}
            className="w-4 h-4"
          />
          <span className="font-medium">전체 선택</span>
        </div>

        {products.map((product) => (
          <ProductPricingCard
            key={product.id}
            product={product}
            isSelected={selectedProducts.includes(product.id)}
            onToggle={() => toggleProduct(product.id)}
          />
        ))}
      </div>

      {/* 일괄 수정 모달 */}
      {showBatchModal && (
        <BatchPricingModal
          productIds={selectedProducts}
          onClose={() => setShowBatchModal(false)}
          onSuccess={() => {
            setShowBatchModal(false);
            setSelectedProducts([]);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function ProductPricingCard({
  product,
  isSelected,
  onToggle,
}: {
  product: Product;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const pricing = product.product_pricing?.[0];
  const [formData, setFormData] = useState({
    base_price: pricing?.base_price || product.price,
    discount_type: pricing?.discount_type || "percentage",
    discount_value: pricing?.discount_value || 0,
    markup_percentage: pricing?.markup_percentage || 0,
  });

  // 정책 제한
  const MAX_DISCOUNT_PERCENTAGE = 50; // 최대 할인율 50%
  const MAX_MARKUP_PERCENTAGE = 100;  // 최대 인상률 100%
  const MIN_FINAL_PRICE = 100;        // 최소 판매가 100원

  const calculateFinalPrice = () => {
    let price = formData.base_price * (1 + formData.markup_percentage / 100);
    if (formData.discount_type === "percentage") {
      price *= 1 - (formData.discount_value || 0) / 100;
    } else if (formData.discount_type === "fixed") {
      price -= formData.discount_value || 0;
    }
    return Math.floor(Math.max(price, 0));
  };

  const handleSave = async () => {
    // 정책 검증
    if (formData.discount_type === "percentage" && formData.discount_value > MAX_DISCOUNT_PERCENTAGE) {
      alert(`할인율은 최대 ${MAX_DISCOUNT_PERCENTAGE}%까지 가능합니다.`);
      return;
    }

    if (formData.markup_percentage > MAX_MARKUP_PERCENTAGE) {
      alert(`인상률은 최대 ${MAX_MARKUP_PERCENTAGE}%까지 가능합니다.`);
      return;
    }

    const finalPrice = calculateFinalPrice();
    if (finalPrice < MIN_FINAL_PRICE) {
      alert(`최종 판매가는 최소 ${MIN_FINAL_PRICE}원 이상이어야 합니다.`);
      return;
    }

    setLoading(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log("가격 업데이트 (목업):", { product: product.id, ...formData });
    alert("가격이 업데이트되었습니다. (목업 모드)");
    setEditing(false);
    setLoading(false);
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 mt-1"
        />

        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">
                현재가: ₩{product.price.toLocaleString()}/{product.unit}
              </p>
            </div>
            {!editing && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                수정
              </Button>
            )}
          </div>

          {editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
              <div>
                <label className="block text-sm font-medium mb-1">기본 단가</label>
                <Input
                  type="number"
                  value={formData.base_price}
                  onChange={(e) =>
                    setFormData({ ...formData, base_price: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  인상률 (%) <span className="text-xs text-gray-500">최대 {MAX_MARKUP_PERCENTAGE}%</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  max={MAX_MARKUP_PERCENTAGE}
                  value={formData.markup_percentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      markup_percentage: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">할인 유형</label>
                <select
                  value={formData.discount_type || "percentage"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_type: e.target.value as "percentage" | "fixed",
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="percentage">비율 (%)</option>
                  <option value="fixed">정액 (원)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  할인 {formData.discount_type === "percentage" ? "%" : "금액"}
                  {formData.discount_type === "percentage" && (
                    <span className="text-xs text-gray-500 ml-1">최대 {MAX_DISCOUNT_PERCENTAGE}%</span>
                  )}
                </label>
                <Input
                  type="number"
                  step={formData.discount_type === "percentage" ? "0.01" : "1"}
                  max={formData.discount_type === "percentage" ? MAX_DISCOUNT_PERCENTAGE : undefined}
                  value={formData.discount_value || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_value: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="md:col-span-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">최종 판매가</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₩{calculateFinalPrice().toLocaleString()}
                      <span className="text-sm font-normal text-gray-600">
                        /{product.unit}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditing(false)}
                      disabled={loading}
                    >
                      취소
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                      {loading ? "저장 중..." : "저장"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function BatchPricingModal({
  productIds,
  onClose,
  onSuccess,
}: {
  productIds: string[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState<"discount" | "markup">("discount");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState(0);

  const handleApply = async () => {
    setLoading(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("일괄 가격 수정 (목업):", { productIds, operation, type, value });
    alert(`${productIds.length}개 상품 가격이 업데이트되었습니다. (목업 모드)`);
    onSuccess();
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        className="max-w-md w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold">일괄 가격 수정</h3>

        <div>
          <label className="block text-sm font-medium mb-2">작업 유형</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as "discount" | "markup")}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="discount">할인 적용</option>
            <option value="markup">인상률 적용</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {operation === "discount" ? "할인" : "인상"} 유형
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="percentage">비율 (%)</option>
            <option value="fixed">정액 (원)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            값 {type === "percentage" ? "(%)" : "(원)"}
          </label>
          <Input
            type="number"
            step={type === "percentage" ? "0.01" : "1"}
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            취소
          </Button>
          <Button onClick={handleApply} disabled={loading} className="flex-1">
            {loading ? "적용 중..." : `${productIds.length}개 상품에 적용`}
          </Button>
        </div>
      </Card>
    </div>
  );
}
