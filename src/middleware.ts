import { NextResponse, type NextRequest } from "next/server";

/**
 * Dashboard and sign-in URLs are served by the existing single-page app.
 * Rewriting them all to one page keeps it mounted while users move between
 * dashboard screens; the browser still shows the original URL.
 */
export function middleware(request: NextRequest) {
  return NextResponse.rewrite(new URL("/app-shell", request.url));
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/partners/login",
    "/partners/register",
    "/user/:path*",
    "/doctor/:path*",
    "/doctors/:path*",
    "/pharmacy/:path*",
    "/lab_technician/:path*",
    "/lab/:path*",
    "/patient/:path*",
    "/admin/:path*",
    "/super-admin/:path*",
    "/caregiver/:path*",
    "/verify-email/:path*",
    "/enter-otp",
    "/password-reset/:path*",
    "/unauthorized",
    "/dashboard",
  ],
};
