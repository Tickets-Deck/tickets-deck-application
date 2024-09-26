import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { TicketOrderRequest } from "@/app/models/ITicketOrder";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextRequest } from "next/server";
import { processEmailNotification } from "../notification/emailNotification";
import Paystack from "paystack";
import { PaymentResultData } from "@/app/models/IPaymentResultData";
import { verifyCouponCode } from "../coupon/couponService";

export async function fetchOrderInformation(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the ticket's order Id from the search params
  const specifiedTicketOrderId = searchParams.get("ticketOrderId");

  // If a specified ticket order Id is not provided, return 400
  if (!specifiedTicketOrderId) {
    return {
      error: ApplicationError.TicketOrderIdIsRequired.Text,
      errorCode: ApplicationError.TicketOrderIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Find the ticket order with the specified ID
  const ticketOrder = await prisma.ticketOrders.findFirst({
    where: {
      id: specifiedTicketOrderId,
    },
    include: {
      event: {
        include: {
          user: true,
        },
      },
    },
  });

  // If the ticket order is not found, return 404
  if (!ticketOrder) {
    return {
      error: ApplicationError.TicketOrderWithIdNotFound.Text,
      errorCode: ApplicationError.TicketOrderWithIdNotFound.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Fetch every ordered tickets for the ticket order using it's orderId
  const orderedTickets = await prisma.orderedTickets.findMany({
    where: {
      orderId: ticketOrder?.orderId,
    },
    include: {
      ticket: true,
    },
  });

  // Create the ticket order data object
  const ticketOrderData = {
    ...ticketOrder,
    orderedTickets: orderedTickets,
  };

  // If the ticket order is found, return the ticket order
  return { data: ticketOrderData };
}

export async function initializeOrder(req: NextRequest) {
  // Get the headers from the request
  const { headers } = req;

  // Get the body of the request
  const request = (await req.json()) as TicketOrderRequest;

  // If event ID is not provided, return 400
  if (!request.eventId) {
    return {
      error: ApplicationError.EventIdIsRequired.Text,
      errorCode: ApplicationError.EventIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Get the event from the request
  const event = await prisma.events.findFirst({
    where: {
      eventId: request.eventId,
    },
  });

  // If event was not found
  if (!event) {
    return {
      error: ApplicationError.EventWithIdNotFound.Text,
      errorCode: ApplicationError.EventWithIdNotFound.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Retrieve the transaction fee from DB
  const eventTransactionFee = await prisma.transactionFees.findFirst({
    where: {
      events: {
        some: {
          eventId: request.eventId,
        },
      },
    },
  });

  const generalTransactionFee = await prisma.transactionFees.findFirst({
    where: {
      events: {
        none: {},
      },
    },
  });

  // Get the total price of the tickets
  const preTotalPrice = request.tickets.reduce(
    (accumulator, ticket) => accumulator + ticket.price,
    0
  );

  // declare coupon code discount
  let couponDiscount = 0;

  // if a coupon code is provided, verify the coupon code
  if (request.couponCode) {
    const verifiedCoupon = await verifyCouponCode(
      request.eventId,
      request.couponCode
    );

    if (verifiedCoupon.data) {
      couponDiscount = Number(verifiedCoupon.data.discount);
    } else {
      return {
        error: verifiedCoupon.error,
        errorCode: verifiedCoupon.errorCode,
        statusCode: StatusCodes.BadRequest,
      };
    }

    // reduce the max usage of the coupon code
    await prisma.couponCodes.update({
      where: {
        code: request.couponCode,
      },
      data: {
        maxUsage: {
          decrement: 1,
        },
      },
    });
  }

  const transactionFeePercentage =
    eventTransactionFee?.percentage ?? generalTransactionFee?.percentage ?? 0;
  const flatFee =
    eventTransactionFee?.flatFee ?? generalTransactionFee?.flatFee ?? 0;

  const totalPrice = event.organizerPaysFee || preTotalPrice == 0
    ? preTotalPrice - (preTotalPrice * couponDiscount) / 100
    : (preTotalPrice * Number(transactionFeePercentage)) / 100 +
      preTotalPrice +
      Number(flatFee) -
      (preTotalPrice * couponDiscount) / 100;

  // Create the order
  const ticketOrder = await prisma.ticketOrders.create({
    data: {
      user: request.userId
        ? {
            connect: {
              id: request.userId,
            },
          }
        : undefined,
      event: {
        connect: {
          id: event.id,
        },
      },
      quantity: request.tickets.length,
      totalPrice: totalPrice,
      contactEmail: request.contactEmail,
      contactFirstName: request.contactFirstName ?? null,
      contactLastName: request.contactLastName ?? null,
      contactNumber: request.contactPhone ?? null,
      // Generate order ID here
      orderId: "T" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      orderStatus: totalPrice > 0 ? OrderStatus.Pending : OrderStatus.Confirmed,
      paymentStatus:
        totalPrice > 0 ? PaymentStatus.Pending : PaymentStatus.Paid,
      paymentId: null,
    },
  });

  // Create each ordered ticket
  for (const ticket of request.tickets) {
    await prisma.orderedTickets.create({
      data: {
        ticketId: ticket.ticketId,
        orderId: ticketOrder.orderId,
        associatedEmail: ticket.associatedEmail,
        contactEmail: ticketOrder.contactEmail,
        price: ticket.price,
        orderStatus: ticketOrder.orderStatus,
        paymentId: ticketOrder.paymentId,
      },
    });
  }

  // If the order was created by an existing user...
  if (request.userId) {
    // Update the user's orders
    await prisma.users.update({
      where: {
        id: request.userId,
      },
      data: {
        ticketOrders: {
          connect: {
            id: ticketOrder.id,
          },
        },
      },
    });
  }

  // If the order is a free order
  if (totalPrice === 0) {
    // Initialize the base URL
    const baseUrl = `${
      headers.get("x-forwarded-proto") || "http"
    }://${headers.get("host")}`;

    // Initialize the payment result
    const paymentResult = {
      data: {
        reference: "free_order",
        amount: 0,
        paid_at: new Date().toISOString(),
        status: true,
        metadata: {
          ticketOrderId: ticketOrder.id,
        },
        currency: "NGN",
        message: "Free order",
      },
    };

    // Process the free order
    await processFreeOrder(paymentResult as Paystack.Response);

    // Process the email notification to the user
    await processEmailNotification(paymentResult as Paystack.Response, baseUrl);
  }

  //   console.log("🚀 ~ initializeOrder ~ ticketOrder:", ticketOrder)

  // Return the created ticket order
  return { data: ticketOrder };
}

export async function processFreeOrder(paymentResult: Paystack.Response) {
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

    const orderedTickets = await prisma.orderedTickets.findMany({
      where: {
        orderId: existingTicketOrder.orderId,
      },
    });
    // console.log("🚀 ~ processFreeOrder ~ orderedTickets:", orderedTickets)

    //   console.log("orderedTickets", orderedTickets);

    //   const existingPayment = await prisma.payments.findFirst({
    //     where: {
    //       ticketOrderId: existingTicketOrder.id,
    //     },
    //   });

    //   if (!existingPayment) {
    //     throw new Error(
    //       "Payment based on the ticket order ID provided not found"
    //     );
    //   }

    const amountPaid = amount / 100;

    // Begin Interactive transaction
    prisma.$transaction(async (_context) => {
      // Update the order status, payment status of the order, and the payment ID
      _context.ticketOrders.update({
        where: {
          id: ticketOrderId,
        },
        data: {
          orderStatus: OrderStatus.Confirmed,
          paymentStatus: PaymentStatus.Paid,
          // paymentId: existingPayment.id,
        },
      });

      // Update the number of ticket orders for the event
      _context.events.update({
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
      _context.orderedTickets.updateMany({
        where: {
          orderId: existingTicketOrder.orderId,
        },
        data: {
          orderStatus: OrderStatus.Confirmed,
          // paymentId: existingPayment.id,
        },
      });

      // Update the ticket ordered count and remaining tickets for each ticket in the order
      _context.tickets.updateMany({
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
        await _context.users.update({
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
      const eventPublisher = await _context.events.findUnique({
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
        await _context.users.update({
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
    });

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
