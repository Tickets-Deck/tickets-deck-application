import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { uploadProfilePhoto } from "../../services/user/photoService";
import { customNextResponseError } from "../../utils/customNextResponseError";
import { validateRequestMethod } from "../../services/reusable-services/requestMethodValidator";
import { ApplicationError } from "@/app/constants/applicationError";

export async function POST(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "POST");

  try {
    // Call the function to upload user profile photo
    const operation = await uploadProfilePhoto(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToUploadProfilePhoto.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
