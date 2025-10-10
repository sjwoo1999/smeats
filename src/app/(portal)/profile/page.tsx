import ProfileForm from "./profile-form";

// Mock profile data
const mockProfile = {
  id: "mock-user-id",
  role: "customer" as const,
  email: "buyer@example.com",
  business_name: "맛있는 식당",
  contact_phone: "010-1234-5678",
  address: "서울시 강남구 테헤란로 123",
  location: null,
  adm_cd: null,
  region: "서울특별시",
  business_type: "한식당",
  store_name: "우리식당",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_approved: true,
  is_suspended: false,
};

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        ℹ️ 목업 모드: 실제 데이터베이스와 연결되지 않습니다.
      </div>
      <h1 className="text-2xl font-bold mb-6">내 정보</h1>
      <ProfileForm profile={mockProfile} />
    </div>
  );
}
