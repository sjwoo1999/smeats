"use server";

import { revalidateTag } from "next/cache";
import { createServerSupabaseClient, getUserProfile } from "@/lib/supabase";
import {
  ProductSearchSchema,
  type ProductSearchParams,
  type ProductWithSeller,
} from "@/lib/types";

/**
 * Search products with delivery zone filtering
 * Groups by (name, unit) and marks lowest price
 */
export async function searchProducts(
  params: ProductSearchParams
): Promise<ProductWithSeller[]> {
  try {
    // Validate search params
    const validated = ProductSearchSchema.parse(params);

    const supabase = await createServerSupabaseClient();
    const profile = await getUserProfile();

    // Check bypass flag for development
    const bypassFilter =
      process.env.NEXT_PUBLIC_BYPASS_DELIVERY_FILTER === "true";

    // Base query: products with seller info and delivery zones
    let query = supabase
      .from("products")
      .select(
        `
        id,
        seller_id,
        name,
        category,
        price,
        unit,
        origin,
        stock,
        image_path,
        seller:profiles!seller_id (
          business_name,
          contact_phone,
          location
        )
      `
      )
      .gt("stock", 0); // Only show products in stock

    // Apply search filters
    if (validated.q) {
      query = query.ilike("name", `%${validated.q}%`);
    }

    if (validated.category) {
      query = query.eq("category", validated.category);
    }

    if (validated.minPrice !== undefined) {
      query = query.gte("price", validated.minPrice);
    }

    if (validated.maxPrice !== undefined) {
      query = query.lte("price", validated.maxPrice);
    }

    // Execute query
    const { data: products, error } = await query;

    if (error) {
      console.error("Products query error:", error);
      return [];
    }

    if (!products || products.length === 0) {
      return [];
    }

    // Apply radius delivery filter if customer has location
    let filteredProducts = products;

    if (
      !bypassFilter &&
      profile?.role === "customer" &&
      profile?.location
    ) {
      // TODO: Implement PostGIS radius filter
      // For now, we'll need to filter this via a custom RPC or raw SQL
      // This requires the customer's lat/lng and seller's delivery_zones

      // Get customer location (parsed from PostGIS geography)
      // const customerLat = ...
      // const customerLng = ...

      // Filter products based on delivery zones
      // filteredProducts = await filterByDeliveryZones(
      //   products,
      //   customerLat,
      //   customerLng
      // );

      // For MVP, we'll use a simplified approach via RPC
      // Developers should implement the RPC: check_delivery_available(product_id, customer_id)
    }

    // Transform to ProductWithSeller type
    const transformedProducts: ProductWithSeller[] = filteredProducts.map(
      (p) => ({
        id: p.id,
        seller_id: p.seller_id,
        name: p.name,
        category: p.category,
        price: p.price,
        unit: p.unit,
        origin: p.origin,
        stock: p.stock,
        image_path: p.image_path,
        seller: {
          business_name: Array.isArray(p.seller)
            ? p.seller[0]?.business_name || null
            : (p.seller as any)?.business_name || null,
          contact_phone: Array.isArray(p.seller)
            ? p.seller[0]?.contact_phone || null
            : (p.seller as any)?.contact_phone || null,
        },
      })
    );

    // Group by (name, unit) and mark lowest price
    const grouped = groupAndMarkLowestPrice(transformedProducts);

    // Apply pagination
    const start = (validated.page - 1) * validated.limit;
    const end = start + validated.limit;

    return grouped.slice(start, end);
  } catch (error) {
    console.error("Search products error:", error);
    return [];
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
    const supabase = await createServerSupabaseClient();

    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
        id,
        seller_id,
        name,
        category,
        price,
        unit,
        origin,
        stock,
        image_path,
        seller:profiles!seller_id (
          business_name,
          contact_phone
        )
      `
      )
      .eq("id", id)
      .single();

    if (error || !product) {
      return null;
    }

    return {
      id: product.id,
      seller_id: product.seller_id,
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      origin: product.origin,
      stock: product.stock,
      image_path: product.image_path,
      seller: {
        business_name: Array.isArray(product.seller)
          ? product.seller[0]?.business_name || null
          : (product.seller as any)?.business_name || null,
        contact_phone: Array.isArray(product.seller)
          ? product.seller[0]?.contact_phone || null
          : (product.seller as any)?.contact_phone || null,
      },
    };
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
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select("category")
      .gt("stock", 0);

    if (error || !data) {
      return [];
    }

    // Get unique categories
    const categories = Array.from(
      new Set(data.map((p) => p.category).filter(Boolean))
    );

    return categories.sort();
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
