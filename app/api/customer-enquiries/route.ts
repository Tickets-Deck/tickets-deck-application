import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../services/reusable-services/requestMethodValidator";
import { customNextResponseError } from "../utils/customNextResponseError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { ApplicationError } from "@/app/constants/applicationError";
import {
  createEnquiry,
  fetchEnquiries,
} from "../services/customer-enquiry/customerEnquiry";

export async function POST(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "POST");

  try {
    // Call the function to create customer enquiry
    const operation = await createEnquiry(req);

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

export async function GET(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "GET");

  try {
    // Call the function to fetch customer enquiries
    const operation = await fetchEnquiries();

    // If operation fails, return the error
    // if (operation.error) {
    // return customNextResponseError(operation);
    // }

    // Return the response
    return NextResponse.json(operation, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.InternalServerError.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
