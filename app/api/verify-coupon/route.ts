import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../services/reusable-services/requestMethodValidator";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { customNextResponseError } from "../utils/customNextResponseError";
import { fetchAllTransactionFees } from "../services/transaction-fee/feeService";
import { verifyCouponCode } from "../services/coupon/couponService";

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "GET");

  try {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);
  
    // Get the eventId from the search params
    const eventId = searchParams.get("eventId");
  
    // Get the couponCode from the search params
    const couponCode = searchParams.get("couponCode");

    // Fetch all transaction fees
    const operation = await verifyCouponCode(eventId as string, couponCode as string);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToFetchTransactionFees.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
