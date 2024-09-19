import { ApplicationError } from "@/app/constants/applicationError";
import { EventFavoriteAction, EventRequest } from "@/app/models/IEvents";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import cloudinary from "cloudinary";
import { deserializeEventVisibility } from "@/app/constants/serializer";
import { EventVisibility } from "@/app/enums/IEventVisibility";

export async function createEvent(req: NextRequest) {
  // Get the request body
  const request = (await req.json()) as EventRequest;

  // Initialize the uploaded image id
  let uploadedImageId: string = "";

  try {
    const { eventId } = request;

    // If eventId is not provided, return 400
    if (!eventId) {
      return {
        error: ApplicationError.UserEmailIsRequired.Text,
        errorCode: ApplicationError.UserEmailIsRequired.Code,
        statusCode: StatusCodes.BadRequest,
      };
    }

    // Check if publisherId is provided
    if (!request.publisherId) {
      return {
        error: ApplicationError.EventPublisherIdIsRequired.Text,
        errorCode: ApplicationError.EventPublisherIdIsRequired.Code,
        statusCode: StatusCodes.BadRequest,
      };
    }

    // Check if a user with the publisherId exists
    const userExists = await prisma.users.findFirst({
      where: {
        id: request.publisherId,
      },
    });

    // If user does not exist, return 404
    if (!userExists) {
      return {
        error: ApplicationError.UserWithIdNotFound.Text,
        errorCode: ApplicationError.UserWithIdNotFound.Code,
        statusCode: StatusCodes.NotFound,
      };
    }

    // Check if event already exists
    const eventExists = await prisma.events.findFirst({
      where: {
        eventId,
      },
    });

    // If event already exists, return 400
    if (eventExists) {
      return {
        error: ApplicationError.EventWithIdAlreadyExists.Text,
        errorCode: ApplicationError.EventWithIdAlreadyExists.Code,
        statusCode: StatusCodes.BadRequest,
      };
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
        purchaseStartDate: request.purchaseStartDate ?? new Date(),
        purchaseEndDate: request.purchaseEndDate ?? request.date,
      },
      include: {
        user: true,
        tickets: true,
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
    return { data: event };
  } catch (error) {
    // If the image was uploaded to cloudinary...
    if (uploadedImageId) {
      // Delete the event's main image from cloudinary
      await cloudinary.v2.uploader.destroy(uploadedImageId);
    }

    return {
      error: ApplicationError.InternalServerError.Text,
      errorCode: ApplicationError.InternalServerError.Code,
      statusCode: StatusCodes.InternalServerError,
    };
  }
}

export async function fetchEvents(req: NextRequest) {
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
      return {
        error: ApplicationError.EventWithIdNotFound.Text,
        errorCode: ApplicationError.EventWithIdNotFound.Code,
        statusCode: StatusCodes.NotFound,
      };
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

    // If event is not found, return 404
    if (!eventResponse) {
      return {
        error: ApplicationError.EventWithIdNotFound.Text,
        errorCode: ApplicationError.EventWithIdNotFound.Code,
        statusCode: StatusCodes.NotFound,
      };
    }

    // If event is found, return it
    return { data: eventResponse };
  }

  // If a specifiedEventId is provided, and no tags, fetch the event with that eventId
  if (specifiedEventId && !specifiedTags) {
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
      return {
        error: ApplicationError.EventWithIdNotFound.Text,
        errorCode: ApplicationError.EventWithIdNotFound.Code,
        statusCode: StatusCodes.NotFound,
      };
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

    // If event is not found, return 404
    if (!eventResponse) {
      return {
        error: ApplicationError.EventWithIdNotFound.Text,
        errorCode: ApplicationError.EventWithIdNotFound.Code,
        statusCode: StatusCodes.NotFound,
      };
    }

    // If event is found, return it
    return { data: eventResponse };
  }

  // If a specifiedPublisherId is provided, fetch the event with that publisherId
  if (specifiedPublisherId) {
    const eventResponse = await prisma.events.findMany({
      where: {
        publisherId: specifiedPublisherId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // If event is not found, return 404
    if (!eventResponse) {
      return {
        error: ApplicationError.EventWithIdNotFound.Text,
        errorCode: ApplicationError.EventWithIdNotFound.Code,
        statusCode: StatusCodes.NotFound,
      };
    }

    // If event is found, return it
    return { data: eventResponse };
  }

  // If specifiedTags and eventId are provided, fetch the events with those tags, excluding the private ones, those that are over, and the specified event
  if (specifiedTags) {
    if (!specifiedEventId) {
      return {
        error: ApplicationError.EventIdIsRequired.Text,
        errorCode: ApplicationError.EventIdIsRequired.Code,
        statusCode: StatusCodes.BadRequest,
      };
    }

    const tags = specifiedTags.split(",");
    console.log("🚀 ~ fetchEvents ~ tags:", tags);

    const eventResponse = await prisma.events.findMany({
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
    if (!eventResponse || eventResponse.length === 0) {
      return {
        error: ApplicationError.NoEventWithSpecifiedTagsFound.Text,
        errorCode: ApplicationError.NoEventWithSpecifiedTagsFound.Code,
        statusCode: StatusCodes.NotFound,
      };
    }

    // Return response
    if (eventResponse) {
      return { data: eventResponse };
    }
  }

  // Else, Fetch all events
  const eventResponse = await prisma.events.findMany({
    // Show only public events that are not yet over (both event date and end date for tickets purchase)
    where: {
      visibility: "PUBLIC",
    //   OR: [
    //     {
    //       date: {
    //         gte: new Date(),
    //       },
    //     },
    //     {
    //       purchaseEndDate: {
    //         gte: new Date(),
    //       },
    //     },
    //   ],
    },
    orderBy: {
      date: "asc",
    },
  });

  // Return all events
  return { data: eventResponse };
}

export async function updateEvent(req: NextRequest) {
  const request = (await req.json()) as EventRequest;

  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the eventId from the search params
  const specifiedEventId = searchParams.get("id");

  // Initialize the uploaded image id
  let uploadedImageId: string = "";

  // Initialize the cloudinary response
  let cloudinaryRes: cloudinary.UploadApiResponse | null = null;

  if (!specifiedEventId) {
    return {
      error: ApplicationError.EventIdIsRequired.Text,
      errorCode: ApplicationError.EventIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  try {
    const { eventId } = request;

    // If eventId is not provided, return 400
    if (!eventId) {
      return {
        error: ApplicationError.EventEventIdIsRequired.Text,
        errorCode: ApplicationError.EventEventIdIsRequired.Code,
        statusCode: StatusCodes.BadRequest,
      };
    }

    // Check if publisherId is provided
    if (!request.publisherId) {
      return {
        error: ApplicationError.EventPublisherIdIsRequired.Text,
        errorCode: ApplicationError.EventPublisherIdIsRequired.Code,
        statusCode: StatusCodes.BadRequest,
      };
    }

    // Check if a user with the publisherId exists
    const userExists = await prisma.users.findFirst({
      where: {
        id: request.publisherId,
      },
    });

    // If user does not exist, return 404
    if (!userExists) {
      return {
        error: ApplicationError.UserWithIdNotFound.Text,
        errorCode: ApplicationError.UserWithIdNotFound.Code,
        statusCode: StatusCodes.NotFound,
      };
    }

    // Get existing event
    const existingEvent = await prisma.events.findUnique({
      where: {
        id: specifiedEventId,
      },
      // include: {
      //   tags: {
      //     select: { tag: { select: { name: true } } },
      //   },
      // },
    });

    // If event is not found, return 404
    if (!existingEvent) {
      return {
        error: ApplicationError.EventWithIdNotFound.Text,
        errorCode: ApplicationError.EventWithIdNotFound.Code,
        statusCode: StatusCodes.NotFound,
      };
    }

    // If we have a new image, upload it to cloudinary, and delete the existing image
    if (request.mainImageUrl) {
      // Get the image base64 url from the request
      const _imagebase64Url = request.mainImageUrl;

      // Compose the upload string
      var uploadStr = "data:image/jpeg;base64," + _imagebase64Url;

      // Upload the image to cloudinary
      cloudinaryRes = await cloudinary.v2.uploader.upload(uploadStr, {
        folder: "event_images",
        filename_override: `${eventId}_modified`,
        // use_filename: true,
      });

      // console.log("We got to uploaded image: ", cloudinaryRes)

      // Update the uploaded image id with the cloudinary response
      uploadedImageId = cloudinaryRes.public_id;

      // Delete the old event's main image from cloudinary
      await cloudinary.v2.uploader.destroy(existingEvent.mainImageId);
    }

    // Delete the existing tags
    //   await prisma.tags.deleteMany({
    //     where: {
    //       id: specifiedEventId,
    //     },
    //   });

    // Update the event
    const updatedEvent = await prisma.events.update({
      where: {
        id: existingEvent.id,
      },
      data: {
        title: request.title ?? existingEvent.title,
        description: request.description ?? existingEvent.description,
        venue: request.venue ?? existingEvent.venue,
        date: request.date ?? existingEvent.date,
        time: request.time ?? existingEvent.time,
        mainImageUrl: cloudinaryRes?.secure_url ?? existingEvent.mainImageUrl,
        mainImageId: cloudinaryRes?.public_id ?? existingEvent.mainImageId,
        category: request.category ?? existingEvent.category,
        //   tags:
        //     request.tags && request.tags.length > 0
        //       ? {
        //           create: request.tags.map((tagName) => ({
        //             tag: {
        //               create: { name: tagName },
        //             },
        //           })),
        //         }
        //       : {
        //           create: existingEvent.tags.map((tagName) => ({
        //             tag: {
        //               create: { name: tagName.tag.name },
        //             },
        //           })),
        //         },
        visibility:
          deserializeEventVisibility(request.visibility) ??
          existingEvent.visibility,
        //   purchaseStartDate: request.purchaseStartDate,
        //   purchaseEndDate: request.purchaseEndDate,
      },
    });

    // Return the event
    return { data: updatedEvent };
  } catch (error) {
    // If the image was uploaded to cloudinary...
    if (uploadedImageId) {
      // Delete the event's main image from cloudinary
      await cloudinary.v2.uploader.destroy(uploadedImageId);
    }

    return {
      error: ApplicationError.InternalServerError.Text,
      errorCode: ApplicationError.InternalServerError.Code,
      statusCode: StatusCodes.InternalServerError,
    };
  }
}

export async function deleteEvent(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the id from the search params
  const specifiedId = searchParams.get("id");

  // If specifiedId is not provided, return 400
  if (!specifiedId) {
    return {
      error: ApplicationError.EventIdIsRequired.Text,
      errorCode: ApplicationError.EventIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Find the event with that id
  const event = await prisma.events.findFirst({
    where: {
      id: specifiedId,
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

  // Delete the event's main image from cloudinary
  await cloudinary.v2.uploader.destroy(event.mainImageId);

  // Delete all relating tickets
  await prisma.tickets.deleteMany({
    where: {
      eventId: specifiedId,
    },
  });

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
  return { message: "Event deleted successfully" };
}

export async function likeEvent(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // Get the eventId from the search params
  const eventId = searchParams.get("eventId");

  // Get the action from the search params
  const action = searchParams.get("action");

  // If a userId is not provided, return 400
  if (!userId) {
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If an eventId is not provided, return 400
  if (!eventId) {
    return {
      error: ApplicationError.EventIdIsRequired.Text,
      errorCode: ApplicationError.EventIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Find the user with the provided userId
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  // If user is not found, return 404
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Find the event with the provided eventId
  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
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

  // If the action is unlike, delete the user's like on the event
  if (action === EventFavoriteAction.Unlike) {
    // Check the database for the like status of the event by the user
    const likedEvent = await prisma.favorites.findFirst({
      where: {
        userId: user.id,
        eventId: event.id,
      },
    });

    // Delete the user's like on the event
    await prisma.favorites.delete({
      where: {
        id: likedEvent?.id,
      },
    });

    // Return success message
    return { message: "Event unliked successfully" };
  }

  // Else, like the event

  // Update the user's liked events ~ favourites
  await prisma.favorites.create({
    data: {
      userId: user.id,
      eventId: event.id,
    },
  });

  // Return success message
  return { message: "Event liked successfully" };
}

export async function fetchEventLikeStatus(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // Get the eventId from the search params
  const eventId = searchParams.get("eventId");

  // If a userId is not provided, return 400
  if (!userId) {
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If an eventId is not provided, return 400
  if (!eventId) {
    return {
      error: ApplicationError.EventIdIsRequired.Text,
      errorCode: ApplicationError.EventIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Find the user with the provided userId
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  // If user is not found, return 404
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Find the event with the provided eventId
  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
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

  // Check the database for the like status of the event by the user
  const likedEvent = await prisma.favorites.findFirst({
    where: {
      userId: user.id,
      eventId: event.id,
    },
  });

  const userLikedEvent = likedEvent ? true : false;

  // Return the like status
  return { data: { userLikedEvent } };
}

export async function fetchFavouriteEvents(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // If a userId is not provided, return 400
  if (!userId) {
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Find the user with the provided userId
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  // If user is not found, return 404
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Find the events liked by the user
  const likedEvents = await prisma.favorites.findMany({
    where: {
      userId: user.id,
    },
    include: {
      event: true,
    },
  });

  // If no event is found, return 404
  if (!likedEvents || likedEvents.length === 0) {
    return { data: [] };
  }

  // Structure the liked events
  const retrievedLikedEvents = likedEvents.map(
    (likedEvent) => likedEvent.event
  );

  // Return the liked events
  return { data: retrievedLikedEvents };
}

export async function fetchFeaturedEvents(req: NextRequest) {
  // Else, Fetch all events
  const eventResponse = await prisma.events.findMany({
    // Show only public events that are not yet over (both event date and end date for tickets purchase)
    where: {
      visibility: EventVisibility.PUBLIC,
      date: {
        gte: new Date(),
      },
      purchaseEndDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      date: "asc",
    },
    take: 3,
    select: {
      id: true,
      eventId: true,
      mainImageUrl: true,
      title: true,
      date: true,
      time: true,
      venue: true,
    },
  });

  // Return all events
  return { data: eventResponse };
}
