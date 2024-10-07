import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";
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

  const ticketRevenue = ticketSold.reduce((acc, curr) => acc + Number(curr.amountPaid), 0);

  // Construct the wallet balance data
  const walletBalance = {
    // balance: Number(user.totalRevenue),
    balance: ticketRevenue,
  };

  // Return the wallet balance data
  return { data: walletBalance };
}
