import { NextResponse } from "next/server";

export async function middleware(req: Request) {
  // Temporarily disable middleware to avoid OAuth client errors
  // Will re-enable after fixing OAuth provider configuration
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};