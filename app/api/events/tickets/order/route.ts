import { OrderStatus } from "@/app/enums/IOrderStatus";
import { PaymentStatus } from "@/app/enums/IPaymentStatus";
import { TicketOrderRequest } from "@/app/models/ITicketOrder";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Fetches the orders for the user
 */
export async function GET(req: NextRequest) {
  if (req.method === "GET") {
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}

/**
 * Creates or initializes the order for the user
 */
export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    // Get the body of the request
    const request = (await req.json()) as TicketOrderRequest;

    console.log("create order request: ", request);

    // Get the event from the request
    const event = await prisma.events.findFirst({
      where: {
        eventId: request.eventId,
      },
    });

    // If event was not found
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
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
    return NextResponse.json(ticketOrder, { status: 201 });
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
