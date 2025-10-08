"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { createServerSupabaseClient, getCurrentUser } from "@/lib/supabase";
import { requireEmailVerified } from "./auth";
import {
  OrderPayloadSchema,
  type OrderPayload,
  type OrderWithDetails,
  type OrderStatus,
  type ApiResponse,
} from "@/lib/types";

/**
 * Place an order by calling the Supabase Edge Function
 * Handles transaction logic: stock validation, order creation, stock decrement
 */
export async function placeOrder(
  payload: OrderPayload
): Promise<ApiResponse<{ orderId: string }>> {
  try {
    // 1. Validate email verification
    const isVerified = await requireEmailVerified();
    if (!isVerified) {
      return {
        success: false,
        error:
          "이메일 인증이 필요합니다. 인증 이메일을 확인해주세요.",
      };
    }

    // 2. Validate payload
    const validated = OrderPayloadSchema.parse(payload);

    // 3. Get current user and session
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "로그인이 필요합니다",
      };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        success: false,
        error: "세션이 만료되었습니다. 다시 로그인해주세요.",
      };
    }

    // 4. Calculate total amount
    const totalAmount = validated.items.reduce(
      (sum, item) => sum + item.price_at_order * item.quantity,
      0
    );

    // 5. Call Edge Function to handle transaction
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/place-order`;

    const response = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seller_id: validated.seller_id,
        delivery_address: validated.delivery_address,
        delivery_note: validated.delivery_note || null,
        total_amount: totalAmount,
        items: validated.items,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || "주문 처리 중 오류가 발생했습니다",
      };
    }

    // 6. Revalidate orders cache
    revalidateTag("orders");
    revalidateTag("products");

    return {
      success: true,
      data: { orderId: result.order_id },
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
 * Get orders for current user with optional status filter
 */
export async function getOrders(
  status?: OrderStatus
): Promise<OrderWithDetails[]> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }

    const supabase = await createServerSupabaseClient();

    // Base query
    let query = supabase
      .from("orders")
      .select(
        `
        id,
        customer_id,
        seller_id,
        status,
        total_amount,
        delivery_address,
        delivery_note,
        created_at,
        updated_at,
        customer:profiles!customer_id (
          email,
          business_name,
          contact_phone
        ),
        seller:profiles!seller_id (
          business_name,
          contact_phone
        ),
        items:order_items (
          id,
          product_id,
          quantity,
          price_at_order,
          product:products (
            name,
            unit,
            image_path
          )
        )
      `
      )
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    // Apply status filter if provided
    if (status) {
      query = query.eq("status", status);
    }

    const { data: orders, error } = await query;

    if (error || !orders) {
      console.error("Get orders error:", error);
      return [];
    }

    // Transform to OrderWithDetails type
    return orders.map((o): OrderWithDetails => ({
      id: o.id,
      customer_id: o.customer_id,
      seller_id: o.seller_id,
      status: o.status as OrderStatus,
      total_amount: o.total_amount,
      delivery_address: o.delivery_address,
      delivery_note: o.delivery_note,
      created_at: o.created_at,
      updated_at: o.updated_at,
      customer: {
        email: Array.isArray(o.customer)
          ? o.customer[0]?.email || ""
          : (o.customer as any)?.email || "",
        business_name: Array.isArray(o.customer)
          ? o.customer[0]?.business_name || null
          : (o.customer as any)?.business_name || null,
        contact_phone: Array.isArray(o.customer)
          ? o.customer[0]?.contact_phone || null
          : (o.customer as any)?.contact_phone || null,
      },
      seller: {
        business_name: Array.isArray(o.seller)
          ? o.seller[0]?.business_name || null
          : (o.seller as any)?.business_name || null,
        contact_phone: Array.isArray(o.seller)
          ? o.seller[0]?.contact_phone || null
          : (o.seller as any)?.contact_phone || null,
      },
      items: Array.isArray(o.items)
        ? o.items.map((item: any) => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_order: item.price_at_order,
            product: {
              name: item.product?.name || "",
              unit: item.product?.unit || "",
              image_path: item.product?.image_path || null,
            },
          }))
        : [],
    }));
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
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }

    const supabase = await createServerSupabaseClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        customer_id,
        seller_id,
        status,
        total_amount,
        delivery_address,
        delivery_note,
        created_at,
        updated_at,
        customer:profiles!customer_id (
          email,
          business_name,
          contact_phone
        ),
        seller:profiles!seller_id (
          business_name,
          contact_phone
        ),
        items:order_items (
          id,
          product_id,
          quantity,
          price_at_order,
          product:products (
            name,
            unit,
            image_path
          )
        )
      `
      )
      .eq("id", id)
      .eq("customer_id", user.id)
      .single();

    if (error || !order) {
      console.error("Get order details error:", error);
      return null;
    }

    return {
      id: order.id,
      customer_id: order.customer_id,
      seller_id: order.seller_id,
      status: order.status as OrderStatus,
      total_amount: order.total_amount,
      delivery_address: order.delivery_address,
      delivery_note: order.delivery_note,
      created_at: order.created_at,
      updated_at: order.updated_at,
      customer: {
        email: Array.isArray(order.customer)
          ? order.customer[0]?.email || ""
          : (order.customer as any)?.email || "",
        business_name: Array.isArray(order.customer)
          ? order.customer[0]?.business_name || null
          : (order.customer as any)?.business_name || null,
        contact_phone: Array.isArray(order.customer)
          ? order.customer[0]?.contact_phone || null
          : (order.customer as any)?.contact_phone || null,
      },
      seller: {
        business_name: Array.isArray(order.seller)
          ? order.seller[0]?.business_name || null
          : (order.seller as any)?.business_name || null,
        contact_phone: Array.isArray(order.seller)
          ? order.seller[0]?.contact_phone || null
          : (order.seller as any)?.contact_phone || null,
      },
      items: Array.isArray(order.items)
        ? order.items.map((item: any) => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_order: item.price_at_order,
            product: {
              name: item.product?.name || "",
              unit: item.product?.unit || "",
              image_path: item.product?.image_path || null,
            },
          }))
        : [],
    };
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
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "로그인이 필요합니다",
      };
    }

    const supabase = await createServerSupabaseClient();

    // Check if order belongs to user and is pending
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("status, customer_id")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return {
        success: false,
        error: "주문을 찾을 수 없습니다",
      };
    }

    if (order.customer_id !== user.id) {
      return {
        success: false,
        error: "권한이 없습니다",
      };
    }

    if (order.status !== "pending") {
      return {
        success: false,
        error: "대기 중인 주문만 취소할 수 있습니다",
      };
    }

    // Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (updateError) {
      return {
        success: false,
        error: "주문 취소에 실패했습니다",
      };
    }

    // Revalidate cache
    revalidateTag("orders");

    return {
      success: true,
      data: undefined,
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
