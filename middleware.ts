import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isCheckoutPage = req.nextUrl.pathname.startsWith("/checkout");
    const isAPICheckout = req.nextUrl.pathname.startsWith("/api/checkout");

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect checkout routes - require authentication
    if (isCheckoutPage && !isAuth) {
      const from = req.nextUrl.pathname;
      return NextResponse.redirect(
        new URL(`/auth?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // API checkout endpoint is protected by server-side auth check
    // This middleware is just for page-level protection

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This allows the middleware to run for all requests
        // Authentication checks are handled in the middleware function above
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
