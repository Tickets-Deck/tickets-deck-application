import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../../../services/reusable-services/requestMethodValidator";
import { customNextResponseError } from "../../../utils/customNextResponseError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { ApplicationError } from "@/app/constants/applicationError";
import { fetchPayouts } from "../../../services/user/walletService";

export async function GET(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "GET");

  try {
    // Call the function to fetch the user's payouts
    const operation = await fetchPayouts(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToFetchPayouts.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}