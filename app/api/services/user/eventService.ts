import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import { NextRequest } from "next/server";

type GroupedEventData = {
  [key: string]: {
    id: string;
    title: string;
    totalTicketsSold: number;
    totalAmountPaid: number;
  };
};

export async function fetchEventsPayments(req: NextRequest) {
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
              organizerPaysFee: true, // flag to determine if the organizer pays the 5% fee
              couponCodes: true, // flag to determine if the user used a coupon code
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
