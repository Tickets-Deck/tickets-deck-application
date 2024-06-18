import { validateRequestMethod } from "@/app/api/services/reusable-services/requestMethodValidator";
import { requestPasswordResetLink, resetPassword } from "@/app/api/services/user/passwordService";
import { customNextResponseError } from "@/app/api/utils/customNextResponseError";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Call the request validation method
  await validateRequestMethod(req, "POST");

  try {
    // Call the password reset method
    const operation = await resetPassword(req);

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch (error) {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToSendPasswordResetEmail.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
