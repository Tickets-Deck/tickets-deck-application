import { EventRequest } from "@/app/models/IEvents";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const request = (await req.json()) as EventRequest;

    // Initialize the uploaded image id
    let uploadedImageId: string = "";

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

      // Check if event already exists
      const eventExists = await prisma.events.findFirst({
        where: {
          eventId,
        },
      });

      // If event already exists, return 400
      if (eventExists) {
        return NextResponse.json(
          { error: "Event already exists" },
          { status: 400 }
        );
      }

      // Get the image base64 url from the request
      const _imagebase64Url = request.mainImageUrl;

      // Compose the upload string
      var uploadStr = "data:image/jpeg;base64," + _imagebase64Url;

      // Upload the image to cloudinary
      const cloudinaryRes = await cloudinary.v2.uploader.upload(uploadStr, {
        folder: "event_images",
        filename_override: `${eventId}`,
        // use_filename: true,
      });

      // Update the uploaded image id with the cloudinary response
      uploadedImageId = cloudinaryRes.public_id;

      // Declare the tickets array
      const tickets = request.tickets;

      // Update the tickets array so the remainingTickets is equal to the quantity
      const updatedTickets = tickets.map((ticket) => ({
        ...ticket,
        remainingTickets: ticket.quantity,
      }));

      // Create the event
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
          // Create tags if they are available in the request
          //   tags: {
          //     create: request.tags
          //       ? request.tags.map((tag) => ({
          //           tag: {
          //             create: { name: tag },
          //           },
          //         }))
          //       : [],
          //   },
          tags: {
            // Create tags as though they are available in the request
            create: request.tags.map((tagName) => ({
              tag: {
                create: { name: tagName },
              },
            })),
          },
          visibility: request.visibility,
          mainImageUrl: cloudinaryRes.secure_url,
          mainImageId: cloudinaryRes.public_id,
          currency: request.currency,
          tickets: {
            createMany: {
              data: updatedTickets,
            },
          },
          purchaseStartDate: request.purchaseStartDate,
          purchaseEndDate: request.purchaseEndDate,
        },
      });

      // Increment the number of events created by the user
      await prisma.users.update({
        where: {
          id: request.publisherId,
        },
        data: {
          eventsCount: {
            increment: 1,
          },
        },
      });

      // Return the event
      return NextResponse.json(event, { status: 200 });
    } catch (error) {
      // If the image was uploaded to cloudinary...
      if (uploadedImageId) {
        // Delete the event's main image from cloudinary
        await cloudinary.v2.uploader.destroy(uploadedImageId);
      }

      // console.error(error);

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

    // Get the publisherId from the search params
    const specifiedPublisherId = searchParams.get("publisherId");

    // Get the tags from the search params
    const specifiedTags = searchParams.get("tags");

    // If a specifiedId is provided, fetch the event with that id
    if (specifiedId) {
      const event = await prisma.events.findFirst({
        where: {
          id: specifiedId,
        },
        include: {
          user: true,
          tickets: {
            orderBy: {
              price: "asc",
            },
          },
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
      const tagNames: string[] = event.tags.map(
        (tag: { tag: { name: string } }) => tag.tag.name
      );

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
          tickets: {
            orderBy: {
              price: "asc",
            },
          },
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
      const tagNames: string[] = event.tags.map(
        (tag: { tag: { name: string } }) => tag.tag.name
      );

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

    // If a specifiedPublisherId is provided, fetch the event with that publisherId
    if (specifiedPublisherId) {
      const events = await prisma.events.findMany({
        where: {
          publisherId: specifiedPublisherId,
        },
      });

      // If event is not found, return 404
    //   if (!events || events.length === 0) {
    //     return NextResponse.json(
    //       { error: "This user does not have any events created yet." },
    //       { status: 404 }
    //     );
    //   }

      return NextResponse.json(events, { status: 200 });
      // If event is found, return it
    //   if (events) {
    //   }

    //   // If event is not found, return 404
    //   return NextResponse.json(
    //     { error: "This user does not have any events created yet." },
    //     { status: 404 }
    //   );
    }

    // If specifiedTags and eventId are provided, fetch the events with those tags, excluding the private ones, those that are over, and the specified event
    if (specifiedTags) {
        
      if (!specifiedEventId) {
        return NextResponse.json(
          { error: "Event ID is required" },
          { status: 400 }
        );
      }

      const tags = specifiedTags.split(",");

      const events = await prisma.events.findMany({
        where: {
          tags: {
            some: {
              tag: {
                name: {
                  in: tags,
                },
              },
            },
          },
          AND: {
            visibility: "PUBLIC",
            date: {
              gte: new Date(),
            },
            purchaseEndDate: {
              gte: new Date(),
            },
            eventId: {
              not: specifiedEventId,
            },
          },
        },
      });
      

      // If event is not found, return 404
      if (!events || events.length === 0) {
        return NextResponse.json(
          { error: "No events found with specified tags" },
          { status: 404 }
        );
      }

      // If we just have one event, return it as an array
      if (events.length === 1) {
        return NextResponse.json([events[0]], { status: 200 });
      }

      // If we have mulitple similar events, return them
        if (events) {
            return NextResponse.json(events, { status: 200 });
        }
    }

    // Else, Fetch all events
    const events = await prisma.events.findMany({
      // Show only public events that are not yet over (both event date and end date for tickets purchase)
      where: {
        visibility: "PUBLIC",
        OR: [
          {
            date: {
              gte: new Date(),
            },
          },
          {
            purchaseEndDate: {
              gte: new Date(),
            },
          },
        ],
      },
      orderBy: {
        date: "asc",
      },
    });

    // Return all events
    return NextResponse.json(events);
  }
}

export async function DELETE(req: NextRequest) {
  if (req.method === "DELETE") {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    // Get the id from the search params
    const specifiedId = searchParams.get("id");

    // If a specifiedId is provided, find the event with that id
    if (specifiedId) {
      const event = await prisma.events.findFirst({
        where: {
          id: specifiedId,
        },
      });

      //   console.log("Event gotten from db", event);

      // If event is not found, return 404
      if (!event) {
        return NextResponse.json(
          { error: "Event with specified ID not found" },
          { status: 404 }
        );
      }

      // If event is found, delete it
      if (event) {
        // Delete the event's main image from cloudinary
        await cloudinary.v2.uploader.destroy(event.mainImageId);

        await prisma.events.delete({
          where: {
            id: specifiedId,
          },
        });

        // Decrement the number of events created by the user
        await prisma.users.update({
          where: {
            id: event.publisherId,
          },
          data: {
            eventsCount: {
              decrement: 1,
            },
          },
        });

        // Return success message
        return NextResponse.json(
          { message: "Event deleted successfully" },
          { status: 200 }
        );
      }

      // If event is not found, return 404
      return NextResponse.json(
        { error: "Event with specified ID not found" },
        { status: 404 }
      );
    }

    // Else, return 400
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

  // Else, return 400
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
