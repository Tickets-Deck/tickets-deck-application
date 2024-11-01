// middleware/checkApiKey.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function checkApiKeyMiddleware(req: NextRequest) {
  // Get the API key from the headers
  const apiKey = req.headers.get("x-api-key");

  // Check if the API key exists and is valid
  if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized: Invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Continue to the next middleware or handler
  return NextResponse.next();
}

// Configuration to apply this middleware to all API routes
export const config = {
  matcher: "/api/:path*",
};
