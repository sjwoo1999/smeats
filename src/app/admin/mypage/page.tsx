import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/supabase";

export default async function AdminMyPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  // 관리자만 접근 가능
  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">관리자 설정</h1>

      <div className="bg-white rounded-lg border p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <p className="text-gray-900">{profile.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              역할
            </label>
            <p className="text-gray-900">플랫폼 관리자</p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              💡 관리자 계정은 플랫폼 전체를 관리할 수 있는 권한을 갖고 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
