import { ApplicationError } from "@/app/constants/applicationError";
import { OrderStatus } from "@/app/enums/IOrderStatus";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { UserRecentTransaction } from "@/app/models/IUserRecentTransaction";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function fetchRecentTransactions(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // Get the duration from the search params
  const duration = searchParams.get("duration");

  // If a userId is provided, find the user with that id
  if (userId) {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    // If the user is found, return the user
    if (user) {
      // Get the recent transactions of the user within the last 10 days
      const recentTransactions = await prisma.ticketOrders.findMany({
        where: {
          userId: userId,
          createdAt: {
            // gte: new Date(new Date().setDate(new Date().getDate() - (duration ? Number(duration) : 14))),
            gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * Number(duration) ?? 14), // 14 days ago
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          event: true,
        },
        take: 5,
      });

      // Construct the recent transactions data
      const recentTransactionsData: UserRecentTransaction[] =
        recentTransactions.map((transaction) => {
          return {
            eventName: transaction.event.title,
            orderId: transaction.orderId,
            amount: transaction.totalPrice.toString(),
            date: transaction.createdAt as Date,
            status: transaction.orderStatus as OrderStatus,
          };
        });

      // Return the dashboard data
      return { data: recentTransactionsData };
    } else {
      // If the user is not found, return 404
      return {
        error: ApplicationError.UserWithIdNotFound.Text,
        errorCode: ApplicationError.UserWithIdNotFound.Code,
        statusCode: StatusCodes.BadRequest,
      };
    }
  } else {
    // If no userId is provided, return 400
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }
}
