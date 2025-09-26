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
      url.searchParams.set("callbackUrl", pathname);
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