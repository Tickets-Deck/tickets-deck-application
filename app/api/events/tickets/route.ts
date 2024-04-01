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
