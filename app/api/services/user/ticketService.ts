import { ApplicationError } from "@/app/constants/applicationError";
import { OrderStatus } from "@/app/enums/IOrderStatus";
import { TicketCategory } from "@/app/enums/ITicket";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function fetchUserTickets(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const specifiedUserId = searchParams.get("userId");

  // Get the category from the search params
  const category = searchParams.get("category");

  // If no specified user's Id is not provided, return 400
  if (!specifiedUserId) {
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If no category is provided, return 400
  if (!category) {
    return {
      error: ApplicationError.TicketCategoryIsRequired.Text,
      errorCode: ApplicationError.TicketCategoryIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

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
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.BadRequest,
    };
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
        ticket: {
          include: {
            event: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Return all ordered tickets of the user
    return { data: orderedTickets };
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

    // Extract all ticket IDs from the fetched events
    const eventTicketIds = events.flatMap((event) =>
      event.tickets.map((ticket) => ticket.id)
    );

    // Fetch all sold tickets and their corresponding tickets with events in a single query
    const soldTicketsWithEvent = await prisma.orderedTickets.findMany({
      where: {
        ticketId: {
          in: eventTicketIds,
        },
        orderStatus: {
          equals: OrderStatus.Confirmed,
        },
      },
      include: {
        ticket: {
          include: {
            event: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Return all sold tickets of the user
    return { data: soldTicketsWithEvent };
  }

  // If we reach here, it means the category provided is invalid i.e it is neither "bought" nor "sold"
  return {
    error: ApplicationError.InvalidTicketCategory.Text,
    errorCode: ApplicationError.InvalidTicketCategory.Code,
    statusCode: StatusCodes.BadRequest,
  };
}

export async function fetchTicketsSoldForEvent(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the eventId from the search params
  const specifiedEventId = searchParams.get("eventId");

  // If no specified event's Id is not provided, return 400
  if (!specifiedEventId) {
    return {
      error: ApplicationError.EventIdIsRequired.Text,
      errorCode: ApplicationError.EventIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Find the event with the specified event ID
  const event = await prisma.events.findFirst({
    where: {
      OR: [
        {
          id: specifiedEventId,
        },
        {
          eventId: specifiedEventId,
        },
      ],
    },
    include: {
      tickets: {
        select: {
          id: true,
        },
      },
    },
  });

  // if event is not found, return 404
  if (!event) {
    return {
      error: ApplicationError.EventWithIdNotFound.Text,
      errorCode: ApplicationError.EventWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Get all ticket IDs for the event
  const eventTicketIds = event.tickets.map((ticket) => ticket.id);

  // Fetch all sold tickets under the event with that eventId
  const soldTickets = await prisma.orderedTickets.findMany({
    where: {
      ticketId: {
        in: eventTicketIds,
      },
      orderStatus: {
        equals: OrderStatus.Confirmed,
      },
    },
    include: {
      ticket: {
        select: {
          name: true,
          price: true,
          event: {
            select: {
              title: true,
            },
          },
        }, 
      },
      order: {
        select: {
            contactEmail: true,
            contactFirstName: true,
            contactLastName: true,
            contactNumber: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Return all sold tickets for the event
  return { data: soldTickets };
}
