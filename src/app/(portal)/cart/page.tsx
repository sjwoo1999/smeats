"use client";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, setQuantity, remove, clear, totalAmount } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Group items by seller
  const itemsBySeller = items.reduce((acc, item) => {
    if (!acc[item.seller_id]) {
      acc[item.seller_id] = [];
    }
    acc[item.seller_id].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const handleCheckout = async (sellerId: string) => {
    setIsProcessing(true);
    // Navigate to checkout with seller items
    router.push(`/checkout?seller=${sellerId}`);
  };

  if (items.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text">장바구니</h1>
          <p className="mt-2 text-text-secondary">담긴 상품이 없습니다.</p>
        </div>

        <Card className="p-12 text-center">
          <div className="space-y-4">
            <svg
              className="mx-auto h-16 w-16 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-text">
                장바구니가 비어있습니다
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                원하는 상품을 장바구니에 담아보세요.
              </p>
            </div>
            <Button variant="primary" onClick={() => router.push("/products")}>
              상품 둘러보기
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">장바구니</h1>
          <p className="mt-2 text-text-secondary">
            총 {items.length}개 상품 ({Object.keys(itemsBySeller).length}개 판매자)
          </p>
        </div>
        <Button variant="outline" onClick={clear} disabled={isProcessing}>
          전체 삭제
        </Button>
      </div>

      {/* Cart Items by Seller */}
      <div className="space-y-6">
        {Object.entries(itemsBySeller).map(([sellerId, sellerItems]) => {
          const sellerTotal = sellerItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return (
            <Card key={sellerId} variant="bordered">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    판매자 {sellerId.substring(0, 8)}...
                  </CardTitle>
                  <Badge variant="info">
                    {sellerItems.length}개 상품
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Items */}
                  {sellerItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-neutral-100">
                        {item.image_path ? (
                          <Image
                            src={item.image_path}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <svg
                              className="h-8 w-8 text-neutral-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-text-secondary mt-1">
                          {formatPrice(item.price)} / {item.unit}
                        </p>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setQuantity(item.product_id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setQuantity(item.product_id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <p className="text-lg font-bold text-text">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => remove(item.product_id)}
                          className="text-danger hover:bg-danger-bg"
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Seller Total & Checkout */}
                  <div className="flex items-center justify-between pt-4 border-t border-border-strong">
                    <div>
                      <p className="text-sm text-text-secondary">판매자별 소계</p>
                      <p className="text-2xl font-bold text-text mt-1">
                        {formatPrice(sellerTotal)}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => handleCheckout(sellerId)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "처리중..." : "주문하기"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Total Summary */}
      <Card variant="elevated" className="sticky bottom-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">전체 주문 금액</p>
              <p className="text-3xl font-bold text-primary mt-1">
                {formatPrice(totalAmount)}
              </p>
            </div>
            <div className="text-right text-sm text-text-secondary">
              <p>상품 {items.length}개</p>
              <p>판매자 {Object.keys(itemsBySeller).length}곳</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
