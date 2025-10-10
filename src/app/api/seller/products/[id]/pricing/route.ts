import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { PricingSchema } from "@/lib/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 상품 소유권 확인
    const { data: product } = await supabase
      .from("products")
      .select("id, seller_id")
      .eq("id", id)
      .eq("seller_id", user.id)
      .single();

    if (!product) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = PricingSchema.parse(body);

    // 기존 pricing 조회
    const { data: existingPricing } = await supabase
      .from("product_pricing")
      .select("id")
      .eq("product_id", id)
      .single();

    const pricingData = {
      product_id: id,
      ...validated,
    };

    if (existingPricing) {
      // 업데이트
      const { error } = await supabase
        .from("product_pricing")
        .update(pricingData)
        .eq("id", existingPricing.id);

      if (error) {
        console.error("Pricing update error:", error);
        return NextResponse.json(
          { error: "가격 업데이트 실패" },
          { status: 500 }
        );
      }
    } else {
      // 삽입
      const { error } = await supabase
        .from("product_pricing")
        .insert(pricingData);

      if (error) {
        console.error("Pricing insert error:", error);
        return NextResponse.json(
          { error: "가격 생성 실패" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pricing API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
