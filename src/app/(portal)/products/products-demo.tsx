"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import ProductFilter, { SortOption } from "@/components/ProductFilter";
import { DeliveryInfo, SellerInfo } from "@/components/DeliverySellerInfo";
import { QuantityInput } from "@/components/ui/quantity-input";

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "한우 등심 1등급",
    category: "육류",
    price: 45000,
    unit: "kg",
    origin: "국내산",
    stock: 50,
    image_path: null,
    seller: {
      business_name: "프리미엄 정육점",
      contact_phone: "02-1234-5678",
    },
    delivery: {
      fee: 3000,
      freeThreshold: 50000,
      avgDays: 1,
      schedule: { start: "09:00", end: "18:00" },
    },
    sales_count: 234,
    rating: 4.8,
    recent_sales: 45,
  },
  {
    id: "2",
    name: "대패 삼겹살",
    category: "육류",
    price: 18000,
    unit: "kg",
    origin: "국내산",
    stock: 100,
    image_path: null,
    seller: {
      business_name: "신선육류 도매",
      contact_phone: "02-2345-6789",
    },
    delivery: {
      fee: 0,
      freeThreshold: 0,
      avgDays: 1,
      schedule: { start: "08:00", end: "17:00" },
    },
    sales_count: 456,
    rating: 4.9,
    recent_sales: 89,
  },
  {
    id: "3",
    name: "양파",
    category: "채소",
    price: 3500,
    unit: "kg",
    origin: "국내산",
    stock: 200,
    image_path: null,
    seller: {
      business_name: "신선 농산물",
      contact_phone: "02-3456-7890",
    },
    delivery: {
      fee: 2500,
      freeThreshold: 30000,
      avgDays: 2,
      schedule: { start: "07:00", end: "16:00" },
    },
    sales_count: 678,
    rating: 4.7,
    recent_sales: 156,
  },
];

export default function ProductsDemo() {
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const sortedProducts = [...mockProducts].sort((a, b) => {
    switch (sortOption) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "sales_desc":
        return b.sales_count - a.sales_count;
      case "rating_desc":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const getQuantity = (productId: string) => quantities[productId] || 1;
  const setQuantity = (productId: string, qty: number) => {
    setQuantities({ ...quantities, [productId]: qty });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        ℹ️ 목업 모드: 실제 데이터베이스와 연결되지 않습니다.
      </div>

      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>

      <ProductFilter
        currentSort={sortOption}
        onSortChange={setSortOption}
        showAdvancedFilters={true}
        onFilterChange={(filters) => console.log("필터 적용:", filters)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {sortedProducts.map((product) => (
          <Card key={product.id} className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  {product.category} | {product.origin}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  ₩{product.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">/{product.unit}</p>
              </div>
            </div>

            {/* 배송 정보 */}
            <DeliveryInfo
              fee={product.delivery.fee}
              freeThreshold={product.delivery.freeThreshold}
              avgDays={product.delivery.avgDays}
              schedule={product.delivery.schedule}
            />

            {/* 판매자 정보 */}
            <SellerInfo
              businessName={product.seller.business_name}
              contactPhone={product.seller.contact_phone}
              recentSales={product.recent_sales}
              rating={product.rating}
            />

            {/* 수량 입력 */}
            <div className="pt-4 border-t">
              <QuantityInput
                value={getQuantity(product.id)}
                onChange={(qty) => setQuantity(product.id, qty)}
                unit={product.unit}
                min={1}
                max={product.stock}
                price={product.price}
              />
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                장바구니
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                바로 구매
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
