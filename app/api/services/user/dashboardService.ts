import { ApplicationError } from "@/app/constants/applicationError";
import { DashboardInfoResponse } from "@/app/models/IDashboardInfoResponse";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import { NextRequest } from "next/server";

export async function fetchDashboardData(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // If a userId is provided, find the user with that id
  if (userId) {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    // If the user is found, return the user
    if (user) {
      // find all the paid tickets bought by the user
      const ticketsBought = await prisma.ticketOrders.count({
        where: {
          userId,
          paymentStatus: PaymentStatus.Paid,
        },
      });

      // find all the paid tickets sold by the user
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
      //   console.log("🚀 ~ fetchDashboardData ~ ticketSold:", ticketSold);

      // Construct the dashboard data
      const dashboardData: DashboardInfoResponse = {
        ticketsBought: ticketsBought,
        ticketsSold: ticketSold.reduce(
          (acc, curr) => acc + Number(curr.ticketOrder.quantity),
          0
        ),
        totalRevenue: ticketSold.reduce(
          (acc, curr) => acc + Number(curr.amountPaid),
          0
        ),
        totalEvents: user.eventsCount,
        totalEventLikes: user.favoritesCount,
        totalEventShares: 0,
        totalEventViews: 0,
      };

      // Return the dashboard data
      return { data: dashboardData };
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

type GroupedEventData = {
  [key: string]: {
    id: string;
    title: string;
    totalTicketsSold: number;
    totalAmountPaid: number;
  };
};

export async function fetchTicketSoldMetrics(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  if (!userId) {
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
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
          event: {
            select: {
              id: true,
              title: true,
            },
          },
          quantity: true,
        },
      },
    },
  });

  const groupedData = ticketSold.reduce<GroupedEventData>((acc, payment) => {
    const eventId = payment.ticketOrder.event.id;
    const eventTitle = payment.ticketOrder.event.title;
    const ticketsSold = payment.ticketOrder.quantity;
    const amountPaid = Number(payment.amountPaid);

    if (!acc[eventId]) {
      acc[eventId] = {
        id: eventId,
        title: eventTitle,
        totalTicketsSold: 0,
        totalAmountPaid: 0,
      };
    }

    acc[eventId].totalTicketsSold += ticketsSold;
    acc[eventId].totalAmountPaid += amountPaid;

    return acc;
  }, {});

  // Convert grouped data to an array
  const result = Object.values(groupedData);

  return { data: result };
}
