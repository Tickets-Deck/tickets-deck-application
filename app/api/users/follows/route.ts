import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../../services/reusable-services/requestMethodValidator";
import {
  getFollowersCount,
  processFollowAction,
} from "../../services/user/followService";
import { customNextResponseError } from "../../utils/customNextResponseError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { ApplicationError } from "@/app/constants/applicationError";

export async function GET(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "GET");

  try {
    // Call the function that fetches the number of the following users and the followers of the user
    const operation = await getFollowersCount(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToPerformSocialAction.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

export async function POST(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "POST");

  try {
    // Call the function that follows or unfollows a user based on the action type
    const operation = await processFollowAction(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToPerformSocialAction.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
