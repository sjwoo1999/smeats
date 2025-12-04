"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockSellerOrders } from "@/lib/mock-data";
import { formatPrice, formatDate } from "@/lib/utils";

export default function SellerOrdersPage() {
  const orders = mockSellerOrders;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">주문 접수</Badge>;
      case "preparing":
        return <Badge variant="info">준비 중</Badge>;
      case "shipped":
        return <Badge variant="default">배송 중</Badge>;
      case "delivered":
        return <Badge variant="success">배송 완료</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusActions = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Button variant="primary" size="sm">
            주문 승인 (데모)
          </Button>
        );
      case "preparing":
        return (
          <Button variant="info" size="sm" className="text-white">
            배송 시작 (데모)
          </Button>
        );
      case "shipped":
        return (
          <Button variant="success" size="sm" className="text-white">
            배송 완료 (데모)
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">주문 관리</h1>
        <p className="mt-2 text-text-secondary">
          받은 주문을 확인하고 처리 상태를 관리하세요.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button className="px-4 py-2 border-b-2 border-primary text-primary font-semibold">
          전체 ({orders.length})
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text transition-colors">
          주문 접수 ({orders.filter(o => o.status === "pending").length})
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text transition-colors">
          준비 중 ({orders.filter(o => o.status === "preparing").length})
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text transition-colors">
          배송 중 ({orders.filter(o => o.status === "shipped").length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle>{order.buyer_name}</CardTitle>
                    <span className="text-sm text-text-secondary">{order.buyer_organization}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-text-muted">
                    <span>주문일: {formatDate(order.created_at)}</span>
                    <span>배송 예정: {order.delivery_date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-text">{formatPrice(order.total_amount)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-bg-subtle rounded-lg">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-bg flex-shrink-0">
                      {item.product.image_path && (
                        <img
                          src={item.product.image_path}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text">{item.product.name}</p>
                      <p className="text-sm text-text-secondary">
                        {item.quantity}{item.product.unit} × {formatPrice(item.price_at_order)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-text">{formatPrice(item.quantity * item.price_at_order)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="pt-3 border-t border-border">
                <p className="text-sm text-text-secondary">배송지</p>
                <p className="text-text">{order.delivery_address}</p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  주문서 출력
                </Button>
                {getStatusActions(order.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-bg-subtle flex items-center justify-center">
              <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">받은 주문이 없습니다</h3>
              <p className="mt-1 text-sm text-text-secondary">
                주문이 들어오면 여기에서 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
