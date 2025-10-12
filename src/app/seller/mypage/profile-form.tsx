"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileFormProps {
  profile: Profile;
}

export function SellerProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: profile.business_name || "",
    contact_phone: profile.contact_phone || "",
    address: profile.address || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/seller/profile", {
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
    formData.business_name && formData.contact_phone && formData.address;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          🏢 사업자명 <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={formData.business_name}
          onChange={(e) =>
            setFormData({ ...formData, business_name: e.target.value })
          }
          placeholder="예: 신선마트"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          판매자로 표시되는 사업자명입니다.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          📞 연락처 <span className="text-red-500">*</span>
        </label>
        <Input
          type="tel"
          value={formData.contact_phone}
          onChange={(e) =>
            setFormData({ ...formData, contact_phone: e.target.value })
          }
          placeholder="010-1234-5678"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          구매자 문의 시 사용되는 연락처입니다.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          📍 사업장 주소 <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          placeholder="서울시 송파구 송파대로 456"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          배송 가능 지역 계산에 활용됩니다.
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
