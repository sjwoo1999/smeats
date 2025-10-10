"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/lib/mock-data";

export default function SellerProductsPage() {
  const [products] = useState(mockProducts.filter(p => p.seller_id === "seller1"));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">상품 관리</h1>
          <p className="mt-2 text-text-secondary">
            등록된 상품을 관리하고 새 상품을 추가할 수 있습니다.
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
          + 새 상품 등록 (데모)
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden bg-bg-subtle">
              {product.image_path && (
                <img
                  src={product.image_path}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant="success">판매중</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">카테고리</span>
                <span className="font-medium text-text">{product.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">판매가</span>
                <span className="font-bold text-primary">{formatPrice(product.price)}/{product.unit}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">재고</span>
                <span className="font-medium text-text">{product.stock}{product.unit}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">최소 주문</span>
                <span className="font-medium text-text">{product.min_order}{product.unit}</span>
              </div>
              <div className="pt-3 border-t border-border flex gap-2">
                <button className="flex-1 px-3 py-2 text-sm border border-border rounded-lg hover:bg-bg-subtle transition-colors">
                  수정
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors">
                  삭제
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (if no products) */}
      {products.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-bg-subtle flex items-center justify-center">
              <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">등록된 상품이 없습니다</h3>
              <p className="mt-1 text-sm text-text-secondary">
                첫 상품을 등록하여 판매를 시작해보세요.
              </p>
            </div>
            <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
              상품 등록하기 (데모)
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
