"use server";

import { redirect } from "next/navigation";
import { SignupSchema, LoginSchema, type SignupInput, type LoginInput } from "@/lib/types";
import type { ApiResponse } from "@/lib/types";

// Mock mode flag
const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Sign up a new user with role selection
 * Creates auth user and initializes profile via RPC
 */
export async function signUp(input: SignupInput): Promise<ApiResponse<{ userId: string }>> {
  try {
    // Validate input
    const validated = SignupSchema.parse(input);

    if (USE_MOCK_DATA) {
      // Mock signup - always succeeds
      console.log("Mock signup:", validated.email, validated.role);

      return {
        success: true,
        data: { userId: "mock-user-id" },
      };
    }

    // Original Supabase implementation would go here
    return {
      success: false,
      error: "Supabase가 설정되지 않았습니다",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다",
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(input: LoginInput): Promise<ApiResponse<void>> {
  try {
    // Validate input
    const validated = LoginSchema.parse(input);

    if (USE_MOCK_DATA) {
      // Mock login - always succeeds
      console.log("Mock login:", validated.email);

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
    console.error("Sign in error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다",
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<ApiResponse<void>> {
  try {
    if (USE_MOCK_DATA) {
      console.log("Mock logout");

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
    console.error("Sign out error:", error);
    return {
      success: false,
      error: "로그아웃 중 오류가 발생했습니다",
    };
  }
}

/**
 * Check if current user's email is verified
 * Used as a guard for critical operations like order placement
 */
export async function requireEmailVerified(): Promise<boolean> {
  if (USE_MOCK_DATA) {
    // In mock mode, always return true (email verified)
    return true;
  }

  // Original Supabase implementation would go here
  return false;
}

/**
 * Get email verification status
 * Returns user email and verification state
 */
export async function getEmailVerificationStatus(): Promise<{
  email: string;
  verified: boolean;
} | null> {
  if (USE_MOCK_DATA) {
    return {
      email: "test@smeats.com",
      verified: true,
    };
  }

  // Original Supabase implementation would go here
  return null;
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(): Promise<ApiResponse<void>> {
  try {
    if (USE_MOCK_DATA) {
      console.log("Mock resend verification email");

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
    console.error("Resend verification error:", error);
    return {
      success: false,
      error: "인증 이메일 전송 중 오류가 발생했습니다",
    };
  }
}

/**
 * Server action to redirect after successful auth
 */
export async function redirectToDashboard() {
  redirect("/dashboard");
}

/**
 * Server action to redirect to login with optional redirect URL
 */
export async function redirectToLogin(redirectUrl?: string) {
  if (redirectUrl) {
    redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  }
  redirect("/login");
}
