"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/server/actions/auth";
import { LoginSchema } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate
    const validation = LoginSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "입력값을 확인하세요");
      return;
    }

    setPending(true);
    const result = await signIn(validation.data);
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    // Success - redirect to dashboard or specified redirect URL
    router.push(redirect || "/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>로그인</CardTitle>
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
            required
          />

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
            {pending ? "로그인 중..." : "로그인"}
          </Button>

          <div className="text-center text-sm text-text-secondary">
            계정이 없으신가요?{" "}
            <a href="/signup" className="text-primary hover:underline">
              회원가입
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
