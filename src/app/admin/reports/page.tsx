"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAdminStats } from "@/lib/mock-data";

export default function AdminReportsPage() {
  const stats = mockAdminStats;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  // Monthly revenue data (mock)
  const monthlyData = [
    { month: "10월", orders: 342, revenue: 12800000 },
    { month: "11월", orders: 398, revenue: 15200000 },
    { month: "12월", orders: 456, revenue: 17600000 },
  ];

  const maxRevenue = Math.max(...monthlyData.map(m => m.revenue));

  // Category sales (mock)
  const categorySales = [
    { category: "육류", revenue: 18500000, percentage: 41 },
    { category: "채소", revenue: 15200000, percentage: 33 },
    { category: "수산물", revenue: 8900000, percentage: 19 },
    { category: "기타", revenue: 3000000, percentage: 7 },
  ];

  // Top sellers (mock)
  const topSellers = [
    { name: "신선마트", orders: 234, revenue: 12300000 },
    { name: "채소마켓", orders: 189, revenue: 9800000 },
    { name: "한우직판장", orders: 156, revenue: 15600000 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">통계 보고서</h1>
        <p className="mt-2 text-text-secondary">
          플랫폼 전체의 매출과 활동 통계를 확인하세요.
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">총 매출</p>
                <p className="text-2xl font-bold text-text mt-1">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-success mt-2">↑ 이번 달 {formatPrice(stats.monthlyRevenue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">총 주문</p>
                <p className="text-2xl font-bold text-text mt-1">{stats.totalOrders}건</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">배송 완료: {stats.deliveredOrders}건</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">활성 사용자</p>
                <p className="text-2xl font-bold text-text mt-1">{stats.totalUsers}명</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">구매자 {stats.totalBuyers} | 판매자 {stats.totalSellers}</p>
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
            <p className="text-xs text-text-muted mt-2">심사 대기: {stats.pendingProducts}개</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>월별 매출 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div key={data.month}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-text">{data.month}</span>
                    <span className="text-xs text-text-secondary ml-2">({data.orders}건)</span>
                  </div>
                  <span className="text-sm font-bold text-text">{formatPrice(data.revenue)}</span>
                </div>
                <div className="w-full h-8 bg-bg-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                    style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>카테고리별 매출</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorySales.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text">{cat.category}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-text">{formatPrice(cat.revenue)}</span>
                      <span className="text-xs text-text-secondary ml-2">({cat.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-6 bg-bg-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Sellers */}
        <Card>
          <CardHeader>
            <CardTitle>우수 판매자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellers.map((seller, index) => (
                <div key={seller.name} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-text">{seller.name}</p>
                    <p className="text-sm text-text-secondary">{seller.orders}건 판매</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-text">{formatPrice(seller.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
