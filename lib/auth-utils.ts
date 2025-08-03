import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { NextRequest } from "next/server";
import type { Session } from "next-auth";

/**
 * Get the current user session on the server side
 */
export async function getCurrentUser() {
  const session = (await getServerSession(authOptions)) as Session | null;
  return session?.user || null;
}

/**
 * Require authentication - throws error if user is not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new Error("Authentication required");
  }
  return user;
}

/**
 * Check if user has specific role
 */
export async function requireRole(role: string) {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error("Insufficient permissions");
  }
  return user;
}

/**
 * Extract user from API request headers/session
 */
export async function getUserFromRequest(req: NextRequest) {
  try {
    // Get session from NextAuth
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return null;
    }
    return session.user;
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
}

/**
 * Create standardized authentication error response
 */
export function createAuthError(
  message = "Authentication required",
  status = 401
) {
  return {
    error: "Authentication Error",
    message,
    status,
  };
}
