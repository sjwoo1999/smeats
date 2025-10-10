import PricingManagement from "./pricing-management";

// Mock products with pricing data
const mockProducts = [
  {
    id: "1",
    seller_id: "seller-1",
    name: "한우 등심 1등급",
    category: "육류",
    price: 45000,
    unit: "kg",
    origin: "국내산",
    stock: 50,
    image_path: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_pricing: [
      {
        id: "p1",
        product_id: "1",
        base_price: 42000,
        discount_type: "percentage" as const,
        discount_value: 5,
        discount_start_date: null,
        discount_end_date: null,
        markup_percentage: 10,
        markup_reason: "프리미엄 품질",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "2",
    seller_id: "seller-1",
    name: "대패 삼겹살",
    category: "육류",
    price: 18000,
    unit: "kg",
    origin: "국내산",
    stock: 100,
    image_path: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_pricing: [],
  },
  {
    id: "3",
    seller_id: "seller-1",
    name: "냉동 새우",
    category: "해산물",
    price: 32000,
    unit: "kg",
    origin: "베트남",
    stock: 30,
    image_path: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_pricing: [],
  },
];

export default function SellerPricingPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        ℹ️ 목업 모드: 실제 데이터베이스와 연결되지 않습니다.
      </div>
      <h1 className="text-2xl font-bold mb-6">가격 관리</h1>
      <PricingManagement products={mockProducts} />
    </div>
  );
}
