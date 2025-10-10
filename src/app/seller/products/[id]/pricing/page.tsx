import { redirect, notFound } from "next/navigation";
import { getUserProfile, createServerSupabaseClient } from "@/lib/supabase";
import { PricingForm } from "./pricing-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPricingPage({ params }: PageProps) {
  const { id } = await params;
  const profile = await getUserProfile();

  if (!profile || profile.role !== "seller") {
    redirect("/");
  }

  const supabase = await createServerSupabaseClient();

  // 상품 조회 (소유권 확인)
  const { data: product } = await supabase
    .from("products")
    .select(
      `
      *,
      product_pricing (*)
    `
    )
    .eq("id", id)
    .eq("seller_id", profile.id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{product.name} - 가격 설정</h1>
      <PricingForm product={product} />
    </div>
  );
}
