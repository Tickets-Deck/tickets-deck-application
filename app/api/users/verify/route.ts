import { NextRequest, NextResponse } from "next/server";
import {
  resendVerificationLink,
  verifyUserEmail,
} from "../../services/user/usersService";
import { customNextResponseError } from "../../utils/customNextResponseError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { validateRequestMethod } from "../../services/api-services/requestMethodValidator";
import { ApplicationError } from "@/app/constants/applicationError";

export async function GET(req: NextRequest) {
  // Call the request validation method
  await validateRequestMethod(req, "GET");

  try {
    // Verify the user email
    const operation = await verifyUserEmail(req);

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.message, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToVerifyEmail.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

export async function POST(req: NextRequest) {
  // Call the request validation method
  await validateRequestMethod(req, "POST");

  try {
    // Resend the verification email
    const operation = await resendVerificationLink(req);

    // If the operation fails, return an error
    if (operation.error) {
      customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.message, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToResendVerificationEmail.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
