"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/server/actions/auth";
import { SignupSchema } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"customer" | "seller">("customer");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role,
    };

    // Validate
    const validation = SignupSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.errors[0]?.message || "입력값을 확인하세요");
      return;
    }

    setPending(true);
    const result = await signUp(validation.data);
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    // Success - redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="email"
            type="email"
            label="이메일"
            placeholder="example@smeats.com"
            required
          />

          <Input
            name="password"
            type="password"
            label="비밀번호"
            helperText="최소 8자, 영문 소문자와 숫자 포함"
            required
          />

          <div className="space-y-3">
            <label className="text-sm font-medium text-text">역할 선택</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === "customer"}
                  onChange={(e) => setRole(e.target.value as "customer")}
                  className="h-5 w-5"
                />
                <div>
                  <div className="font-medium">고객 (Customer)</div>
                  <div className="text-sm text-text-secondary">
                    식자재를 구매하는 소상공인
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={role === "seller"}
                  onChange={(e) => setRole(e.target.value as "seller")}
                  className="h-5 w-5"
                />
                <div>
                  <div className="font-medium">판매자 (Seller)</div>
                  <div className="text-sm text-text-secondary">
                    식자재를 판매하는 마트/도매업체
                  </div>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="text-sm text-danger bg-danger-bg p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="w-full"
            size="lg"
          >
            {pending ? "가입 처리 중..." : "회원가입"}
          </Button>

          <div className="text-center text-sm text-text-secondary">
            이미 계정이 있으신가요?{" "}
            <a href="/login" className="text-primary hover:underline">
              로그인
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
