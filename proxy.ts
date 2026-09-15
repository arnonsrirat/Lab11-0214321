import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session");

  // หากไม่มี Session Cookie
  if (!session || !session.value) {
    // กรณีเป็น API request ให้ส่ง JSON 401 Unauthorized
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "เข้าถึงถูกปฏิเสธ: กรุณาเข้าสู่ระบบก่อนทำรายการ" },
        { status: 401 }
      );
    }
    // กรณีเป็น Web Page ให้ Redirect ไปที่หน้า /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// matcher คุ้มครอง Protected Pages และ Protected API Routes
export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/posts/create",
    "/posts/:id/edit",
    "/api/comments",
    "/api/change-password",
  ],
};
