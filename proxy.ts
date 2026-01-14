import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const adminToken = req.cookies.get("admin_token")?.value;

  // ===== ADMIN LOGIN PAGE =====
  if (pathname === "/admin/login") {
    // If already logged in → go to dashboard
    if (adminToken) {
      try {
        const { payload } = await jwtVerify(adminToken, secret);
        if (payload.role === "admin") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
      } catch {
        // Invalid token → allow login page
      }
    }
    return NextResponse.next();
  }

  // ===== ADMIN ROOT (/admin) =====
  if (pathname === "/admin") {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // ===== PROTECTED ADMIN ROUTES =====
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(adminToken, secret);
      if (payload.role !== "admin") {
        throw new Error();
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
