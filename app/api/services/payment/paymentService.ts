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

export async function processPayment(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as InitializePayStack;

  const ticketOrderId = request.ticketOrderId;
  const callbackUrl = request.callbackUrl;
  const organizerAmount = request.organizerAmount;

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
      ticketOrderId,
      organizerAmount,
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
      paymentStatus: PaymentStatus.Paid,
    },
  });

  if (existingPayment) {
    return {
      ticketOrderId: existingPayment.ticketOrderId,
      message: "Payment successfully processed.",
    };
  }

  // Verify the transaction
  const paymentResult = await Paystack(
    process.env.PAYSTACK_SECRET_URL as string
  ).transaction.verify(trxref);

  const { headers } = req;

  const baseUrl = `${
    headers.get("x-forwarded-proto") || "http"
  }://${headers.get("host")}`;

  // If the payment is successful...
  if (paymentResult.data.status == "success") {
    // Process the payment result
    await handleSuccessfulPayment(paymentResult, baseUrl);

    return { data: paymentResult.data };
  } else {
    return {
      error: paymentResult.message,
      errorCode: paymentResult.message,
      statusCode: StatusCodes.BadRequest,
    };
  }
}

// Function to handle successful payment result
export async function handleSuccessfulPayment(
  paymentResult: Paystack.Response,
  baseUrl: string
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
    const organizerAmount = metadata.organizerAmount;

    const existingTicketOrder = await prisma.ticketOrders.findUnique({
      where: {
        id: ticketOrderId,
      },
      include: {
        event: {
          select: {
            publisherId: true,
          },
        },
      },
    });

    if (!existingTicketOrder) {
      throw new Error(
        "Ticket order based on the provided ticket order ID could not be found"
      );
    }

    if (existingTicketOrder.paymentStatus !== PaymentStatus.Pending) {
      throw new Error("Ticket order payment status is not pending");
    }

    const orderedTickets = await prisma.orderedTickets.findMany({
      where: {
        orderId: existingTicketOrder.orderId,
      },
    });

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
    console.log("Transaction began: ", new Date());

    // Update the payment table
    await prisma.payments.update({
      where: {
        id: existingPayment.id,
      },
      data: {
        amountPaid,
        currency,
        paidAt: new Date(paid_at),
        paymentStatus: PaymentStatus.Paid,
      },
    });

    // Update the order status, payment status of the order, and the payment ID
    await prisma.ticketOrders.update({
      where: {
        id: ticketOrderId,
      },
      data: {
        orderStatus: OrderStatus.Confirmed,
        paymentStatus: PaymentStatus.Paid,
        paymentId: existingPayment.id,
      },
    });

    // Update the number of ticket orders for the event
    await prisma.events.update({
      where: {
        id: existingTicketOrder.eventId,
      },
      data: {
        ticketOrdersCount: {
          increment: 1,
        },
      },
    });

    // Update the ordered ticket status and payment ID for each ordered ticket in the order
    await prisma.orderedTickets.updateMany({
      where: {
        orderId: existingTicketOrder.orderId,
      },
      data: {
        orderStatus: OrderStatus.Confirmed,
        paymentId: existingPayment.id,
      },
    });

    // Update the ticket ordered count and remaining tickets for each ticket in the order
    await prisma.tickets.updateMany({
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
    });

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

    const eventPublisher = existingTicketOrder.event.publisherId;

    // If the event publisher exists, update the ticketSold count of the event publisher
    if (eventPublisher) {
      // Update the ticketSold count of the event publisher
      await prisma.users.update({
        where: {
          id: eventPublisher,
        },
        data: {
          ticketsSold: {
            increment: orderedTickets.length,
          },
          totalRevenue: {
            increment: organizerAmount,
          },
        },
      });
    }

    console.log("Transaction end: ", new Date());

    // Process the email notification to the user
    await processEmailNotification(paymentResult, baseUrl);

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
