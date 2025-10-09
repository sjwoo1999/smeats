"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSellerStats, mockSellerOrders } from "@/lib/mock-data";

export default function SellerStatsPage() {
  const stats = mockSellerStats;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  // Calculate monthly sales data (mock)
  const monthlySales = [
    { month: "1월", revenue: 2100000 },
    { month: "2월", revenue: 2800000 },
    { month: "3월", revenue: 3200000 },
  ];

  const maxRevenue = Math.max(...monthlySales.map(m => m.revenue));

  // Calculate top products (mock)
  const topProducts = [
    { name: "국내산 돼지고기 (삼겹살)", sales: 45, revenue: 675000 },
    { name: "유기농 감자", sales: 120, revenue: 420000 },
    { name: "한우 (국거리용)", sales: 15, revenue: 675000 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">매출 통계</h1>
        <p className="mt-2 text-text-secondary">
          판매 실적과 매출 현황을 확인하세요.
        </p>
      </div>

      {/* Stats Grid */}
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
            <p className="text-xs text-text-muted mt-2">전체 기간</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">이번 달 매출</p>
                <p className="text-2xl font-bold text-text mt-1">{formatPrice(stats.monthlyRevenue)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-success mt-2">↑ 전월 대비 14% 증가</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">총 주문</p>
                <p className="text-2xl font-bold text-text mt-1">{stats.totalOrders}건</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">이번 달: {stats.monthlyOrders}건</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">평균 주문액</p>
                <p className="text-2xl font-bold text-text mt-1">
                  {formatPrice(Math.round(stats.totalRevenue / stats.totalOrders))}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">주문당 평균</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>월별 매출 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlySales.map((data) => (
              <div key={data.month}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text">{data.month}</span>
                  <span className="text-sm font-bold text-text">{formatPrice(data.revenue)}</span>
                </div>
                <div className="w-full h-8 bg-bg-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>인기 상품</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text">{product.name}</p>
                  <p className="text-sm text-text-secondary">{product.sales}회 판매</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text">{formatPrice(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
