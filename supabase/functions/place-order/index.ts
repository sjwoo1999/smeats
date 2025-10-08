// Deno runtime for Supabase Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_id: string;
  quantity: number;
  price_at_order: number;
}

interface OrderPayload {
  seller_id: string;
  delivery_address: string;
  delivery_note: string | null;
  total_amount: number;
  items: OrderItem[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const payload: OrderPayload = await req.json();

    // Validate stock for all items
    for (const item of payload.items) {
      const { data: product, error: productError } = await supabaseClient
        .from("products")
        .select("stock")
        .eq("id", item.product_id)
        .single();

      if (productError || !product) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `상품을 찾을 수 없습니다: ${item.product_id}`,
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (product.stock < item.quantity) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `재고가 부족합니다: ${item.product_id}`,
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        customer_id: user.id,
        seller_id: payload.seller_id,
        delivery_address: payload.delivery_address,
        delivery_note: payload.delivery_note,
        total_amount: payload.total_amount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ success: false, error: "주문 생성에 실패했습니다" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create order items and decrement stock
    for (const item of payload.items) {
      // Insert order item
      const { error: itemError } = await supabaseClient
        .from("order_items")
        .insert({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_order: item.price_at_order,
        });

      if (itemError) {
        // Rollback by deleting order
        await supabaseClient.from("orders").delete().eq("id", order.id);
        return new Response(
          JSON.stringify({ success: false, error: "주문 항목 생성에 실패했습니다" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Decrement stock
      const { error: stockError } = await supabaseClient.rpc("decrement_stock", {
        product_id: item.product_id,
        quantity: item.quantity,
      });

      if (stockError) {
        // Rollback
        await supabaseClient.from("orders").delete().eq("id", order.id);
        return new Response(
          JSON.stringify({ success: false, error: "재고 차감에 실패했습니다" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, order_id: order.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
