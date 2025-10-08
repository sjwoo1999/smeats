"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient, getCurrentUser } from "@/lib/supabase";
import { SignupSchema, LoginSchema, type SignupInput, type LoginInput } from "@/lib/types";
import type { ApiResponse } from "@/lib/types";

/**
 * Sign up a new user with role selection
 * Creates auth user and initializes profile via RPC
 */
export async function signUp(input: SignupInput): Promise<ApiResponse<{ userId: string }>> {
  try {
    // Validate input
    const validated = SignupSchema.parse(input);

    const supabase = await createServerSupabaseClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          role: validated.role,
        },
      },
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || "회원가입에 실패했습니다",
      };
    }

    // Initialize profile with selected role
    const { error: profileError } = await supabase.rpc("init_profile", {
      p_role: validated.role,
    });

    if (profileError) {
      console.error("Profile initialization failed:", profileError);
      return {
        success: false,
        error: "프로필 생성에 실패했습니다",
      };
    }

    return {
      success: true,
      data: { userId: authData.user.id },
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

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) {
      return {
        success: false,
        error: "이메일 또는 비밀번호가 올바르지 않습니다",
      };
    }

    return {
      success: true,
      data: undefined,
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
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: "로그아웃에 실패했습니다",
      };
    }

    return {
      success: true,
      data: undefined,
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
  const user = await getCurrentUser();
  return user?.email_confirmed_at != null;
}

/**
 * Get email verification status
 * Returns user email and verification state
 */
export async function getEmailVerificationStatus(): Promise<{
  email: string;
  verified: boolean;
} | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  return {
    email: user.email || "",
    verified: user.email_confirmed_at != null,
  };
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(): Promise<ApiResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "로그인이 필요합니다",
      };
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.email!,
    });

    if (error) {
      return {
        success: false,
        error: "인증 이메일 전송에 실패했습니다",
      };
    }

    return {
      success: true,
      data: undefined,
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
