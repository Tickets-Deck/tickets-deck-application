import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../../services/reusable-services/requestMethodValidator";
import { customNextResponseError } from "../../utils/customNextResponseError";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import {
  checkInAttendee,
  fetchFeaturedEvents,
} from "../../services/event/eventService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "POST");

  try {
    // Call the function to check-in an ordered ticket
    const operation = await checkInAttendee(req);

    if (operation.error) {
      return NextResponse.json(operation, {
        status: operation.statusCode,
      });
    }

    // Return the response
    return NextResponse.json(operation.data, {
      status: StatusCodes.Success,
    });
  } catch (error) {
    console.log("Error checking in: ", error);
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.InternalServerError.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
