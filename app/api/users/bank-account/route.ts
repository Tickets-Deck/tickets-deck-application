import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../../services/reusable-services/requestMethodValidator";
import { customNextResponseError } from "../../utils/customNextResponseError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { ApplicationError } from "@/app/constants/applicationError";
import {
  createUserBankAccount,
  fetchUserBankAccounts,
} from "@/app/api/services/user/bankService";

export async function GET(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "GET");

  try {
    // Call the function to fetch all banks for the user
    const operation = await fetchUserBankAccounts(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToFetchUserBankAccounts.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

export async function POST(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "POST");

  try {
    // Call the function to create a user bank account
    const operation = await createUserBankAccount(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToCreateUserBankAccount.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
