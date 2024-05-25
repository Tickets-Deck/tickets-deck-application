import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../../services/api-services/requestMethodValidator";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { fetchOrderInformation } from "../../services/order/orderService";
import { customNextResponseError } from "../../utils/customNextResponseError";

export async function GET(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "GET");

  try {
    // Call the function to fetch all orders
    const operation = await fetchOrderInformation(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToSubscribeToNewsletter.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
