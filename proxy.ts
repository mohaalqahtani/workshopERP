import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { betterFetch } from "@better-fetch/fetch"

// تعريف نوع السيشن بوضوح
type UserRole = "ADMIN" | "RECEPTIONIST" | "TECHNICIAN"

type Session = {
  user: {
    id: string
    email: string
    role: UserRole
  }
  session: {
    id: string
    expiresAt: string
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.nextUrl.searchParams.get("token")

  if (pathname.startsWith("/reset-password") && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  // ✅ الطريقة الحديثة - betterFetch بدل getSession
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    }
  )

  // حماية كل الـ dashboard من غير تسجيل دخول
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (session) {
    const userRole = session.user.role

    if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (
      pathname.startsWith("/dashboard/receptionist") &&
      userRole !== "RECEPTIONIST" &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (
      pathname.startsWith("/dashboard/technician") &&
      userRole !== "TECHNICIAN" &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/reset-password"],
}

// Thanks Claude For Fix And Help 😊
