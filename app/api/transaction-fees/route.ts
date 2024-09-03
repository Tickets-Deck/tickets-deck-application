import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../services/reusable-services/requestMethodValidator";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { customNextResponseError } from "../utils/customNextResponseError";
import { fetchAllTransactionFees } from "../services/transaction-fee/feeService";

export async function GET(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "GET");

  try {
    // Fetch all transaction fees
    const operation = await fetchAllTransactionFees();

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
