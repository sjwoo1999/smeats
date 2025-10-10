import { redirect } from "next/navigation";
import { getUserProfile, createServerSupabaseClient } from "@/lib/supabase";
import { PricingManagement } from "./pricing-management";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const profile = await getUserProfile();

  if (!profile || profile.role !== "seller") {
    redirect("/");
  }

  const supabase = await createServerSupabaseClient();

  // 판매자 상품 목록
  const { data: products } = await supabase
    .from("products")
    .select(
      `
      *,
      product_pricing (
        id,
        base_price,
        discount_type,
        discount_value,
        discount_start_date,
        discount_end_date,
        markup_percentage,
        markup_reason
      )
    `
    )
    .eq("seller_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">가격 관리</h1>
      <PricingManagement products={products || []} />
    </div>
  );
}
