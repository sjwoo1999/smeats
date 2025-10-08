import { listOrders } from "@/server/actions/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const statusConfig = {
  pending: { label: "주문 접수", variant: "info" as const, color: "text-info" },
  preparing: { label: "준비중", variant: "warning" as const, color: "text-warning" },
  shipping: { label: "배송중", variant: "info" as const, color: "text-info" },
  completed: { label: "완료", variant: "success" as const, color: "text-success" },
  cancelled: { label: "취소", variant: "danger" as const, color: "text-danger" },
};

export default async function OrdersPage() {
  const result = await listOrders();

  if (!result.success) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-text">주문 내역</h1>
        <Card className="p-8 text-center">
          <p className="text-danger">{result.error}</p>
        </Card>
      </div>
    );
  }

  const orders = result.data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (orders.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text">주문 내역</h1>
          <p className="mt-2 text-text-secondary">주문 내역이 없습니다.</p>
        </div>

        <Card className="p-12 text-center">
          <div className="space-y-4">
            <svg
              className="mx-auto h-16 w-16 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-text">
                주문 내역이 없습니다
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                상품을 주문하면 여기에서 확인할 수 있습니다.
              </p>
            </div>
            <Button variant="primary" onClick={() => (window.location.href = "/products")}>
              상품 둘러보기
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">주문 내역</h1>
        <p className="mt-2 text-text-secondary">
          총 {orders.length}건의 주문 내역이 있습니다.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const config = statusConfig[order.status];
          const itemCount = order.items.length;

          return (
            <Card key={order.id} variant="bordered">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>
                        주문번호 {order.id.substring(0, 8).toUpperCase()}
                      </CardTitle>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-text">
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 items-center pb-3 border-b border-border last:border-0"
                      >
                        {/* Product Image */}
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-neutral-100">
                          {item.product.image_path ? (
                            <Image
                              src={item.product.image_path}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <svg
                                className="h-6 w-6 text-neutral-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-text truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-text-secondary">
                            {formatPrice(item.price_at_order)} × {item.quantity}
                            {item.product.unit}
                          </p>
                        </div>

                        {/* Item Total */}
                        <p className="font-semibold text-text">
                          {formatPrice(item.price_at_order * item.quantity)}
                        </p>
                      </div>
                    ))}

                    {itemCount > 2 && (
                      <p className="text-sm text-text-secondary text-center py-2">
                        외 {itemCount - 2}개 상품
                      </p>
                    )}
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-bg-subtle p-4 rounded-md space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">판매자</span>
                      <span className="text-text font-medium">
                        {order.seller.business_name || "판매자"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">배송지</span>
                      <span className="text-text font-medium">
                        {order.delivery_address}
                      </span>
                    </div>
                    {order.delivery_note && (
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">배송 메모</span>
                        <span className="text-text font-medium">
                          {order.delivery_note}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        (window.location.href = `/orders/${order.id}`)
                      }
                    >
                      상세보기
                    </Button>
                    {order.status === "pending" && (
                      <Button variant="danger" size="sm" className="flex-1">
                        주문 취소
                      </Button>
                    )}
                    {order.status === "completed" && (
                      <Button variant="primary" size="sm" className="flex-1">
                        재주문
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Filter - Future Enhancement */}
      <Card className="p-4 bg-bg-subtle">
        <p className="text-sm text-text-secondary text-center">
          💡 필터 기능은 곧 추가될 예정입니다.
        </p>
      </Card>
    </div>
  );
}
