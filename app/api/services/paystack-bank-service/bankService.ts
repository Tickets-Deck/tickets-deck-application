import { ApplicationError } from "@/app/constants/applicationError";
import { OrderStatus } from "@/app/enums/IOrderStatus";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { UserRecentTransaction } from "@/app/models/IUserRecentTransaction";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function fetchAllBanks() {
  // send request to paystack to get all banks
  const response = await fetch("https://api.paystack.co/bank?currency=NGN", {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_URL}`,
    },
  });

  // if the request was not successful, return an error
  if (!response.ok) {
    return {
      error: ApplicationError.BankListError.Text,
      errorCode: ApplicationError.BankListError.Code,
      statusCode: StatusCodes.InternalServerError,
    };
  }

  const data = await response.json();

  return { ...data };
}

export async function fetchBankDetails(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the account number from the search params
  const accountNumber = searchParams.get("accountNumber");

  // Get the bank code from the search params
  const bankCode = searchParams.get("bankCode");

  // if the account number or bank code is not provided, return an error
  if (!accountNumber || !bankCode) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      errorCode: ApplicationError.MissingRequiredParameters.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // send request to paystack to get bank details
  const response = await fetch(
    `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_URL}`,
      },
      method: "GET",
    }
  );

  // if the request was not successful, return an error
  if (!response.ok) {
    return {
      error: ApplicationError.BankDetailsError.Text,
      errorCode: ApplicationError.BankDetailsError.Code,
      statusCode: StatusCodes.InternalServerError,
    };
  }

  const verifiedData = await response.json();

  return { ...verifiedData };
}
