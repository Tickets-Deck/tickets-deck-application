import { prisma } from "@/lib/prisma";
import Paystack from "paystack";
import {
  OrderStatus,
  PaymentServiceProvider,
  PaymentStatus,
} from "@prisma/client";
import { PaymentResultData } from "@/app/models/IPaymentResultData";
import { InitializePayStack } from "@/app/models/IInitializePayStack";
import { NextRequest } from "next/server";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { generatePaymentReference } from "@/app/constants/idgenerator";
import { processEmailNotification } from "../notification/emailNotification";

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
    }

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
    }

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

export async function processPayment(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as InitializePayStack;

  const ticketOrderId = request.ticketOrderId;
  const callbackUrl = request.callbackUrl;

  // Check if the ticketOrderId or callbackUrl is null
  if (ticketOrderId === null || callbackUrl === null) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      errorCode: ApplicationError.MissingRequiredParameters.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if ticket order id exist in database
  const existingTicketOrder = await prisma.ticketOrders.findUnique({
    where: {
      id: ticketOrderId,
    },
    include: {
      user: true,
    },
  });

  // If ticket order id does not exist in database...
  if (!existingTicketOrder) {
    return {
      error: ApplicationError.TicketOrderWithIdNotFound.Text,
      errorCode: ApplicationError.TicketOrderWithIdNotFound.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  const paymentInitiatedForOrder =
    existingTicketOrder.orderStatus == OrderStatus.PaymentInitiated;
  const orderConfirmed =
    existingTicketOrder.orderStatus == OrderStatus.Confirmed;
  const orderCancelled =
    existingTicketOrder.orderStatus == OrderStatus.Cancelled;

  // If payment has been initiated for the order
  if (paymentInitiatedForOrder || orderConfirmed || orderCancelled) {
    return {
      error: ApplicationError.TicketOrderHasBeenProcessed.Text,
      errorCode: ApplicationError.TicketOrderHasBeenProcessed.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Get the user associated with that ticket order
  const associatedUser = existingTicketOrder.user;

  const amountInKobo = existingTicketOrder.totalPrice.toNumber() * 100;

  // Initialize paystack payment
  const paymentResult = await Paystack(
    process.env.PAYSTACK_SECRET_URL as string
  ).transaction.initialize({
    amount: amountInKobo,
    reference: generatePaymentReference(),
    name: associatedUser
      ? `${associatedUser.firstName} ${associatedUser.lastName}`
      : existingTicketOrder.contactEmail,
    email: existingTicketOrder.contactEmail,
    callback_url: callbackUrl,
    metadata: {
      ticketOrderId: ticketOrderId,
    },
  });

  if (paymentResult.status === true) {
    // Create the payment
    await prisma.payments.create({
      data: {
        userId: associatedUser ? associatedUser.id : null,
        amount: existingTicketOrder.totalPrice,
        ticketOrderId: ticketOrderId,
        amountPaid: null,
        currency: null,
        paymentStatus: PaymentStatus.Pending,
        paymentReference: paymentResult.data.reference,
        paymentServiceProvider: PaymentServiceProvider.Paystack,
      },
    });

    // Update the order status of the order
    await prisma.ticketOrders.update({
      where: {
        id: ticketOrderId,
      },
      data: {
        orderStatus: OrderStatus.PaymentInitiated,
      },
    });

    // Update the each ordered ticket status
    await prisma.orderedTickets.updateMany({
      where: {
        orderId: ticketOrderId,
      },
      data: {
        orderStatus: OrderStatus.PaymentInitiated,
      },
    });

    // Get the ordered tickets from the ticket order id
    const orderedTickets = await prisma.orderedTickets.findMany({
      where: {
        orderId: ticketOrderId,
      },
      include: {
        ticket: true,
      },
    });

    // Update the ticket ordered count of each ticket
    for (const ticket of orderedTickets) {
      await prisma.tickets.update({
        where: {
          id: ticket.ticketId,
        },
        data: {
          ticketOrdersCount: ticket.ticket.ticketOrdersCount + 1,
          // remainingTickets: ticket.ticket.remainingTickets -
        },
      });
    }

    return { data: paymentResult.data };
  } else {
    return {
      error: ApplicationError.PaymentInitializationFailed.Text,
      errorCode: ApplicationError.PaymentInitializationFailed.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }
}

export async function verifyPayment(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the transaction reference id from the search params
  const trxref = searchParams.get("trxref");

  // If a transaction reference id is not provided...
  if (!trxref) {
    return {
      error: ApplicationError.TransactionReferenceIsRequired.Text,
      errorCode: ApplicationError.TransactionReferenceIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if the payment has been verified ~ by checking if the payment reference id exists in the database, and the payment status is paid
  const existingPayment = await prisma.payments.findFirst({
    where: {
      paymentReference: trxref,
      AND: {
        paymentStatus: PaymentStatus.Paid,
      },
    },
  });

  if (existingPayment) {
    return {
      message:
        "Your payment has already been successfully processed. You are all set for the event.",
    };
  }

  // Verify the transaction
  const paymentResult = await Paystack(
    process.env.PAYSTACK_SECRET_URL as string
  ).transaction.verify(trxref);

  // console.log("payment result: ", paymentResult);
  const { headers } = req;

  const baseUrl = `${
    headers.get("x-forwarded-proto") || "http"
  }://${headers.get("host")}`;

  // If the payment is successful...
  if (paymentResult.status === true) {
    // Process the payment result
    await handleSuccessfulPayment(paymentResult);

    // Process the email notification to the user
    await processEmailNotification(paymentResult, baseUrl);

    //   console.log("Payment result data: ", paymentResult.data);

    return { data: paymentResult.data };
  } else {
    return {
      error: paymentResult.message,
      errorCode: paymentResult.message,
      statusCode: StatusCodes.BadRequest,
    };
  }
}
