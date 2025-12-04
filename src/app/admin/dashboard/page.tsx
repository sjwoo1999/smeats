import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockAdminStats, mockBuyerOrders, mockSellerOrders } from "@/lib/mock-data";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  const stats = mockAdminStats;
  const allOrders = [...mockBuyerOrders, ...mockSellerOrders];
  const recentOrders = allOrders.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">대기</Badge>;
      case "preparing":
        return <Badge variant="info">준비 중</Badge>;
      case "shipped":
        return <Badge variant="default">배송 중</Badge>;
      case "delivered":
        return <Badge variant="success">완료</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">관리자 대시보드</h1>
        <p className="mt-2 text-text-secondary">
          플랫폼 전체 현황을 모니터링하고 관리하세요.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">전체 사용자</p>
                <p className="text-2xl font-bold text-text mt-1">{stats.totalUsers}명</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">구매자 {stats.totalBuyers}명 · 판매자 {stats.totalSellers}명</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">총 거래액</p>
                <p className="text-2xl font-bold text-text mt-1">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">이번 달: {formatPrice(stats.monthlyRevenue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">전체 주문</p>
                <p className="text-2xl font-bold text-text mt-1">{stats.totalOrders}건</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">대기 {stats.pendingOrders}건 · 배송 완료 {stats.deliveredOrders}건</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">등록 상품</p>
                <p className="text-2xl font-bold text-text mt-1">{stats.activeProducts}개</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">심사 대기 {stats.pendingProducts}개</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-1">주문 대기</p>
              <p className="text-3xl font-bold text-warning">{stats.pendingOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-1">준비 중</p>
              <p className="text-3xl font-bold text-info">{stats.preparingOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-1">배송 중</p>
              <p className="text-3xl font-bold text-primary">{stats.shippedOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-1">배송 완료</p>
              <p className="text-3xl font-bold text-success">{stats.deliveredOrders}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>최근 주문</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-bg-subtle transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-text">주문 #{order.id}</p>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span>주문일: {formatDate(order.created_at)}</span>
                    <span>배송 예정: {order.delivery_date}</span>
                    <span>상품 {order.items.length}개</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-text">{formatPrice(order.total_amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>사용자 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">구매자 (학교/단체)</span>
                <span className="text-lg font-semibold text-text">{stats.totalBuyers}명</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">판매자 (마트/업체)</span>
                <span className="text-lg font-semibold text-text">{stats.totalSellers}명</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">관리자</span>
                <span className="text-lg font-semibold text-text">{stats.totalAdmins}명</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>상품 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">활성 상품</span>
                <span className="text-lg font-semibold text-success">{stats.activeProducts}개</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">심사 대기</span>
                <span className="text-lg font-semibold text-warning">{stats.pendingProducts}개</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">전체 상품</span>
                <span className="text-lg font-semibold text-text">{stats.activeProducts + stats.pendingProducts}개</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>관리 작업</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/products">
              <Button variant="outline" className="w-full h-auto p-4 justify-start text-left flex-col items-start gap-2">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-text">상품 심사</p>
                    <p className="text-xs text-text-secondary font-normal">{stats.pendingProducts}개 대기 중</p>
                  </div>
                </div>
              </Button>
            </Link>

            <Link href="/admin/users">
              <Button variant="outline" className="w-full h-auto p-4 justify-start text-left flex-col items-start gap-2">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-text">사용자 관리</p>
                    <p className="text-xs text-text-secondary font-normal">전체 {stats.totalUsers}명</p>
                  </div>
                </div>
              </Button>
            </Link>

            <Link href="/admin/reports">
              <Button variant="outline" className="w-full h-auto p-4 justify-start text-left flex-col items-start gap-2">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-text">통계 보고서</p>
                    <p className="text-xs text-text-secondary font-normal">상세 분석 보기</p>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
