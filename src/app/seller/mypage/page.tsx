import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/supabase";
import { SellerProfileForm } from "./profile-form";

export default async function SellerMyPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  // 판매자만 접근 가능
  if (profile.role !== "seller") {
    redirect("/dashboard");
  }

  // Ensure all required fields exist with defaults
  const profileWithDefaults = {
    ...profile,
    business_name: profile.business_name ?? null,
    contact_phone: profile.contact_phone ?? null,
    address: profile.address ?? null,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">판매자 정보</h1>

      <div className="bg-white rounded-lg border p-6">
        <SellerProfileForm profile={profileWithDefaults} />
      </div>
    </div>
  );
}
