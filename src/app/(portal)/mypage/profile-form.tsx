"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const REGIONS = [
  "서울시 강남구",
  "서울시 서초구",
  "서울시 송파구",
  "서울시 강동구",
  "서울시 마포구",
  "서울시 용산구",
  "서울시 종로구",
  "서울시 중구",
];

const BUSINESS_TYPES = [
  "한식당",
  "중식당",
  "일식당",
  "양식당",
  "카페",
  "분식점",
  "치킨점",
  "베이커리",
  "기타",
];

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    region: profile.region || "",
    business_type: profile.business_type || "",
    store_name: profile.store_name || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("프로필 업데이트 실패");
      }

      router.refresh();
      alert("프로필이 업데이트되었습니다.");
    } catch (error) {
      console.error(error);
      alert("프로필 업데이트에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete =
    formData.region && formData.business_type && formData.store_name;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          📍 지역 <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.region}
          onChange={(e) =>
            setFormData({ ...formData, region: e.target.value })
          }
          className="w-full border rounded-md px-3 py-2"
          required
        >
          <option value="">지역을 선택하세요</option>
          {REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          배송 가능한 상품과 인기 상품 추천에 활용됩니다.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          🏪 업종 <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.business_type}
          onChange={(e) =>
            setFormData({ ...formData, business_type: e.target.value })
          }
          className="w-full border rounded-md px-3 py-2"
          required
        >
          <option value="">업종을 선택하세요</option>
          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          업종별 추천 상품과 레시피 제공에 활용됩니다.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          🏷️ 가게명 <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={formData.store_name}
          onChange={(e) =>
            setFormData({ ...formData, store_name: e.target.value })
          }
          placeholder="예: 홍대 피자집"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          매장 관리 및 식별용으로 사용됩니다.
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          {!isComplete && (
            <p className="text-sm text-amber-600">
              ⚠️ 모든 항목을 입력해주세요
            </p>
          )}
        </div>
        <Button type="submit" disabled={isLoading || !isComplete}>
          {isLoading ? "저장 중..." : "저장하기"}
        </Button>
      </div>
    </form>
  );
}
