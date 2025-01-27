// middleware/checkApiKey.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken, JWT } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

interface JWT_EXTENSION extends JWT {
  id: string;
  expAt: number;
}

export async function userValidatorMiddleware(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");
  console.log("🚀 ~ userValidatorMiddleware ~ userId:", userId);

  // Get the token from the headers
  const token = req.headers.get("Authorization");
  console.log("🚀 ~ userValidatorMiddleware ~ token:", token);

  // Check if the token exists and is valid using jwt.verify
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized: Invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Verify the token
  const decoded = (await getToken({ req, secret })) as JWT_EXTENSION;
  console.log("🚀 ~ userValidatorMiddleware ~ decoded:", decoded);
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Perform additional checks
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  // Check if token is expired
  if (decoded.id && currentTime > decoded.expAt) {
    console.error("Token has expired.");
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized: Token has expired" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Next would be to check if the organizer's ID is the same as ID in the token (decoded.id)
  // If they are not the same, return an error
  if (decoded.id !== userId) {
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
