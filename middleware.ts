import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const userIsAuthenticated = request.cookies.get("next-auth.session-token");

    // If the user is not authenticated, redirect to /auth/signin
    if (!userIsAuthenticated && request.nextUrl.pathname.startsWith("/app")) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    } else {
        // Otherwise, let the request continue
        return NextResponse.next();
    }

//   if (request.nextUrl.pathname.startsWith("/app")) {
//     // This logic is only applied to pages that start with /app
//     return NextResponse.redirect(new URL("/auth/signin", request.url));
//   } else {
//     // Otherwise, let the request continue
//     return NextResponse.next();
//   }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/app/:path*",
};
