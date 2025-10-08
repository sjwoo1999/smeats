import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = 'force-dynamic';

/**
 * Dashboard - role-based routing
 * Redirects based on user role:
 * - seller → /seller
 * - admin → /admin
 * - customer → customer dashboard (default)
 */
export default async function DashboardPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  // Role-based redirect
  if (profile.role === "seller") {
    redirect("/seller");
  }

  if (profile.role === "admin") {
    redirect("/admin");
  }

  // Customer dashboard
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text">
          환영합니다, {profile.business_name || profile.email}님
        </h1>
        <p className="mt-2 text-text-secondary">
          SMEats 고객 대시보드입니다. 최고의 식자재를 최저가로 만나보세요.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>상품 검색</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">
              배송 가능한 마트의 상품을 검색하고 최저가를 비교하세요.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              상품 보기 →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>레시피 기반 발주</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">
              레시피 템플릿으로 필요한 식자재를 한 번에 주문하세요.
            </p>
            <Link
              href="/recipes"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              레시피 보기 →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>주문 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">
              주문 상태를 확인하고 배송 정보를 추적하세요.
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              주문 보기 →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 시작</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-bg-subtle rounded-md">
            <span className="text-sm text-text">프로필 완성도</span>
            <span className="text-sm font-medium">
              {profile.business_name && profile.contact_phone && profile.address
                ? "100%"
                : "50%"}
            </span>
          </div>

          {(!profile.business_name || !profile.contact_phone || !profile.address) && (
            <div className="text-sm text-warning bg-warning-bg p-3 rounded-md">
              프로필을 완성하면 더 나은 서비스를 이용할 수 있습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
