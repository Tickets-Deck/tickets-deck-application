import { EventRequest } from "@/app/models/IEvents";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const request = (await req.json()) as EventRequest;

    try {
      const { eventId } = request;

      // If eventId is not provided, return 400
      if (!eventId) {
        return NextResponse.json(
          { error: "Event Id is required" },
          { status: 400 }
        );
      }

      // Check if publisherId is provided
      if (!request.publisherId) {
        return NextResponse.json(
          { error: "Publisher Id is required" },
          { status: 400 }
        );
      }

      // Check if a user with the publisherId exists
      const userExists = await prisma.users.findFirst({
        where: {
          id: request.publisherId,
        },
      });

      // If user does not exist, return 400
      if (!userExists) {
        return NextResponse.json(
          { error: "User with specified ID not found" },
          { status: 400 }
        );
      }

      // Check if ticket already exists
      const eventExists = await prisma.events.findFirst({
        where: {
          eventId,
        },
      });

      // If email already exists, return 400
      if (eventExists) {
        return NextResponse.json(
          { error: "Event already exists" },
          { status: 400 }
        );
      }

      // If eventId is valid, save it to the database
      const event = await prisma.events.create({
        data: {
          eventId: request.eventId,
          publisherId: request.publisherId,
          title: request.title,
          description: request.description,
          // location: null,
          venue: request.venue,
          date: request.date,
          time: request.time,
          category: request.category,
          tags: {
            create: request.tags.map((tagName) => ({
              tag: {
                create: { name: tagName },
              },
            })),
          },
          visibility: request.visibility,
          mainImageUrl: request.mainImageUrl,
          currency: request.currency,
          tickets: {
            createMany: {
              data: request.tickets,
            },
          },
          purchaseStartDate: request.purchaseStartDate,
          purchaseEndDate: request.purchaseEndDate,
        },
      });

      // Return the event
      return NextResponse.json(event, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    // Get the id from the search params
    const specifiedId = searchParams.get("id");

    // Get the eventId from the search params
    const specifiedEventId = searchParams.get("eventId");

    // If a specifiedId is provided, fetch the event with that id
    if (specifiedId) {
      const event = await prisma.events.findFirst({
        where: {
          id: specifiedId,
        },
        include: {
          user: true,
          tickets: true,
          images: true,
          tags: {
            select: { tag: { select: { name: true } } },
          },
          location: true,
        },
      });

      // If event is not found, return 404
      if (!event) {
        return NextResponse.json(
          { error: "Event with specified ID not found" },
          { status: 404 }
        );
      }

      // Extract tag names from the result
    //   const tagNames = event.tags.map((tag) => tag.tag.name);
      const tagNames: string[] = event.tags.map((tag: { tag: { name: string } }) => tag.tag.name);


      const eventResponse = {
        ...event,
        tags: tagNames,
      };

      // If event is found, return it
      if (eventResponse) {
        return NextResponse.json(eventResponse, { status: 200 });
      }

      // If event is not found, return 404
      return NextResponse.json(
        { error: "Event with specified ID not found" },
        { status: 404 }
      );
    }

    // If a specifiedEventId is provided, fetch the event with that eventId
    if (specifiedEventId) {
      const event = await prisma.events.findFirst({
        where: {
          eventId: specifiedEventId,
        },
        include: {
          user: true,
          tickets: true,
          images: true,
          tags: {
            select: { tag: { select: { name: true } } },
          },
          location: true,
        },
      });

      // If event is not found, return 404
      if (!event) {
        return NextResponse.json(
          { error: "Event with specified Event ID not found" },
          { status: 404 }
        );
      }

      // Extract tag names from the result
    //   const tagNames = event.tags.map((tag) => tag.tag.name);
      const tagNames: string[] = event.tags.map((tag: { tag: { name: string } }) => tag.tag.name);


      const eventResponse = {
        ...event,
        tags: tagNames ?? [],
      };

      // If event is found, return it
      if (eventResponse) {
        return NextResponse.json(eventResponse, { status: 200 });
      }

      // If event is not found, return 404
      return NextResponse.json(
        { error: "Event with specified Event ID not found" },
        { status: 404 }
      );
    }

    // Fetch all events
    const events = await prisma.events.findMany();

    // Return all events
    return NextResponse.json(events);
  }
}
