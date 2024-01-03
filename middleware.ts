import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

// This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   const devUserIsAuthenticated = request.cookies.get("next-auth.session-token");
//   const userIsAuthenticated = request.cookies.get("__Secure-next-auth.session-token");

//     if(request.nextUrl.pathname.startsWith("/app")) {
//         if(!devUserIsAuthenticated || !userIsAuthenticated) {
//             return NextResponse.redirect(new URL("/auth/signin", request.url));
//         }
//         // Otherwise, let the request continue
//         return NextResponse.next();
//     } else {
//         return NextResponse.next();
//     }

    // If the user is not authenticated, redirect to /auth/signin
    // if ((!devUserIsAuthenticated || !userIsAuthenticated) && request.nextUrl.pathname.startsWith("/app")) {
    //     return NextResponse.redirect(new URL("/auth/signin", request.url));
    // } else {
    //     // Otherwise, let the request continue
    //     return NextResponse.next();
    // }

//   if (request.nextUrl.pathname.startsWith("/app")) {
//     // This logic is only applied to pages that start with /app
//     return NextResponse.redirect(new URL("/auth/signin", request.url));
//   } else {
//     // Otherwise, let the request continue
//     return NextResponse.next();
//   }

// }

export default withAuth({
    secret: process.env.SECRET,
  });


// See "Matching Paths" below to learn more
export const config = {
  matcher: "/app/:path*",
};
