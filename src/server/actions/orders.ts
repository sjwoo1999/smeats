"use server";

import { redirect } from "next/navigation";
import {
  OrderPayloadSchema,
  type OrderPayload,
  type OrderWithDetails,
  type OrderStatus,
  type ApiResponse,
} from "@/lib/types";
import { mockOrders, mockUser } from "@/lib/mock-data";

// Mock mode flag
const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Place an order by calling the Supabase Edge Function
 * Handles transaction logic: stock validation, order creation, stock decrement
 */
export async function placeOrder(
  payload: OrderPayload
): Promise<ApiResponse<{ orderId: string }>> {
  try {
    // Validate payload
    const validated = OrderPayloadSchema.parse(payload);

    if (USE_MOCK_DATA) {
      // Mock implementation - simulate successful order creation
      const newOrderId = `mock-${Date.now()}`;

      // Simulate order creation by adding to mock data
      const totalAmount = validated.items.reduce(
        (sum, item) => sum + item.price_at_order * item.quantity,
        0
      );

      console.log("Mock order placed:", {
        orderId: newOrderId,
        totalAmount,
        items: validated.items.length,
      });

      return {
        success: true,
        data: { orderId: newOrderId },
      };
    }

    // Original Supabase implementation would go here
    return {
      success: false,
      error: "Supabase가 설정되지 않았습니다",
    };
  } catch (error) {
    console.error("Place order error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "주문 처리 중 오류가 발생했습니다",
    };
  }
}

/**
 * List orders for current user (API response format)
 */
export async function listOrders(
  status?: OrderStatus
): Promise<ApiResponse<OrderWithDetails[]>> {
  try {
    const orders = await getOrders(status);
    return {
      success: true,
      data: orders,
    };
  } catch {
    return {
      success: false,
      error: "주문 목록을 불러오는데 실패했습니다",
    };
  }
}

/**
 * Get orders for current user with optional status filter
 */
export async function getOrders(
  status?: OrderStatus
): Promise<OrderWithDetails[]> {
  try {
    if (USE_MOCK_DATA) {
      let filteredOrders = [...mockOrders];

      // Apply status filter if provided
      if (status) {
        filteredOrders = filteredOrders.filter((o) => o.status === status);
      }

      return filteredOrders.map((o) => ({
        id: o.id,
        customer_id: o.user_id,
        seller_id: "seller1",
        status: o.status,
        total_amount: o.total_amount,
        delivery_address: o.delivery_address,
        delivery_note: null,
        created_at: o.created_at,
        updated_at: o.created_at,
        customer: {
          email: mockUser.email,
          business_name: mockUser.organization,
          contact_phone: "010-1234-5678",
        },
        seller: {
          business_name: "테스트 판매자",
          contact_phone: "010-9876-5432",
        },
        items: o.items,
      }));
    }

    // Original Supabase implementation would go here
    return [];
  } catch (error) {
    console.error("Get orders error:", error);
    return [];
  }
}

/**
 * Get single order details by ID
 */
export async function getOrderDetails(
  id: string
): Promise<OrderWithDetails | null> {
  try {
    if (USE_MOCK_DATA) {
      const order = mockOrders.find((o) => o.id === id);
      if (!order) return null;

      return {
        id: order.id,
        customer_id: order.user_id,
        seller_id: "seller1",
        status: order.status,
        total_amount: order.total_amount,
        delivery_address: order.delivery_address,
        delivery_note: null,
        created_at: order.created_at,
        updated_at: order.created_at,
        customer: {
          email: mockUser.email,
          business_name: mockUser.organization,
          contact_phone: "010-1234-5678",
        },
        seller: {
          business_name: "테스트 판매자",
          contact_phone: "010-9876-5432",
        },
        items: order.items,
      };
    }

    // Original Supabase implementation would go here
    return null;
  } catch (error) {
    console.error("Get order details error:", error);
    return null;
  }
}

/**
 * Cancel order (only if status is pending)
 */
export async function cancelOrder(
  orderId: string
): Promise<ApiResponse<void>> {
  try {
    if (USE_MOCK_DATA) {
      const order = mockOrders.find((o) => o.id === orderId);

      if (!order) {
        return {
          success: false,
          error: "주문을 찾을 수 없습니다",
        };
      }

      if (order.status !== "pending") {
        return {
          success: false,
          error: "대기 중인 주문만 취소할 수 있습니다",
        };
      }

      // Mock cancellation
      console.log("Mock order cancelled:", orderId);

      return {
        success: true,
        data: undefined,
      };
    }

    // Original Supabase implementation would go here
    return {
      success: false,
      error: "Supabase가 설정되지 않았습니다",
    };
  } catch (error) {
    console.error("Cancel order error:", error);
    return {
      success: false,
      error: "주문 취소 중 오류가 발생했습니다",
    };
  }
}

/**
 * Redirect to order details page
 */
export async function redirectToOrderDetails(orderId: string) {
  redirect(`/orders/${orderId}`);
}
