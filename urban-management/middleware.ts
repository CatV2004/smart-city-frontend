import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RoleName } from "./features/role/types";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;

  let role: string | null = null;

  // 🔐 Parse token
  if (token) {
    try {
      const payload = parseJwt(token);

      // check expire
      if (payload.exp * 1000 < Date.now()) {
        return redirectToLogin(request);
      }

      role = payload.role;
    } catch (err) {
      return redirectToLogin(request);
    }
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isCitizenRoute = pathname.startsWith("/citizen");
  const isStaffRoute = pathname.startsWith("/staff");
  const isLoginPage = pathname === "/login";

  // ===============================
  // 1️⃣ Chưa login → chặn
  // ===============================
  if (!token) {
    if (isAdminRoute || isCitizenRoute || isStaffRoute) {
      return redirectToLogin(request);
    }
  }

  // ===============================
  // 2️⃣ Đã login → vào /login
  // ===============================
  if (token && isLoginPage) {
    return redirectByRole(role, request);
  }

  // ===============================
  // 3️⃣ Protect ADMIN
  // ===============================
  if (isAdminRoute && role !== RoleName.ADMIN) {
    return redirectByRole(role, request);
  }

  // ===============================
  // 4️⃣ Protect CITIZEN
  // ===============================
  if (isCitizenRoute && role !== RoleName.CITIZEN) {
    return redirectByRole(role, request);
  }

  // ===============================
  // 5️⃣ Protect STAFF
  // ===============================
  if (isStaffRoute && role !== RoleName.STAFF) {
    return redirectByRole(role, request);
  }

  return NextResponse.next();
}

// ===============================
// 🔁 Redirect theo role
// ===============================
function redirectByRole(role: string | null, request: NextRequest) {
  if (role === RoleName.ADMIN) {
    return NextResponse.redirect(
      new URL("/admin/dashboard", request.url)
    );
  }

  if (role === RoleName.STAFF) {
    return NextResponse.redirect(
      new URL("/staff/dashboard", request.url)
    );
  }

  if (role === RoleName.CITIZEN) {
    return NextResponse.redirect(
      new URL("/citizen", request.url)
    );
  }

  return redirectToLogin(request);
}

// ===============================
function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

// ===============================
function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  return JSON.parse(decoded);
}

// ===============================
export const config = {
  matcher: ["/admin/:path*", "/citizen/:path*", "/staff/:path*", "/login"],
};