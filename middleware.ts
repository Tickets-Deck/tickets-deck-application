import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";
import { checkApiKeyMiddleware } from "./app/middleware/checkApiKeyMiddleware";

// Wrap the `withAuth` middleware
const authMiddleware = withAuth({
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized: ({ req, token }) => {
      if (token === null) return false;
      else return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export function middleware(req: NextRequest) {
  console.log("🚀 ~ middleware ~ req.nextUrl.pathname:", req.nextUrl.pathname);
  // Apply the API key check for `/api` routes
  if (req.nextUrl.pathname.startsWith("/api")  && !req.nextUrl.pathname.startsWith("/api/auth")) {
    const apiKeyResponse = checkApiKeyMiddleware(req);
    if (apiKeyResponse) return apiKeyResponse;
  }

  withAuth({
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ req, token }) => {
        if (token === null) return false;
        else return true;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  });
  // Apply `withAuth` for other routes (e.g., `/app`)
  // return authMiddleware(req);
}

// See "Matching Paths" below to learn more
export const config = {
  //   matcher: "/app/:path*",
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth (Auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // "/((?!auth|_next/static|_next/image|favicon.ico|api/auth).*)",
    // "/((?!auth|_next/static|_next/image|favicon.ico|api|$).*)", // Uncomment to use in postman
    // Explicitly include every path under /app
    "/app/:path*",
    "/api/:path*",
    // Use regex to match patterns
    // "/path-prefix/(.*)",
  ],
};
