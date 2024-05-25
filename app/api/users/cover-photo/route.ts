import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../../services/api-services/requestMethodValidator";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { uploadCoverPhoto } from "../../services/user/photoService";

export async function POST(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "POST");

  try {
    // Call the function to upload the cover photo
    const operation = await uploadCoverPhoto(req);

    // If operation fails, return an error
    if (operation.error) {
      return NextResponse.json(operation, { status: operation.statusCode });
    }

    // Return the response
    return NextResponse.json(operation.data, { status: operation.statusCode });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToUploadCoverPhoto.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
