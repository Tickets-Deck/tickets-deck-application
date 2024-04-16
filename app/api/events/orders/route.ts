import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    // Get the ticket's order Id from the search params
    const specifiedTicketOrderId = searchParams.get("ticketOrderId");

    // If a specified ticket order Id is provided, fetch the event with that id
    if (specifiedTicketOrderId) {
      // Find the ticket order with the specified ID
      const ticketOrder = await prisma.ticketOrders.findFirst({
        where: {
          id: specifiedTicketOrderId,
        },
        include: {
          event: {
            include: {
                user: true
            }
          }
        },
      });

      // Fetch every ordered tickets for the ticket order using it's orderId
      const orderedTickets = await prisma.orderedTickets.findMany({
        where: {
            orderId: ticketOrder?.orderId
        },
        include: {
          ticket: true,
        },
      });

      // If the ticket order is not found, return 404
      if (!ticketOrder) {
        return NextResponse.json(
          { error: "Ticket order with specified ID not found" },
          { status: 404 }
        );
      }

      // Create the ticket order data object
      const ticketOrderData = {
        ...ticketOrder,
        orderedTickets: orderedTickets
      }

      // If the ticket order is found, return the ticket order
      return NextResponse.json({ data: ticketOrderData }, { status: 200 });
    }

    // Else, return an error
    return NextResponse.json(
      { error: "Ticket order ID not provided" },
      { status: 400 }
    );
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
