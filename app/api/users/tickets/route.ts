import { StatusCodes } from "@/app/models/IStatusCodes";
import { NextRequest, NextResponse } from "next/server";
import { customNextResponseError } from "../../utils/customNextResponseError";
import { validateRequestMethod } from "../../services/reusable-services/requestMethodValidator";
import { ApplicationError } from "@/app/constants/applicationError";
import { fetchUserTickets } from "../../services/user/ticketService";

export async function GET(req: NextRequest) {
  // Call the request validation method
  await validateRequestMethod(req, "GET");

  try {
    // Call the function to fetch tickets
    const operation = await fetchUserTickets(req);

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToFetchTickets.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
