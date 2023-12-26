import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/app")) {
    // This logic is only applied to pages that start with /app
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  } else {
    // Otherwise, let the request continue
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/app/:path*",
};
