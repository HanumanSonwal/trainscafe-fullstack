import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  // protect admin routes
  if (pathname.startsWith("/control")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // protect vendor routes
  if (pathname.startsWith("/supplier")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // prevent logged in user from login page
  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/control", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/control/:path*", "/supplier/:path*", "/login"],
};
