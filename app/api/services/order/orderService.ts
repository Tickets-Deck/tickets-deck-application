import { ApplicationError } from "@/app/constants/applicationError";
import { OrderStatus } from "@/app/enums/IOrderStatus";
import { PaymentStatus } from "@/app/enums/IPaymentStatus";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { TicketOrderRequest } from "@/app/models/ITicketOrder";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

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
      totalPrice: request.tickets.reduce(
        (accumulator, ticket) => accumulator + ticket.price,
        0
      ),
      contactEmail: request.contactEmail,
      // Generate order ID here
      orderId: "T" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      orderStatus: OrderStatus.Pending,
      paymentStatus: PaymentStatus.Pending,
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

  // If the order was created by an exisitng user...
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

  // Return the created ticket order
  return { data: ticketOrder };
}
