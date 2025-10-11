import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { ProfileForm } from "./profile-form";

export default async function MyPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    console.error("Profile fetch error:", error);
    redirect("/login");
  }

  // 구매자만 접근 가능
  if (profile.role !== "customer") {
    redirect("/dashboard");
  }

  // Ensure all required fields exist with defaults
  const profileWithDefaults = {
    ...profile,
    region: profile.region ?? null,
    business_type: profile.business_type ?? null,
    store_name: profile.store_name ?? null,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">내 정보</h1>

      <div className="bg-white rounded-lg border p-6">
        <ProfileForm profile={profileWithDefaults} />
      </div>
    </div>
  );
}
