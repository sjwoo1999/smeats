"use server";

import { revalidateTag } from "next/cache";
import {
  ProductSearchSchema,
  type ProductSearchParams,
  type ProductWithSeller,
  type ApiResponse,
} from "@/lib/types";
import { mockProducts } from "@/lib/mock-data";

// Mock mode flag
const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Search products with delivery zone filtering (API response format)
 * Groups by (name, unit) and marks lowest price
 */
export async function searchProducts(
  params: ProductSearchParams
): Promise<ApiResponse<{ products: ProductWithSeller[]; grouped: number }>> {
  try {
    // Validate search params
    const validated = ProductSearchSchema.parse(params);

    if (USE_MOCK_DATA) {
      // Mock data implementation
      let filteredProducts = [...mockProducts];

      // Apply search filters
      if (validated.q) {
        filteredProducts = filteredProducts.filter((p) =>
          p.name.toLowerCase().includes(validated.q!.toLowerCase())
        );
      }

      if (validated.category) {
        filteredProducts = filteredProducts.filter((p) => p.category === validated.category);
      }

      if (validated.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter((p) => p.price >= validated.minPrice!);
      }

      if (validated.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter((p) => p.price <= validated.maxPrice!);
      }

      // Transform to ProductWithSeller type
      const transformedProducts: ProductWithSeller[] = filteredProducts.map((p) => ({
        id: p.id,
        seller_id: p.seller_id,
        name: p.name,
        category: p.category,
        price: p.price,
        unit: p.unit,
        origin: "국내산",
        stock: p.stock,
        image_path: p.image_url,
        seller: {
          business_name: "테스트 판매자",
          contact_phone: "010-1234-5678",
        },
      }));

      // Group by (name, unit) and mark lowest price
      const grouped = groupAndMarkLowestPrice(transformedProducts);

      // Apply pagination
      const start = (validated.page - 1) * validated.limit;
      const end = start + validated.limit;

      const paginatedProducts = grouped.slice(start, end);
      const groupedCount = paginatedProducts.filter((p) => p.is_lowest_price).length;

      return {
        success: true,
        data: {
          products: paginatedProducts,
          grouped: groupedCount,
        },
      };
    }

    // Original Supabase implementation would go here
    // For now, return empty if not in mock mode
    return {
      success: true,
      data: { products: [], grouped: 0 },
    };
  } catch (error) {
    console.error("Search products error:", error);
    return {
      success: false,
      error: "상품 검색 중 오류가 발생했습니다",
    };
  }
}

/**
 * Group products by (name, unit) and mark the lowest price in each group
 */
function groupAndMarkLowestPrice(
  products: ProductWithSeller[]
): ProductWithSeller[] {
  // Group by name + unit
  const groups = new Map<string, ProductWithSeller[]>();

  for (const product of products) {
    const key = `${product.name}|${product.unit}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(product);
  }

  // Sort each group by price and mark lowest
  const result: ProductWithSeller[] = [];

  for (const group of groups.values()) {
    // Sort by price ascending
    const sorted = group.sort((a, b) => a.price - b.price);

    // Mark the first item (lowest price) in each group
    sorted[0].is_lowest_price = true;

    result.push(...sorted);
  }

  return result;
}

/**
 * Get single product by ID
 */
export async function getProduct(id: string): Promise<ProductWithSeller | null> {
  try {
    if (USE_MOCK_DATA) {
      const product = mockProducts.find((p) => p.id === id);
      if (!product) return null;

      return {
        id: product.id,
        seller_id: product.seller_id,
        name: product.name,
        category: product.category,
        price: product.price,
        unit: product.unit,
        origin: "국내산",
        stock: product.stock,
        image_path: product.image_url,
        seller: {
          business_name: "테스트 판매자",
          contact_phone: "010-1234-5678",
        },
      };
    }

    // Original Supabase implementation would go here
    return null;
  } catch (error) {
    console.error("Get product error:", error);
    return null;
  }
}

/**
 * Get product categories
 */
export async function getCategories(): Promise<string[]> {
  try {
    if (USE_MOCK_DATA) {
      const categories = Array.from(new Set(mockProducts.map((p) => p.category)));
      return categories.sort();
    }

    // Original Supabase implementation would go here
    return [];
  } catch (error) {
    console.error("Get categories error:", error);
    return [];
  }
}

/**
 * Revalidate products cache
 */
export async function revalidateProducts() {
  revalidateTag("products");
}
