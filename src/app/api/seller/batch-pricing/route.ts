import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { BatchPricingSchema } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 판매자 권한 확인
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "seller") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = BatchPricingSchema.parse(body);

    // 상품 소유권 확인
    const { data: products } = await supabase
      .from("products")
      .select("id")
      .in("id", validated.product_ids)
      .eq("seller_id", user.id);

    if (!products || products.length !== validated.product_ids.length) {
      return NextResponse.json(
        { error: "일부 상품에 대한 권한이 없습니다" },
        { status: 403 }
      );
    }

    // 각 상품에 대해 가격 설정 업데이트
    const updates = validated.product_ids.map(async (productId) => {
      // 기존 pricing 조회
      const { data: existingPricing } = await supabase
        .from("product_pricing")
        .select("*")
        .eq("product_id", productId)
        .single();

      // 기본가 가져오기
      const { data: product } = await supabase
        .from("products")
        .select("price")
        .eq("id", productId)
        .single();

      const basePrice = existingPricing?.base_price || product?.price || 0;

      const updateData: {
        product_id: string;
        base_price: number;
        discount_type?: string;
        discount_value?: number;
        markup_percentage?: number;
      } = {
        product_id: productId,
        base_price: basePrice,
      };

      if (validated.operation === "discount") {
        updateData.discount_type = validated.type || "percentage";
        updateData.discount_value = validated.value;
      } else if (validated.operation === "markup") {
        updateData.markup_percentage = validated.value;
      }

      if (existingPricing) {
        // 업데이트
        return supabase
          .from("product_pricing")
          .update(updateData)
          .eq("id", existingPricing.id);
      } else {
        // 삽입
        return supabase.from("product_pricing").insert(updateData);
      }
    });

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      updated: validated.product_ids.length,
    });
  } catch (error) {
    console.error("Batch pricing error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
