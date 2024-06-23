import { EventRequest } from "@/app/models/IEvents";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { deserializeEventVisibility } from "@/app/constants/serializer";
import { validateRequestMethod } from "../services/reusable-services/requestMethodValidator";
import {
  createEvent,
  deleteEvent,
  fetchEvents,
  updateEvent,
} from "../services/event/eventService";
import { customNextResponseError } from "../utils/customNextResponseError";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";

export async function POST(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "POST");

  try {
    // Call the function to create a new event
    const operation = await createEvent(req);

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch(error) {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.InternalServerError.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

export async function GET(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "GET");

  try {
    // Call the function to fetch events
    const operation = await fetchEvents(req);

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, {
      status: StatusCodes.Success,
    });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.InternalServerError.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

export async function PUT(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "PUT");

  try {
    // Call the function to update an event
    const operation = await updateEvent(req);

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.InternalServerError.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

export async function DELETE(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "DELETE");

  try {
    // Call the function to delete an event
    const operation = await deleteEvent(req);

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation, { status: StatusCodes.Success });
  } catch(error) {
    // console.log("🚀 ~ DELETE ~ error:", error)
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.InternalServerError.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
