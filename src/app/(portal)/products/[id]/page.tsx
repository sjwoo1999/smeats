"use client";

import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Image from "next/image";

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
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
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
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-20 text-center text-lg font-semibold">
                {quantity} {product.unit}
              </span>
              <Button
                variant="outline"
                size="md"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </div>
            <p className="text-sm text-text-secondary">
              재고: {product.stock}{product.unit}
            </p>
          </div>

          {/* Total Price */}
          <Card className="bg-bg-subtle">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-text">총 금액</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
            </CardContent>
          </Card>

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

          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">판매자 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">상호명</span>
                <span className="text-text font-medium">
                  {product.seller.business_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">연락처</span>
                <span className="text-text font-medium">
                  {product.seller.contact_phone}
                </span>
              </div>
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
