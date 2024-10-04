import { ApplicationError } from "@/app/constants/applicationError";
import { OrderStatus } from "@/app/enums/IOrderStatus";
import { TicketCategory } from "@/app/enums/ITicket";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { TicketRequest, TicketResponse } from "@/app/models/ITicket";
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
        tickets: true
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

export async function fetchEventTickets(req: NextRequest) {
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

  // Fetch all tickets under the event with that eventId
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
    return {
      error: ApplicationError.EventWithIdNotFound.Text,
      errorCode: ApplicationError.EventWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  return { data: event };
}

export async function updateTicket(req: NextRequest) {
  // Get the body from the request
  const request = (await req.json()) as TicketResponse;

  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the eventId from the search params
  // const specifiedEventId = searchParams.get("eventId");

  // Get the ticketId from the search params
  const specifiedTicketId = searchParams.get("ticketId");

  // If no specified ticket's Id is not provided, return 400
  if (!specifiedTicketId) {
    return {
      error: ApplicationError.TicketIdIsRequired.Text,
      errorCode: ApplicationError.TicketIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Fetch the ticket with that ticketId
  const existingTicket = await prisma.tickets.findUnique({
    where: {
      id: specifiedTicketId,
    },
  });

  if (!existingTicket) {
    return {
      error: ApplicationError.TicketWithIdNotFound.Text,
      errorCode: ApplicationError.TicketWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  const ticket = await prisma.tickets.update({
    where: {
      id: specifiedTicketId,
    },
    data: {
      name: request.name || existingTicket.name,
      price: request.price || existingTicket.price,
      numberOfUsers: request.numberOfUsers || existingTicket.numberOfUsers,
      quantity: request.quantity || existingTicket.quantity,
      remainingTickets: request.quantity == 0 ? 0 : request.quantity || existingTicket.remainingTickets,
      description: request.description || existingTicket.description,
      visibility: request.visibility == null ? existingTicket.visibility : request.visibility
    },
  });

  return { data: ticket };
}

export async function createTicket(req: NextRequest) {
  // Get the body from the request
  const request = (await req.json()) as TicketRequest;

  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the eventId from the search params
  const specifiedEventId = searchParams.get("id");

  // If specifiedEventId is not provided, return 400
  if (!specifiedEventId) {
    return {
      error: ApplicationError.EventIdIsRequired.Text,
      errorCode: ApplicationError.EventIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If a specifiedEventId is provided, create a ticket under the event with that eventId
  const event = await prisma.events.findUnique({
    where: {
      id: specifiedEventId,
    },
  });

  // If event is not found, return 404
  if (!event) {
    return {
      error: ApplicationError.EventWithIdNotFound.Text,
      errorCode: ApplicationError.EventWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Update the tickets for the event
  await prisma.events.update({
    where: {
      id: specifiedEventId,
    },
    data: {
      tickets: {
        create: {
          name: request.name,
          price: request.price,
          numberOfUsers: request.numberOfUsers,
          quantity: request.quantity,
          remainingTickets: request.quantity,
          description: request.description,
        },
      },
    },
  });

  //   const ticket = await prisma.tickets.create({
  //     data: {
  //       eventId: specifiedEventId,
  //       name: request.name,
  //       price: request.price,
  //       numberOfUsers: request.numberOfUsers,
  //       quantity: request.quantity,
  //       remainingTickets: request.remainingTickets,
  //       description: request.description,
  //     },
  //   });

  return { message: "Ticket created successfully" };
}

export async function deleteTicket(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the ticket Id from the search params
  const specifiedTicketId = searchParams.get("ticketId");

  // If specified ticket Id is not provided, return an error
  if (!specifiedTicketId) {
    return {
      error: ApplicationError.TicketIdIsRequired.Text,
      errorCode: ApplicationError.TicketIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Find existing ticket with specified ticket ID
  const existingTicket = await prisma.tickets.findUnique({
    where: {
      id: specifiedTicketId,
    },
  });

  // If ticket does not exist, show error
  if (!existingTicket) {
    return {
      error: ApplicationError.TicketWithIdNotFound.Text,
      errorCode: ApplicationError.TicketWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Delete the ticket
  await prisma.tickets.delete({
    where: {
      id: specifiedTicketId,
    },
  });

  return { message: "Ticket deleted successfully" };
}
