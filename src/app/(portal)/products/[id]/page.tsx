"use client";

import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuantityInput } from "@/components/ui/quantity-input";
import { useState } from "react";
import Image from "next/image";
import { DeliveryInfo, SellerInfo } from "@/components/DeliverySellerInfo";

// Mock product detail - in real app, fetch from server action
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Mock product data - replace with actual server action
  const product = {
    id: params.id as string,
    seller_id: "seller-123",
    name: "프리미엄 한우 등심",
    category: "육류",
    price: 45000,
    unit: "kg",
    origin: "국내산 (한우)",
    stock: 50,
    image_path: "https://images.unsplash.com/photo-1558030006-450675393462?w=800",
    description:
      "최고급 1등급 한우 등심입니다. 신선한 상태로 당일 배송됩니다. 마블링이 풍부하여 부드러운 식감을 자랑합니다.",
    seller: {
      business_name: "한우마트",
      contact_phone: "02-1234-5678",
      rating: 4.8,
      recent_sales: 156,
      business_hours: [
        { day_of_week: 1, open_time: "08:00", close_time: "20:00" },
        { day_of_week: 2, open_time: "08:00", close_time: "20:00" },
        { day_of_week: 3, open_time: "08:00", close_time: "20:00" },
        { day_of_week: 4, open_time: "08:00", close_time: "20:00" },
        { day_of_week: 5, open_time: "08:00", close_time: "20:00" },
        { day_of_week: 6, open_time: "09:00", close_time: "18:00" },
      ],
    },
    delivery: {
      fee: 3000,
      free_threshold: 50000,
      avg_delivery_days: 1,
      schedule: { start: "09:00", end: "18:00" },
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const handleBackToList = () => {
    router.push("/products");
  };

  const handleAddToCart = async () => {
    setIsAdding(true);

    add({
      product_id: product.id,
      seller_id: product.seller_id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity,
      image_path: product.image_path,
    });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsAdding(false);

    // Show success notification (you can add a toast component later)
    alert(`${product.name} ${quantity}${product.unit}를 장바구니에 담았습니다.`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBackToList}
        className="mb-4"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        상품 목록으로
      </Button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary">
        <button onClick={() => router.push("/products")} className="hover:text-primary">
          상품
        </button>
        <span>/</span>
        <button onClick={() => router.push(`/products?category=${product.category}`)} className="hover:text-primary">
          {product.category}
        </button>
        <span>/</span>
        <span className="text-text">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
          <Image
            src={product.image_path}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="default" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-text">{product.name}</h1>
            <p className="text-sm text-text-secondary mt-2">{product.origin}</p>
          </div>

          <div className="border-y border-border py-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <span className="text-lg text-text-secondary">/ {product.unit}</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text">수량</label>
            <QuantityInput
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={product.stock}
              unit={product.unit}
              price={product.price}
            />
            <p className="text-sm text-text-secondary">
              재고: {product.stock}{product.unit}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? "담는 중..." : "장바구니 담기"}
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              바로 구매
            </Button>
          </div>

          {/* Delivery Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>🚚</span>
                <span>배송 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DeliveryInfo
                fee={product.delivery.fee}
                freeThreshold={product.delivery.free_threshold}
                avgDays={product.delivery.avg_delivery_days}
                schedule={product.delivery.schedule}
              />
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-gray-600">
                  💡 {product.delivery.free_threshold?.toLocaleString("ko-KR")}원 이상 구매 시
                  배송비가 무료입니다!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">판매자 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <SellerInfo
                businessName={product.seller.business_name}
                contactPhone={product.seller.contact_phone}
                rating={product.seller.rating}
                recentSales={product.seller.recent_sales}
                businessHours={product.seller.business_hours}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>상품 설명</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </CardContent>
      </Card>

      {/* Related Products - Placeholder */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text">연관 상품</h2>
        <Card className="p-8 text-center bg-bg-subtle">
          <p className="text-text-secondary">연관 상품 기능은 곧 추가될 예정입니다.</p>
        </Card>
      </div>
    </div>
  );
}
