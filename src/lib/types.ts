import { z } from "zod";

/**
 * Validation schemas using Zod
 * These schemas enforce business rules at runtime
 */

// Auth & Profile
export const SignupSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력하세요"),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .regex(
      /^(?=.*[a-z])(?=.*\d)/,
      "비밀번호는 영문 소문자와 숫자를 포함해야 합니다"
    ),
  role: z.enum(["customer", "seller"], {
    required_error: "역할을 선택하세요",
  }),
});

export type SignupInput = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력하세요"),
  password: z.string().min(1, "비밀번호를 입력하세요"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// Profile Update
export const ProfileUpdateSchema = z.object({
  business_name: z.string().min(1, "상호명을 입력하세요").optional(),
  contact_phone: z
    .string()
    .regex(/^0\d{1,2}-?\d{3,4}-?\d{4}$/, "유효한 전화번호를 입력하세요")
    .optional(),
  address: z.string().min(1, "주소를 입력하세요").optional(),
  adm_cd: z
    .string()
    .length(10, "법정동코드는 10자리여야 합니다")
    .optional()
    .nullable(),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

// Products
export const ProductSchema = z.object({
  name: z.string().min(1, "상품명을 입력하세요"),
  category: z.string().min(1, "카테고리를 선택하세요"),
  price: z.number().nonnegative("가격은 0 이상이어야 합니다"),
  unit: z.string().min(1, "단위를 입력하세요 (예: kg, 개)"),
  origin: z.string().optional().nullable(),
  stock: z.number().int().nonnegative("재고는 0 이상 정수여야 합니다"),
  image_path: z.string().optional().nullable(),
});

export type ProductInput = z.infer<typeof ProductSchema>;

// Delivery Zones
export const RadiusZoneValueSchema = z.object({
  km: z.number().positive("반경은 양수여야 합니다"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const DistrictZoneValueSchema = z.object({
  codes: z
    .array(z.string().length(10, "법정동코드는 10자리여야 합니다"))
    .min(1, "최소 1개 이상의 행정구역을 선택하세요"),
});

export const ZoneSchema = z.object({
  zone_type: z.enum(["radius", "district"], {
    required_error: "배송 권역 유형을 선택하세요",
  }),
  zone_value: z.union([RadiusZoneValueSchema, DistrictZoneValueSchema]),
  min_order_amount: z.number().nonnegative("최소 주문금액은 0 이상이어야 합니다"),
  delivery_fee: z.number().nonnegative("배송비는 0 이상이어야 합니다"),
  free_delivery_threshold: z
    .number()
    .nonnegative()
    .optional()
    .nullable()
    .transform((val) => val ?? null),
});

export type ZoneInput = z.infer<typeof ZoneSchema>;
export type RadiusZoneValue = z.infer<typeof RadiusZoneValueSchema>;
export type DistrictZoneValue = z.infer<typeof DistrictZoneValueSchema>;

// Orders
export const OrderItemSchema = z.object({
  product_id: z.string().uuid("유효한 상품 ID가 아닙니다"),
  quantity: z.number().int().positive("수량은 1 이상이어야 합니다"),
  price_at_order: z.number().nonnegative(),
});

export const OrderPayloadSchema = z.object({
  seller_id: z.string().uuid("유효한 판매자 ID가 아닙니다"),
  delivery_address: z.string().min(1, "배송 주소를 입력하세요"),
  delivery_note: z.string().optional().nullable(),
  items: z.array(OrderItemSchema).min(1, "최소 1개 이상의 상품이 필요합니다"),
});

export type OrderPayload = z.infer<typeof OrderPayloadSchema>;
export type OrderItemInput = z.infer<typeof OrderItemSchema>;

// Recipe Calculation
export const RecipeCalculationSchema = z.object({
  recipe_id: z.string().uuid(),
  servings: z.number().int().min(1).max(200, "인분은 1~200 사이여야 합니다"),
});

export type RecipeCalculation = z.infer<typeof RecipeCalculationSchema>;

// Cart Item (client-side state)
export const CartItemSchema = z.object({
  product_id: z.string().uuid(),
  seller_id: z.string().uuid(),
  name: z.string(),
  price: z.number().nonnegative(),
  unit: z.string(),
  quantity: z.number().int().positive(),
  image_path: z.string().optional().nullable(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

// Search/Filter params
export const ProductSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type ProductSearchParams = z.infer<typeof ProductSearchSchema>;

// Admin filters
export const AdminOrderFilterSchema = z.object({
  status: z
    .enum(["pending", "preparing", "shipping", "completed", "cancelled"])
    .optional(),
  seller_id: z.string().uuid().optional(),
  customer_id: z.string().uuid().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type AdminOrderFilter = z.infer<typeof AdminOrderFilterSchema>;

// API Response types
export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

// User roles
export type UserRole = "customer" | "seller" | "admin";

// Order status
export type OrderStatus =
  | "pending"
  | "preparing"
  | "shipping"
  | "completed"
  | "cancelled";

// Product with seller info (for customer view)
export interface ProductWithSeller {
  id: string;
  seller_id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  origin: string | null;
  stock: number;
  image_path: string | null;
  seller: {
    business_name: string | null;
    contact_phone: string | null;
  };
  is_lowest_price?: boolean;
}

// Recipe with items
export interface RecipeWithItems {
  id: string;
  name: string;
  category: string;
  description: string | null;
  image_path: string | null;
  items: RecipeItem[];
}

export interface RecipeItem {
  id: string;
  ingredient_name: string;
  unit: string;
  quantity_per_serving: number;
}

// Recipe calculation result
export interface RecipeCalculationResult {
  recipe: RecipeWithItems;
  servings: number;
  items: RecipeCalculationItem[];
}

export interface RecipeCalculationItem {
  ingredient_name: string;
  unit: string;
  quantity_needed: number;
  matched_product: ProductWithSeller | null;
  can_add_to_cart: boolean;
}

// Order with items and relations
export interface OrderWithDetails {
  id: string;
  customer_id: string;
  seller_id: string;
  status: OrderStatus;
  total_amount: number;
  delivery_address: string;
  delivery_note: string | null;
  created_at: string;
  updated_at: string;
  customer: {
    email: string;
    business_name: string | null;
    contact_phone: string | null;
  };
  seller: {
    business_name: string | null;
    contact_phone: string | null;
  };
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_order: number;
  product: {
    name: string;
    unit: string;
    image_path: string | null;
  };
}
