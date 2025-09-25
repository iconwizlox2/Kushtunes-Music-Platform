import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Minimal auth check:
 * - Treat presence of a cookie named "session" as logged in.
 * - If missing, redirect to /login (or /signin, if that's your path).
 *
 * Adjust COOKIE_NAME and LOGIN_PATH if your app differs.
 */
const COOKIE_NAME = "session";
const LOGIN_PATH = "/login"; // change to "/signin" if needed

// Routes to protect (prefix match)
const PROTECTED_PREFIXES = ["/dashboard", "/releases", "/marketing", "/community"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some(p => pathname === p || pathname.startsWith(p + "/"));
  if (!needsAuth) return NextResponse.next();

  const hasSession = req.cookies.get(COOKIE_NAME)?.value;
  if (hasSession) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.searchParams.set("next", pathname); // so we can return after login
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/releases/:path*",
    "/marketing/:path*",
    "/community/:path*",
  ],
};
