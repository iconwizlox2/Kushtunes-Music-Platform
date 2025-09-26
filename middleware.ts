import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // Define protected routes
    const protectedRoutes = ["/dashboard", "/releases", "/marketing", "/community", "/upload", "/earnings", "/payouts", "/settings"];
    
    // Check if the current path is protected
    const isProtected = protectedRoutes.some(route => 
      pathname === route || pathname.startsWith(route + "/")
    );
    
    if (isProtected && !req.nextauth.token) {
      // Redirect to login if not authenticated
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    
    // Check if user is authenticated but email is not verified
    if (isProtected && req.nextauth.token && !req.nextauth.token.emailVerified) {
      const url = req.nextUrl.clone();
      url.pathname = "/verify-email";
      url.searchParams.set("email", req.nextauth.token.email || "");
      url.searchParams.set("message", "Please verify your email address to access this page.");
      return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/releases/:path*", 
    "/marketing/:path*",
    "/community/:path*",
    "/upload/:path*",
    "/earnings/:path*",
    "/payouts/:path*",
    "/settings/:path*",
  ],
};