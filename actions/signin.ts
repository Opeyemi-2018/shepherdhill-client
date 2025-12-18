// actions/auth.ts
"use server";

import { cookies } from "next/headers";

type LoginResponse = {
  status: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      email_verified_at: string;
      type: string;
      avatar: string;
      signature: string | null;
      plan_expire_date: string | null;
      requested_plan: string;
      otp: string | null;
      verify_token: string | null;
      is_login_enable: string;
      last_login: string | null;
      is_active: string;
      referral_code: string;
      created_by: string;
      created_at: string;
      updated_at: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      employee: any | null;
    };
    token: string;
    token_type: string;
  };
};

type LoginResult = {
  success: boolean;
  message: string;
  user?: LoginResponse["data"]["user"];
  token?: string;
};

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/client/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          device_name: "web-browser", // Automatically set device name
        }),
      }
    );

    const data: LoginResponse = await response.json();

    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 401) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }
      if (response.status === 422) {
        return {
          success: false,
          message: "Please check your email and password",
        };
      }
      if (response.status === 403) {
        return {
          success: false,
          message: "Your account has been disabled. Please contact support.",
        };
      }
      return {
        success: false,
        message: data.message || "Login failed. Please try again.",
      };
    }

    if (!data.status) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    // Check if user account is active
    if (data.data.user.is_active !== "1") {
      return {
        success: false,
        message: "Your account is inactive. Please contact support.",
      };
    }

    // Check if login is enabled
    if (data.data.user.is_login_enable !== "1") {
      return {
        success: false,
        message: "Login is disabled for your account. Please contact support.",
      };
    }

    // Set auth token in HTTP-only cookie for security
    const cookieStore = await cookies();
    cookieStore.set("auth_token", data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      message: data.message,
      user: data.data.user,
      token: data.data.token,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}
