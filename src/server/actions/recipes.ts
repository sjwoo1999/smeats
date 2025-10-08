"use server";

import { createServerSupabaseClient } from "@/lib/supabase";
import {
  RecipeCalculationSchema,
  type RecipeWithItems,
  type RecipeCalculationResult,
  type RecipeCalculationItem,
  type ProductWithSeller,
  type ApiResponse,
} from "@/lib/types";
import { searchProducts } from "./products";

/**
 * Browse recipes (API response format)
 */
export async function browseRecipes(): Promise<ApiResponse<RecipeWithItems[]>> {
  try {
    const recipes = await getRecipes();
    return {
      success: true,
      data: recipes,
    };
  } catch {
    return {
      success: false,
      error: "레시피를 불러오는데 실패했습니다",
    };
  }
}

/**
 * Get all recipe templates
 */
export async function getRecipes(): Promise<RecipeWithItems[]> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: recipes, error } = await supabase
      .from("recipes")
      .select(
        `
        id,
        name,
        category,
        description,
        image_path,
        items:recipe_items (
          id,
          ingredient_name,
          unit,
          quantity_per_serving
        )
      `
      )
      .order("category");

    if (error || !recipes) {
      console.error("Get recipes error:", error);
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (recipes as any[]).map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      description: r.description,
      image_path: r.image_path,
      items: Array.isArray(r.items) ? r.items : [],
    }));
  } catch (error) {
    console.error("Get recipes error:", error);
    return [];
  }
}

/**
 * Get single recipe with items
 */
export async function getRecipeWithItems(
  id: string
): Promise<RecipeWithItems | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: recipe, error } = await supabase
      .from("recipes")
      .select(
        `
        id,
        name,
        category,
        description,
        image_path,
        items:recipe_items (
          id,
          ingredient_name,
          unit,
          quantity_per_serving
        )
      `
      )
      .eq("id", id)
      .single();

    if (error || !recipe) {
      console.error("Get recipe error:", error);
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recipeData = recipe as any;

    return {
      id: recipeData.id,
      name: recipeData.name,
      category: recipeData.category,
      description: recipeData.description,
      image_path: recipeData.image_path,
      items: Array.isArray(recipeData.items) ? recipeData.items : [],
    };
  } catch (error) {
    console.error("Get recipe with items error:", error);
    return null;
  }
}

/**
 * Calculate recipe quantities and match with available products
 * Uses EXACT matching only: (ingredient_name == product.name) AND (unit == product.unit)
 */
export async function calculateRecipe(
  recipeId: string,
  servings: number
): Promise<RecipeCalculationResult | null> {
  try {
    // Validate input
    const validated = RecipeCalculationSchema.parse({
      recipe_id: recipeId,
      servings,
    });

    // Get recipe with items
    const recipe = await getRecipeWithItems(validated.recipe_id);
    if (!recipe) {
      return null;
    }

    // Get all available products (no filters, just in-stock)
    const productsResult = await searchProducts({
      page: 1,
      limit: 1000, // Get all products for matching
    });

    if (!productsResult.success) {
      return null;
    }

    const allProducts = productsResult.data.products;

    // Calculate quantities and match products
    const calculationItems: RecipeCalculationItem[] = recipe.items.map(
      (item) => {
        const quantityNeeded = item.quantity_per_serving * validated.servings;

        // EXACT match only - no fuzzy matching
        const matchedProduct = matchProductExact(item, allProducts);

        return {
          ingredient_name: item.ingredient_name,
          unit: item.unit,
          quantity_needed: quantityNeeded,
          matched_product: matchedProduct,
          can_add_to_cart: matchedProduct !== null && matchedProduct.stock > 0,
        };
      }
    );

    return {
      recipe,
      servings: validated.servings,
      items: calculationItems,
    };
  } catch (error) {
    console.error("Calculate recipe error:", error);
    return null;
  }
}

/**
 * Match a recipe ingredient to a product using EXACT name and unit matching
 * NO fuzzy matching - must be exact match on both fields
 */
function matchProductExact(
  ingredient: { ingredient_name: string; unit: string },
  products: ProductWithSeller[]
): ProductWithSeller | null {
  // Find exact match: name AND unit must match exactly
  const matched = products.find(
    (p) =>
      p.name.trim() === ingredient.ingredient_name.trim() &&
      p.unit.trim() === ingredient.unit.trim() &&
      p.stock > 0
  );

  // Return the lowest price match if multiple exist
  if (matched) {
    const allMatches = products.filter(
      (p) =>
        p.name.trim() === ingredient.ingredient_name.trim() &&
        p.unit.trim() === ingredient.unit.trim() &&
        p.stock > 0
    );

    // Sort by price and return cheapest
    const sorted = allMatches.sort((a, b) => a.price - b.price);
    return sorted[0] || null;
  }

  return null;
}

/**
 * Get recipe categories
 */
export async function getRecipeCategories(): Promise<string[]> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("recipes")
      .select("category");

    if (error || !data) {
      return [];
    }

    // Get unique categories
    const categories = Array.from(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new Set((data as any[]).map((r) => r.category).filter(Boolean))
    );

    return categories.sort();
  } catch (error) {
    console.error("Get recipe categories error:", error);
    return [];
  }
}
