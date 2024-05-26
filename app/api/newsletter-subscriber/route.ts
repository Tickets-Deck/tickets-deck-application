import { StatusCodes } from "@/app/models/IStatusCodes";
import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../services/api-services/requestMethodValidator";
import { subscribeToNewsletter } from "../services/webContent/newsletterSubscriptionService";
import { customNextResponseError } from "../utils/customNextResponseError";
import { ApplicationError } from "@/app/constants/applicationError";

export async function POST(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "POST");

  try {
    // Call the function to subscribe to the newsletter
    const operation = await subscribeToNewsletter(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToSubscribeToNewsletter.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
