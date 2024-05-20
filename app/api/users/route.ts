import { UserCredentialsUpdateRequest } from "@/app/models/IUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createUser } from "../services/user/usersService";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    // Get the userId from the search params
    const userId = searchParams.get("userId");

    // Get the userName from the search params
    const userName = searchParams.get("userName");

    // If a userId is provided, find the user with that id
    if (userId) {
      const user = await prisma.users.findUnique({
        where: {
          id: userId,
        },
        include: {
          events: true,
        },
      });

      // If user is not found, return 404
      if (!user) {
        return NextResponse.json(
          { error: "User with specified User ID not found" },
          { status: 404 }
        );
      }

      // If user is found, return it
      if (user) {
        return NextResponse.json(user, { status: 200 });
      }
    }

    // If a userName is provided, find the user with that username
    if (userName) {
      const user = await prisma.users.findUnique({
        where: {
          username: userName,
        },
        include: {
          events: true,
        },
      });

      // If user is not found, return 404
      if (!user) {
        return NextResponse.json(
          { error: "User with specified username not found" },
          { status: 404 }
        );
      }

      // If user is found, return it
      if (user) {
        return NextResponse.json(user, { status: 200 });
      }
    }

    // Fetch all users
    const users = await prisma.users.findMany();

    // Return all users
    return NextResponse.json(users);
  }
}

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    // Call the createUser function
    const operation = await createUser(req);

    // If the operation fails, return an error
    if (operation.error) {
      return NextResponse.json(
        {
          error: operation.error,
          errorCode: operation.errorCode
        },
        { status: operation.statusCode }
      );
    }

    // Return the response
    return NextResponse.json(
      { detail: "Successfully created a new user" },
      { status: 201 }
    );
  } else {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}

export async function PUT(req: NextRequest) {
  if (req.method === "PUT") {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    // Get the userId from the search params
    const userId = searchParams.get("userId");

    // Get the body of the request
    const request = (await req.json()) as UserCredentialsUpdateRequest;

    // If userId is not provided, return 400
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    //find the current user with the specified id
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    // If user is not found, return 404
    if (!user) {
      return NextResponse.json(
        { error: "User with specified User ID not found" },
        { status: 404 }
      );
    }

    if (
      request.email &&
      request.email.toLowerCase() !== user.email.toLowerCase()
    ) {
      // Check if the email is already taken
      const emailExists = await prisma.users.findUnique({
        where: {
          email: request.email,
        },
      });

      // If email is already taken, return 400
      if (emailExists) {
        return NextResponse.json(
          { error: "Email is already taken" },
          { status: 400 }
        );
      }
    }

    // If user is found, update the user
    const updatedUser = await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        email: request.email?.toLowerCase() ?? user.email.toLowerCase(),
        firstName: request.firstName ?? user.firstName,
        lastName: request.lastName ?? user.lastName,
        phone: request.phone ?? user.phone,
        facebookUrl: request.facebookUrl ?? null,
        twitterUrl: request.twitterUrl ?? null,
        instagramUrl: request.instagramUrl ?? null,
      },
    });

    // Return the updated user
    return NextResponse.json(updatedUser, { status: 200 });
  } else {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}

// router.get("/posts/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (!id) throw Error();
//     console.log("Here: ", id);
//     const post = await prisma.events.findFirstOrThrow({
//       where: { id: parseInt(id) },
//     });

//     res.status(200).json({post});
//   } catch (error) {
//     res.status(404).json({message: "No events found with provided ID"});
//   }
// });
