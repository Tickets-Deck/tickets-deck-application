import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../../services/api-services/requestMethodValidator";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import {
  createTicket,
  deleteTicket,
  fetchEventTickets,
  updateTicket,
} from "../../services/ticket/ticketService";
import { customNextResponseError } from "../../utils/customNextResponseError";

export async function GET(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "GET");

  try {
    // Call the function to fetch all tickets for an event
    const operation = await fetchEventTickets(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToSubscribeToNewsletter.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

export async function PUT(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "PUT");

  try {
    // Call the function to update a ticket
    const operation = await updateTicket(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToSubscribeToNewsletter.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

export async function POST(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "POST");

  try {
    // Call the function to create a ticket
    const operation = await createTicket(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation, { status: StatusCodes.Created });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToSubscribeToNewsletter.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

export async function DELETE(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "DELETE");

  try {
    // Call the function to delete a ticket
    const operation = await deleteTicket(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation, { status: StatusCodes.Success });
  } catch(error) {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.InternalServerError.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}