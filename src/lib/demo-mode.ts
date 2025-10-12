// Demo mode detection and utilities

import { mockUsers, type PersonaType } from "./mock-data";

// Re-export PersonaType for external use
export type { PersonaType };

/**
 * Check if demo mode is enabled
 * Demo mode is enabled when:
 * 1. NEXT_PUBLIC_DEMO_MODE is explicitly set to "true"
 * 2. OR Supabase is not configured (no URL or anon key)
 */
export function isDemoMode(): boolean {
  // Check explicit demo mode flag
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return true;
  }

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return !supabaseUrl || !supabaseAnonKey;
}

/**
 * Get current demo persona from localStorage
 * Returns null if not set or not in browser environment
 */
export function getDemoPersona(): PersonaType | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem("demo_persona");
  if (stored && (stored === "buyer" || stored === "seller" || stored === "admin")) {
    return stored as PersonaType;
  }

  return null;
}

/**
 * Set demo persona in localStorage and cookie
 */
export function setDemoPersona(persona: PersonaType): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("demo_persona", persona);
  // Also set in cookie for server-side access
  document.cookie = `demo_persona=${persona}; path=/; max-age=31536000`; // 1 year
}

/**
 * Clear demo persona from localStorage and cookie
 */
export function clearDemoPersona(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("demo_persona");
  // Clear cookie
  document.cookie = "demo_persona=; path=/; max-age=0";
}

/**
 * Get demo user data for current persona
 */
export function getDemoUser(persona: PersonaType) {
  return mockUsers[persona];
}

/**
 * Get persona display name
 */
export function getPersonaDisplayName(persona: PersonaType): string {
  switch (persona) {
    case "buyer":
      return "구매자 (가게 사장님)";
    case "seller":
      return "판매자 (식자재 업체)";
    case "admin":
      return "관리자 (플랫폼 운영)";
    default:
      return "알 수 없음";
  }
}

/**
 * Get persona emoji icon
 */
export function getPersonaIcon(persona: PersonaType): string {
  switch (persona) {
    case "buyer":
      return "👩‍🍳";
    case "seller":
      return "🏪";
    case "admin":
      return "⚙️";
    default:
      return "❓";
  }
}

/**
 * Get persona description
 */
export function getPersonaDescription(persona: PersonaType): string {
  switch (persona) {
    case "buyer":
      return "식자재를 검색하고 구매합니다";
    case "seller":
      return "식자재를 등록하고 주문을 관리합니다";
    case "admin":
      return "플랫폼 전체를 관리하고 모니터링합니다";
    default:
      return "";
  }
}

/**
 * Get default dashboard route for persona
 */
export function getPersonaDashboard(persona: PersonaType): string {
  switch (persona) {
    case "buyer":
      return "/dashboard";
    case "seller":
      return "/seller/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

/**
 * Check if persona has access to route
 */
export function hasPersonaAccess(persona: PersonaType, pathname: string): boolean {
  // Public routes accessible to all
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return true;
  }

  // Buyer routes
  if (persona === "buyer") {
    return (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/products") ||
      pathname.startsWith("/recipes") ||
      pathname.startsWith("/cart") ||
      pathname.startsWith("/orders")
    );
  }

  // Seller routes
  if (persona === "seller") {
    return pathname.startsWith("/seller");
  }

  // Admin routes
  if (persona === "admin") {
    return pathname.startsWith("/admin");
  }

  return false;
}
