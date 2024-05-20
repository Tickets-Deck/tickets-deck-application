import { NextRequest, NextResponse } from "next/server";
import {
  resendVerificationLink,
  verifyUserEmail,
} from "../../services/user/usersService";

export async function GET(req: NextRequest) {
  // If the request method is not GET, return an error
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    // Verify the user email
    const operation = await verifyUserEmail(req);

    // If the operation fails, return an error
    if (operation.error) {
      return NextResponse.json(
        {
          error: operation.error,
          errorCode: operation.errorCode
        },
        { status: operation.statusCode }
      );
    }

    // Return the response
    return NextResponse.json(operation, { status: 200 });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // If the request method is not POST, return an error
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    // Resend the verification email
    const response = await resendVerificationLink(req);

    // Return the response
    return NextResponse.json(response, { status: 200 });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
