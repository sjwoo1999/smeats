import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {/* 404 Icon */}
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-6xl font-bold text-text mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-text">
              페이지를 찾을 수 없습니다
            </h2>
            <p className="mt-3 text-text-secondary">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            이전 페이지
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full">
              대시보드로
            </Button>
          </Link>
        </div>

        {/* Help Links */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-text-secondary mb-3">도움이 필요하신가요?</p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/products" className="text-primary hover:underline">
              상품 보기
            </Link>
            <Link href="/recipes" className="text-primary hover:underline">
              레시피
            </Link>
            <Link href="/orders" className="text-primary hover:underline">
              주문 내역
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
