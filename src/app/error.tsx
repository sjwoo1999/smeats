"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {/* Error Icon */}
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-danger/10 flex items-center justify-center">
            <svg
              className="h-12 w-12 text-danger"
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
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-text">
              문제가 발생했습니다
            </h2>
            <p className="mt-3 text-text-secondary">
              일시적인 오류로 페이지를 표시할 수 없습니다.
            </p>
          </div>
        </div>

        {/* Error Details (Dev mode only) */}
        {process.env.NODE_ENV === "development" && (
          <Card className="p-4 bg-danger-bg text-left">
            <p className="text-xs font-mono text-danger break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-danger/70 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={reset}>
            다시 시도
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/dashboard")}
          >
            대시보드로 이동
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-text-secondary">
          문제가 계속되면{" "}
          <a
            href="mailto:support@smeats.com"
            className="text-primary hover:underline"
          >
            고객센터
          </a>
          로 문의해주세요.
        </p>
      </Card>
    </div>
  );
}
