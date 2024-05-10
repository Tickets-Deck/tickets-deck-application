import { TicketRequest, TicketResponse } from "@/app/models/ITicket";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    // Get the eventId from the search params
    const specifiedEventId = searchParams.get("eventId");

    // If a specifiedEventId is provided, fetch all tickets under the event with that eventId
    if (specifiedEventId) {
      const event = await prisma.events.findFirst({
        where: {
          eventId: specifiedEventId,
        },
        include: {
          tickets: true,
        },
      });

      // If event is not found, return 404
      if (!event) {
        return NextResponse.json(
          { error: "Event with specified Event ID not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(event, { status: 200 });
    }
  }
}

export async function PUT(req: NextRequest) {
  if (req.method === "PUT") {
    // Get the body from the request
    const request = (await req.json()) as TicketResponse;

    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    // Get the eventId from the search params
    // const specifiedEventId = searchParams.get("eventId");

    // Get the ticketId from the search params
    const specifiedTicketId = searchParams.get("ticketId");

    // If a specifiedTicketId is provided, fetch the ticket with that ticketId
    if (specifiedTicketId) {
      const existingTicket = await prisma.tickets.findUnique({
        where: {
          id: specifiedTicketId,
        },
      });

      if (!existingTicket) {
        return NextResponse.json(
          { error: "Ticket with specified Ticket ID not found" },
          { status: 404 }
        );
      };

    //   console.log("Request gotten: ", request);
    //   console.log("test pr: ", request.price || existingTicket.price);

      const ticket = await prisma.tickets.update({
        where: {
          id: specifiedTicketId,
        },
        data: {
          // ...request
          name: request.name || existingTicket.name,
          price: request.price || existingTicket.price,
          numberOfUsers: request.numberOfUsers || existingTicket.numberOfUsers,
          quantity: request.quantity || existingTicket.quantity,
          remainingTickets:
            request.remainingTickets || existingTicket.remainingTickets,
          description: request.description || existingTicket.description,
        },
      });

      return NextResponse.json(ticket, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Ticket ID not provided" },
        { status: 400 }
      );
    }
  }
}
