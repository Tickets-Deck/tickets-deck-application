import { NextRequest, NextResponse } from "next/server";
import { updateUsername } from "../../services/user/usernameService";
import { customNextResponseError } from "../../utils/customNextResponseError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { validateRequestMethod } from "../../services/api-services/requestMethodValidator";
import { ApplicationError } from "@/app/constants/applicationError";

export async function PUT(req: NextRequest) {
  // Call the request validation method
  await validateRequestMethod(req, "PUT");

  try {
    // Call the updateUsername function
    const operation = await updateUsername(req);

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Updated });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToUpdateUsername.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
