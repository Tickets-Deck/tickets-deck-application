import { UsernameRequest } from "@/app/models/IUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  // If request method is PUT...
  if (req.method === "PUT") {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    // Get the userId from the search params
    const userId = searchParams.get("userId");

    // Get the body of the request
    const request = (await req.json()) as UsernameRequest;

    // If userId is not provided, return 400
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // If username is not provided, return 400
    if (!request.username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Check if there are any users with the specified username
    const anyUserWithSpecifiedUsername = await prisma.users.findUnique({
      where: {
        username: request.username,
      },
    });

    // If any user with the specified username exists, return 400
    if (anyUserWithSpecifiedUsername) {
      return NextResponse.json(
        { error: "User with specified username already exists" },
        { status: 400 }
      );
    }

    // Find the current user with the specified userId
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

    // Update the username of the user with the specified userId
    const updatedUser = await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        username: request.username,
      },
    });

    // Return the updated user
    return NextResponse.json(updatedUser, { status: 200 });
  }
  // If request method is not PUT, return 405
  else {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}
