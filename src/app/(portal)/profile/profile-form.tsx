"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Database } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const REGIONS = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

const BUSINESS_TYPES = [
  "한식당",
  "중식당",
  "일식당",
  "양식당",
  "분식점",
  "카페",
  "베이커리",
  "패스트푸드",
  "치킨전문점",
  "호텔",
  "뷔페",
  "급식업체",
  "기타",
];

interface ProfileFormProps {
  profile: Profile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    business_name: profile.business_name || "",
    contact_phone: profile.contact_phone || "",
    address: profile.address || "",
    region: profile.region || "",
    business_type: profile.business_type || "",
    store_name: profile.store_name || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("프로필 업데이트 (목업):", formData);
    alert("프로필이 업데이트되었습니다. (목업 모드)");
    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isCustomer = profile.role === "customer";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* 이메일 (읽기 전용) */}
        <div>
          <label className="block text-sm font-medium mb-1">이메일</label>
          <Input value={profile.email} disabled />
        </div>

        {/* 역할 (읽기 전용) */}
        <div>
          <label className="block text-sm font-medium mb-1">역할</label>
          <Input
            value={
              profile.role === "customer"
                ? "구매자"
                : profile.role === "seller"
                  ? "판매자"
                  : "관리자"
            }
            disabled
          />
        </div>

        {/* 상호명 */}
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium mb-1">
            상호명
          </label>
          <Input
            id="business_name"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            placeholder="상호명을 입력하세요"
          />
        </div>

        {/* 연락처 */}
        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium mb-1">
            연락처
          </label>
          <Input
            id="contact_phone"
            name="contact_phone"
            type="tel"
            value={formData.contact_phone}
            onChange={handleChange}
            placeholder="010-1234-5678"
          />
        </div>

        {/* 주소 */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            주소
          </label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="주소를 입력하세요"
          />
        </div>

        {/* 구매자 전용 필드 */}
        {isCustomer && (
          <>
            <div>
              <label htmlFor="region" className="block text-sm font-medium mb-1">
                지역 <span className="text-red-500">*</span>
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">지역을 선택하세요</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="business_type" className="block text-sm font-medium mb-1">
                업종 <span className="text-red-500">*</span>
              </label>
              <select
                id="business_type"
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">업종을 선택하세요</option>
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="store_name" className="block text-sm font-medium mb-1">
                가게명 <span className="text-red-500">*</span>
              </label>
              <Input
                id="store_name"
                name="store_name"
                value={formData.store_name}
                onChange={handleChange}
                placeholder="가게명을 입력하세요"
                required
              />
            </div>
          </>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "저장 중..." : "저장"}
      </Button>
    </form>
  );
}
