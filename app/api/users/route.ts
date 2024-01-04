import { UserCredentialsRequest } from "@/app/models/IUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    // Fetch all users
    const users = await prisma.users.findMany();

    // Return all users
    return NextResponse.json(users);
  }
}

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    // Get the body of the request
    const request = (await req.json()) as UserCredentialsRequest;

    // Find user with the email
    const user = await prisma.users.findUnique({
      where: {
        email: request.email,
      },
    });

    // If user already exists, return an error
    if (user) {
      // return error
      return NextResponse.json(
        { detail: "User with this email already exist." },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = bcrypt.hashSync(request.password, 10);

    // If user does not exist, create a new user...
    const newUser = await prisma.users.create({
      data: {
        email: request.email,
        password: passwordHash,
        firstName: request.firstName,
        lastName: request.lastName,
        phone: request.phone ?? null,
      },
    });

    // Return the new user, and a message that the user was created
    return NextResponse.json(
      { detail: "Successfully created a new user", user: newUser },
      { status: 201 }
    );
  } else {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}
