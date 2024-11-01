import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { PaymentServiceProvider, PaymentStatus } from "@prisma/client";
import { NextRequest } from "next/server";

export async function fetchWalletBalance(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // If no userId is provided, return 400
  if (!userId) {
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If a userId is provided, find the user with that id
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

  const ticketSold = await prisma.payments.findMany({
    where: {
      ticketOrder: {
        event: {
          publisherId: userId,
        },
        paymentStatus: PaymentStatus.Paid,
      },
    },
    select: {
      amountPaid: true,
      ticketOrder: {
        select: {
          quantity: true,
        },
      },
    },
  });

  const ticketRevenue = ticketSold.reduce(
    (acc, curr) => acc + Number(curr.amountPaid),
    0
  );

  // Construct the wallet balance data
  const walletBalance = {
    // balance: Number(user.totalRevenue),
    balance: ticketRevenue,
  };

  // Return the wallet balance data
  return { data: walletBalance };
}

export async function initiateWitdrawal(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the amount to withdraw from the search params
  const amount = searchParams.get("amount");

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // If no userId is provided, return 400
  if (!userId) {
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If no amount is provided, return 400
  if (!amount) {
    return {
      error: ApplicationError.AmountIsRequired.Text,
      errorCode: ApplicationError.AmountIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If a userId is provided, find the user with that id
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    include: {
      bankAccounts: true,
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

  // If the user has no bank account, return 400
  if (!user.bankAccounts) {
    return {
      error: ApplicationError.NoBankAccount.Text,
      errorCode: ApplicationError.NoBankAccount.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Get the amount witdrawable by the user
  const witdrawable = Number(user.totalRevenue) - Number(user.totalWithdrawn);

  // Check if the user has enough balance to withdraw the amount
  if (witdrawable < Number(amount)) {
    return {
      error: ApplicationError.InsufficientBalance.Text,
      errorCode: ApplicationError.InsufficientBalance.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Create a withdrawal request
  const withdrawalRequest = await prisma.payouts.create({
    data: {
      amount: Number(amount),
      organizerId: userId,
      status: PaymentStatus.Pending,
      paymentMethod: PaymentServiceProvider.BankTransfer,
    },
  });

  // Send the withdrawal request to the payment service provider
  // This is where you would send the withdrawal request to the payment service provider

  // Send an email to the user to notify them of the withdrawal request

  // Send an email to the admin to notify them of the withdrawal request
  await sendMail({
    to: process.env.SMTP_EMAIL as string,
    name: "Payout Request",
    subject: "New Payout Request!",
    body: `
    A new payout request of ${amount.toLocaleLowerCase()} naira has been initiated by ${
      user.email
    }. 
    \n\n Organizer details: 
    \n Name: ${user.firstName} ${user.lastName} 
    \n Email: ${user.email} 
    \n Phone: ${user.phone ?? "Unavailable"}
    \n Username: ${user.username ?? "Unavailable"}
    `,
  });

  // Return the withdrawal request
  return { data: withdrawalRequest };
}

export async function fetchPayouts(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // If no userId is provided, return 400
  if (!userId) {
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If a userId is provided, find the user with that id
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      payouts: {
        orderBy: {
            createdAt: "desc"
        }
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

  // Return the payouts
  return { data: user.payouts };
}
