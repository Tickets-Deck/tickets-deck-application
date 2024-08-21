import { ApplicationError } from "@/app/constants/applicationError";
import { BankAccount } from "@/app/models/IBankAccount";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function fetchUserBankAccounts(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // if the userId is not provided, return an error
  if (!userId) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      errorCode: ApplicationError.MissingRequiredParameters.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // find the user with the provided userId
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      bankAccounts: {
        select: {
          accountNumber: true,
          bankName: true,
          accountName: true,
        },
      },
    },
  });

  // If the user is not found, return 404
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Get the user's bank accounts
  const userBankAccounts = user.bankAccounts;

  // Return the user's bank accounts
  return { data: userBankAccounts };
}

export async function createUserBankAccount(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // Get the body from the request
  const request = (await req.json()) as BankAccount;

  // Get the account number from the request
  const { accountNumber, bankName, accountName } = request;

  // if the userId, accountNumber, bankName or accountName is not provided, return an error
  if (!userId || !accountNumber || !bankName || !accountName) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      errorCode: ApplicationError.MissingRequiredParameters.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // find the user with the provided userId
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  // If the user is not found, return 404
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // create a new bank account for the user
  const newBankAccount = await prisma.bankAccounts.create({
    data: {
      accountNumber,
      bankName,
      accountName,
      accountHolder: {
        connect: {
          id: userId,
        },
      },
    },
  });

  // Return the new bank account
  return { data: newBankAccount };
}
