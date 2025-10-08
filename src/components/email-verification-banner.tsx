"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { resendVerificationEmail } from "@/server/actions/auth";

export default function EmailVerificationBanner() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleResend() {
    setPending(true);
    setMessage(null);

    const result = await resendVerificationEmail();

    setPending(false);

    if (result.success) {
      setMessage("인증 이메일이 재전송되었습니다. 메일함을 확인하세요.");
    } else {
      setMessage(result.error);
    }
  }

  return (
    <div className="bg-warning-bg border-b border-warning">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 text-warning"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-warning">
              <strong>이메일 인증이 필요합니다.</strong> 메일함을 확인하고 인증을
              완료해주세요.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {message && (
              <p className="text-sm text-text-secondary">{message}</p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={pending}
            >
              {pending ? "전송 중..." : "재전송"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
