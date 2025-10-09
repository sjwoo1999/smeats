import { createBrowserClient } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { mockUser } from "./mock-data";

// Environment variables with fallback for build time
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Mock mode flag
const USE_MOCK_DATA = !supabaseUrl || !supabaseAnonKey;

/**
 * Browser client for client components
 * Uses anon key - safe for client-side
 */
export function createClient() {
  if (USE_MOCK_DATA) {
    // Return a mock client that won't throw errors
    console.warn("Running in mock mode - Supabase not configured");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return null as any;
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Server client for server components and server actions
 * Handles cookie-based session management
 * NEVER exposes service role key to client
 */
export async function createServerSupabaseClient() {
  if (USE_MOCK_DATA) {
    // Return a mock client that won't throw errors
    console.warn("Running in mock mode - Supabase not configured");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return null as any;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          // Handle cookie setting errors in middleware/server components
          console.error("Error setting cookies:", error);
        }
      },
    },
  });
}

/**
 * Admin client using service role key
 * SERVER-SIDE ONLY - bypasses RLS
 * Use only in server actions/route handlers for admin operations
 */
export function createAdminClient() {
  if (USE_MOCK_DATA) {
    console.warn("Running in mock mode - Supabase not configured");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return null as any;
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Required for admin operations."
    );
  }

  // Use standard client with service role key
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js") as any;
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Get current user from server component
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  if (USE_MOCK_DATA) {
    // Return mock user in development mode
    return {
      id: mockUser.id,
      email: mockUser.email,
      email_confirmed_at: new Date().toISOString(),
      created_at: mockUser.created_at,
      user_metadata: {},
      app_metadata: {},
      aud: "authenticated",
      role: "authenticated",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Get user profile with role
 * Returns null if not found or not authenticated
 */
export async function getUserProfile(): Promise<Database["public"]["Tables"]["profiles"]["Row"] | null> {
  if (USE_MOCK_DATA) {
    // Return mock profile
    return {
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      business_name: mockUser.organization,
      contact_phone: "010-1234-5678",
      location: null,
      created_at: mockUser.created_at,
      updated_at: mockUser.created_at,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  }

  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createServerSupabaseClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile;
}

/**
 * Check if user email is verified
 */
export async function isEmailVerified() {
  if (USE_MOCK_DATA) {
    // Always verified in mock mode
    return true;
  }

  const user = await getCurrentUser();
  return user?.email_confirmed_at != null;
}

/**
 * Type helper for Supabase client
 */
export type SupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;
