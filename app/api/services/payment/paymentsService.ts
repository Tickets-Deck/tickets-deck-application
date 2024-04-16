import { prisma } from "@/lib/prisma";
import Paystack from "paystack";
import {
  OrderStatus,
  PaymentServiceProvider,
  PaymentStatus,
} from "@prisma/client";
import { PaymentResultData } from "@/app/models/IPaymentResultData";
// import { SystemProcessingError } from "@/app/models/Errors";

// Function to handle successful payment result
export async function handleSuccessfulPayment(
  paymentResult: Paystack.Response
) {
  try {
    const { data } = paymentResult;

    const {
      reference,
      amount,
      paid_at,
      status,
      metadata,
      currency,
    }: PaymentResultData = data;

    const ticketOrderId = metadata.ticketOrderId;

    const existingTicketOrder = await prisma.ticketOrders.findUnique({
      where: {
        id: ticketOrderId,
      },
    });

    if (!existingTicketOrder) {
      throw new Error(
        "Ticket order based on the provided ticket order ID could not be found"
      );
    }

    // Get the payment status of the order
    const paymentStatus = existingTicketOrder.paymentStatus;

    // If payment status is not PaymentStatus.Pending
    if (paymentStatus !== PaymentStatus.Pending) {
      throw new Error("Payment status for the order is not pending");
    }

    const orderedTickets = await prisma.orderedTickets.findMany({
      where: {
        orderId: existingTicketOrder.orderId,
      },
    });

    // console.log("orderedTickets", orderedTickets);

    const existingPayment = await prisma.payments.findFirst({
      where: {
        ticketOrderId: existingTicketOrder.id,
      },
    });

    if (!existingPayment) {
      throw new Error(
        "Payment based on the ticket order ID provided not found"
      );
    }

    const amountPaid = amount / 100;

    // Begin transaction
    await prisma.$transaction([
      // Update the payment table
      prisma.payments.update({
        where: {
          id: existingPayment.id,
        },
        data: {
          amountPaid,
          currency,
          paidAt: new Date(paid_at),
          paymentStatus:
            status === "success" ? PaymentStatus.Paid : PaymentStatus.Failed,
        },
      }),

      // Update the order status, payment status of the order, and the payment ID
      prisma.ticketOrders.update({
        where: {
          id: ticketOrderId,
        },
        data: {
          orderStatus: OrderStatus.Confirmed,
          paymentStatus: PaymentStatus.Paid,
          paymentId: existingPayment.id,
        },
      }),

      // Update the number of ticket orders for the event
      prisma.events.update({
        where: {
          id: existingTicketOrder.eventId,
        },
        data: {
          ticketOrdersCount: {
            increment: 1,
          },
        },
      }),
    ]);

    await prisma.$transaction([
      // Update the ordered ticket status and payment ID for each ordered ticket in the order
      prisma.orderedTickets.updateMany({
        where: {
          orderId: existingTicketOrder.orderId,
        },
        data: {
          orderStatus: OrderStatus.Confirmed,
          paymentId: existingPayment.id,
        },
      }),

      // Update the ticket ordered count and remaining tickets for each ticket in the order
      prisma.tickets.updateMany({
        where: {
          id: {
            in: orderedTickets.map((orderedTicket) => orderedTicket.ticketId),
          },
        },
        data: {
          ticketOrdersCount: {
            increment: 1,
          },
          remainingTickets: {
            decrement: 1,
          },
        },
      }),
      //   ...orderedTickets.map((ticket) =>
      //     prisma.tickets.update({
      //       where: {
      //         id: ticket.ticketId,
      //       },
      //       data: {
      //         ticketOrdersCount: {
      //           increment: 1,
      //         },
      //         remainingTickets: {
      //           decrement: 1,
      //         },
      //       },
      //     })
      //   ),
    ]);

    // If the user ID exists, update the number of tickets bought by the user
    if (existingTicketOrder.userId) {
      // Update the number of tickets bought by the user
      await prisma.users.update({
        where: {
          id: existingTicketOrder.userId,
        },
        data: {
          ticketsBought: {
            increment: orderedTickets.length,
          },
        },
      });
    };

    // Get the event publisher
    const eventPublisher = await prisma.events.findUnique({
      where: {
        id: existingTicketOrder.eventId,
      },
      select: {
        publisherId: true,
      },
    });

    // If the event publisher exists, update the ticketSold count of the event publisher
    if (eventPublisher) {
      // Update the ticketSold count of the event publisher
      await prisma.users.update({
        where: {
          id: eventPublisher.publisherId,
        },
        data: {
          ticketsSold: {
            increment: orderedTickets.length,
          },
          totalRevenue: {
            increment: amountPaid,
          },
        },
      });
    };

    return { data: paymentResult.data };
  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${(error as Error).message}`;
      //   throw new Error(`Error: ${(error as Error).message}`);
    } else {
      // Handle other types of errors
      return `System Error: ${(error as Error).message}`;
      //   throw new Error(`System Error: ${(error as Error).message}`);
    }
  }
}
