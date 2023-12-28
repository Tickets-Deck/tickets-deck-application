import { EventRequest } from "@/app/models/IEvents";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const request = (await req.json()) as EventRequest;

    console.log("request", request);

    try {
      const { eventId } = request;

      // If eventId is not provided, return 400
      if (!eventId) {
        return {
          status: 400,
          json: { error: "Event Id is required" },
        };
      }

      // Check if ticket already exists
      const eventExists = await prisma.events.findFirst({
        where: {
          eventId,
        },
      });

      // If email already exists, return 400
      if (eventExists) {
        return {
          status: 400,
          json: { error: "Event already exists" },
        };
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
          // tags: request.tags,
          visibility: request.visibility,
          mainImageUrl: request.mainImageUrl,
          currency: request.currency,
          // tickets: request.tickets,
          purchaseStartDate: request.purchaseStartDate,
          purchaseEndDate: request.purchaseEndDate,
        },
      });

      return {
        status: 201,
        json: event,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        json: { error: "Something went wrong" },
      };
    }
  }
}
