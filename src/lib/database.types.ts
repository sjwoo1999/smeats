/**
 * Database type definitions
 * Generated from Supabase schema
 * Team: Update this file when schema changes using:
 * npx supabase gen types typescript --project-id your-project-id > src/lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "customer" | "seller" | "admin";
          email: string;
          business_name: string | null;
          contact_phone: string | null;
          address: string | null;
          location: unknown | null; // PostGIS geography(Point,4326)
          adm_cd: string | null; // 10-digit 법정동코드
          region: string | null;
          business_type: string | null;
          store_name: string | null;
          created_at: string;
          updated_at: string;
          is_approved: boolean;
          is_suspended: boolean;
        };
        Insert: {
          id: string;
          role: "customer" | "seller" | "admin";
          email: string;
          business_name?: string | null;
          contact_phone?: string | null;
          address?: string | null;
          location?: unknown | null;
          adm_cd?: string | null;
          region?: string | null;
          business_type?: string | null;
          store_name?: string | null;
          created_at?: string;
          updated_at?: string;
          is_approved?: boolean;
          is_suspended?: boolean;
        };
        Update: {
          id?: string;
          role?: "customer" | "seller" | "admin";
          email?: string;
          business_name?: string | null;
          contact_phone?: string | null;
          address?: string | null;
          location?: unknown | null;
          adm_cd?: string | null;
          region?: string | null;
          business_type?: string | null;
          store_name?: string | null;
          created_at?: string;
          updated_at?: string;
          is_approved?: boolean;
          is_suspended?: boolean;
        };
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          name: string;
          category: string;
          price: number;
          unit: string;
          origin: string | null;
          stock: number;
          image_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          name: string;
          category: string;
          price: number;
          unit: string;
          origin?: string | null;
          stock?: number;
          image_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          name?: string;
          category?: string;
          price?: number;
          unit?: string;
          origin?: string | null;
          stock?: number;
          image_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string | null;
          image_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          description?: string | null;
          image_path?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string | null;
          image_path?: string | null;
          created_at?: string;
        };
      };
      recipe_items: {
        Row: {
          id: string;
          recipe_id: string;
          ingredient_name: string;
          unit: string;
          quantity_per_serving: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          ingredient_name: string;
          unit: string;
          quantity_per_serving: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          ingredient_name?: string;
          unit?: string;
          quantity_per_serving?: number;
          created_at?: string;
        };
      };
      delivery_zones: {
        Row: {
          id: string;
          seller_id: string;
          zone_type: "radius" | "district";
          zone_value: Json; // { km?: number, lat?: number, lng?: number, codes?: string[] }
          min_order_amount: number;
          delivery_fee: number;
          free_delivery_threshold: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          zone_type: "radius" | "district";
          zone_value: Json;
          min_order_amount?: number;
          delivery_fee?: number;
          free_delivery_threshold?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          zone_type?: "radius" | "district";
          zone_value?: Json;
          min_order_amount?: number;
          delivery_fee?: number;
          free_delivery_threshold?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          seller_id: string;
          status:
            | "pending"
            | "preparing"
            | "shipping"
            | "completed"
            | "cancelled";
          total_amount: number;
          delivery_address: string;
          delivery_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          seller_id: string;
          status?: "pending" | "preparing" | "shipping" | "completed" | "cancelled";
          total_amount: number;
          delivery_address: string;
          delivery_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          seller_id?: string;
          status?: "pending" | "preparing" | "shipping" | "completed" | "cancelled";
          total_amount?: number;
          delivery_address?: string;
          delivery_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price_at_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price_at_order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price_at_order?: number;
          created_at?: string;
        };
      };
      delivery_info: {
        Row: {
          id: string;
          seller_id: string;
          fee: number;
          free_threshold: number | null;
          avg_delivery_days: number;
          delivery_schedule: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          fee?: number;
          free_threshold?: number | null;
          avg_delivery_days?: number;
          delivery_schedule?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          fee?: number;
          free_threshold?: number | null;
          avg_delivery_days?: number;
          delivery_schedule?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      seller_business_hours: {
        Row: {
          id: string;
          seller_id: string;
          day_of_week: number;
          open_time: string;
          close_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          day_of_week: number;
          open_time: string;
          close_time: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          day_of_week?: number;
          open_time?: string;
          close_time?: string;
          created_at?: string;
        };
      };
      product_pricing: {
        Row: {
          id: string;
          product_id: string;
          base_price: number;
          discount_type: "percentage" | "fixed" | null;
          discount_value: number | null;
          discount_start_date: string | null;
          discount_end_date: string | null;
          markup_percentage: number;
          markup_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          base_price: number;
          discount_type?: "percentage" | "fixed" | null;
          discount_value?: number | null;
          discount_start_date?: string | null;
          discount_end_date?: string | null;
          markup_percentage?: number;
          markup_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          base_price?: number;
          discount_type?: "percentage" | "fixed" | null;
          discount_value?: number | null;
          discount_start_date?: string | null;
          discount_end_date?: string | null;
          markup_percentage?: number;
          markup_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      init_profile: {
        Args: {
          p_role: "customer" | "seller" | "admin";
        };
        Returns: void;
      };
      calculate_final_price: {
        Args: {
          p_base_price: number;
          p_markup_percentage: number;
          p_discount_type: string;
          p_discount_value: number;
        };
        Returns: number;
      };
      get_seller_recent_sales: {
        Args: {
          p_seller_id: string;
        };
        Returns: number;
      };
      get_region_popular_products: {
        Args: {
          p_region: string;
          p_limit?: number;
        };
        Returns: {
          product_id: string;
          product_name: string;
          total_orders: number;
          seller_business_name: string;
        }[];
      };
      get_business_type_recommendations: {
        Args: {
          p_business_type: string;
          p_limit?: number;
        };
        Returns: {
          product_id: string;
          product_name: string;
          category: string;
          purchase_count: number;
        }[];
      };
    };
    Enums: {
      user_role: "customer" | "seller" | "admin";
      order_status: "pending" | "preparing" | "shipping" | "completed" | "cancelled";
      zone_type: "radius" | "district";
    };
  };
}
