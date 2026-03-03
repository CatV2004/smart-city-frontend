import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RoleName } from "./features/role/types";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;

  let role: string | null = null;

  if (token) {
    try {
      const payload = parseJwt(token);
      // kiểm tra token hết hạn
      if (payload.exp * 1000 < Date.now()) {
        return redirectToLogin(request);
      }

      role = payload.role;
    } catch (err) {
      return redirectToLogin(request);
    }
  }
  // 1️⃣ Chưa login mà vào route protected
  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/citizen")) {
      return redirectToLogin(request);
    }
  }

  // 2️⃣ Đã login mà vào /login
  if (token && pathname === "/login") {
    if (role === RoleName.ADMIN) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }

    if (role === RoleName.CITIZEN) {
      return NextResponse.redirect(
        new URL("/citizen", request.url)
      );
    }
  }

  // 3️⃣ Protect admin route
  if (pathname.startsWith("/admin")) {
    if (role !== RoleName.ADMIN) {
      return NextResponse.redirect(
        new URL("/citizen", request.url)
      );
    }
  }

  // 4️⃣ Protect citizen route
  if (pathname.startsWith("/citizen")) {
    if (role !== RoleName.CITIZEN) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  return JSON.parse(decoded);
}

export const config = {
  matcher: ["/admin/:path*", "/citizen/:path*", "/login"],
};