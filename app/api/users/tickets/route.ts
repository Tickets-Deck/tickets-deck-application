import { TicketCategory } from "@/app/enums/ITicket";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    // Get the userId from the search params
    const specifiedUserId = searchParams.get("userId");

    // Get the category from the search params
    const category = searchParams.get("category");

    // If a specified user's Id is provided, fetch all tickets the user with that user's Id has bought
    if (specifiedUserId) {
      // Fetch the user with the specified user ID
      const user = await prisma.users.findFirst({
        where: {
          id: specifiedUserId,
        },
        include: {
          ticketOrders: true,
        },
      });

      // If user is not found, return 404
      if (!user) {
        return NextResponse.json(
          { error: "User with specified User ID not found" },
          { status: 404 }
        );
      }

      // If the category provided is "bought"
      if (category === TicketCategory.Bought) {
        // If user is found, get all the ordered tickets of the user using the order id of each ticket order
        const orderedTickets = await prisma.orderedTickets.findMany({
          where: {
            orderId: {
              in: user.ticketOrders.map((ticketOrder) => ticketOrder.orderId),
            },
          },
          include: {
            ticket: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        let orderedTicketsWithEvent = [];

        // Fetch the information for the ticket of each ordered ticket
        for (let i = 0; i < orderedTickets.length; i++) {
          const ticket = await prisma.tickets.findFirst({
            where: {
              id: orderedTickets[i].ticketId,
            },
            include: {
              event: true,
            },
          });

          // Replace the ticket object with the ticket information
          orderedTicketsWithEvent.push({
            ...orderedTickets[i],
            ticket: ticket,
          });
        }

        // Return all ordered tickets of the user
        return NextResponse.json(orderedTicketsWithEvent);
      }

      // If the category provided is "sold"
      if (category === TicketCategory.Sold) {
        // Fetch all events of the user
        const events = await prisma.events.findMany({
          where: {
            publisherId: specifiedUserId,
          },
          include: {
            tickets: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        // Fetch all ordered tickets of every ticket order of each event of the user
        const soldTickets = await prisma.orderedTickets.findMany({
          where: {
            ticket: {
              eventId: {
                in: events.map((event) => event.id),
              },
            },
          },
        });

        let soldTicketsWithEvent = [];

        // Fetch the information for the ticket of each ordered ticket
        for (let i = 0; i < soldTickets.length; i++) {
          const ticket = await prisma.tickets.findFirst({
            where: {
              id: soldTickets[i].ticketId,
            },
            include: {
              event: true,
            },
          });

          // Replace the ticket object with the ticket information
          soldTicketsWithEvent.push({
            ...soldTickets[i],
            ticket: ticket,
          });
        }

        // Return all sold tickets of the user
        return NextResponse.json(soldTicketsWithEvent);
      }
    }
  }
}
