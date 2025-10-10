"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/lib/mock-data";

export default function AdminProductsPage() {
  // Mock pending products (심사 대기)
  const pendingProducts = [
    {
      ...mockProducts[0],
      id: "pending-1",
      status: "pending",
      seller_name: "신선마트",
      submitted_at: "2025-01-08",
    },
    {
      ...mockProducts[2],
      id: "pending-2",
      status: "pending",
      seller_name: "채소마켓",
      submitted_at: "2025-01-09",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">상품 심사</h1>
        <p className="mt-2 text-text-secondary">
          판매자가 등록한 상품을 심사하고 승인할 수 있습니다.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-text-secondary">심사 대기</p>
            <p className="text-2xl font-bold text-warning mt-1">12개</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-text-secondary">승인된 상품</p>
            <p className="text-2xl font-bold text-success mt-1">234개</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-text-secondary">반려된 상품</p>
            <p className="text-2xl font-bold text-error mt-1">8개</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button className="px-4 py-2 border-b-2 border-primary text-primary font-semibold">
          심사 대기 ({pendingProducts.length})
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text transition-colors">
          승인됨
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text transition-colors">
          반려됨
        </button>
      </div>

      {/* Pending Products */}
      <div className="space-y-4">
        {pendingProducts.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-bg-subtle flex-shrink-0">
                  {product.image_path && (
                    <img
                      src={product.image_path}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-text">{product.name}</h3>
                        <p className="text-sm text-text-secondary mt-1">
                          판매자: {product.seller_name} | 제출일: {formatDate(product.submitted_at)}
                        </p>
                      </div>
                      <Badge variant="warning">심사 대기</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-text-secondary">카테고리</p>
                      <p className="text-sm font-medium text-text">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">판매가</p>
                      <p className="text-sm font-bold text-primary">{formatPrice(product.price)}/{product.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">재고</p>
                      <p className="text-sm font-medium text-text">{product.stock}{product.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">최소 주문</p>
                      <p className="text-sm font-medium text-text">{product.min_order}{product.unit}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary">상품 설명</p>
                    <p className="text-sm text-text">{product.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-border flex gap-2">
                    <button className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors text-sm">
                      승인 (데모)
                    </button>
                    <button className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors text-sm">
                      반려 (데모)
                    </button>
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-bg-subtle transition-colors text-sm">
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {pendingProducts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-bg-subtle flex items-center justify-center">
              <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">심사 대기 중인 상품이 없습니다</h3>
              <p className="mt-1 text-sm text-text-secondary">
                모든 상품이 심사 완료되었습니다.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
