import { UserCredentialsRequest } from "@/app/models/IUser";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { compileAccountCreationTemplate, sendMail } from "@/lib/mail";
import { sendVerificationEmail } from "../../utils/sendVerificationEmail";
import { v4 as uuidv4 } from "uuid";
import { ApplicationError } from "@/app/constants/applicationError";

export async function createUser(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as UserCredentialsRequest;

  // Find user with the email
  const user = await prisma.users.findUnique({
    where: {
      email: request.email,
    },
  });

  // If user already exists, throw an error
  if (user) {
    return {
      error: ApplicationError.UserAlreadyExists.Text,
      errorCode: ApplicationError.UserAlreadyExists.Code,
      statusCode: 400,
    };
  }

  // Hash the password
  const passwordHash = bcrypt.hashSync(request.password, 10);

  // Generate a verification token
  const verificationToken = uuidv4();

  // If user does not exist, create a new user...
  await prisma.users.create({
    data: {
      email: request.email,
      password: passwordHash,
      firstName: request.firstName,
      lastName: request.lastName,
      phone: request.phone ?? null,
      verificationToken: verificationToken,
    },
  });

  // Send email to the new customer & send verification email concurrently
  await Promise.all([
    sendMail({
      to: request.email,
      name: "Account Created",
      subject: "Welcome to Ticketsdeck",
      body: compileAccountCreationTemplate(`${request.firstName}`),
    }),
    sendVerificationEmail(request.email, verificationToken),
  ]);

  // Return the response
  return { message: "User created" };
}

export async function verifyUserEmail(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the token from the search params
  const token = searchParams.get("token");

  // If token is not provided, return an error
  if (!token || typeof token !== "string") {
    return {
      error: ApplicationError.TokenIsRequired.Text,
      errorCode: ApplicationError.TokenIsRequired.Code,
      statusCode: 400,
    };
  }

  // Check for user with the specified token
  const user = await prisma.users.findFirst({
    where: {
      verificationToken: token,
    },
  });

  // If user is not found, return an error
  if (!user) {
    return {
      error: ApplicationError.UserWithTokenNotFound.Text,
      errorCode: ApplicationError.UserWithTokenNotFound.Code,
      statusCode: 404,
    };
  }

  // If the user email is already verified, return an error
  if (user.emailVerified) {
    return {
      message: ApplicationError.EmailAlreadyVerified.Text,
      errorCode: ApplicationError.EmailAlreadyVerified.Code,
      statusCode: 200,
    };
  }

  // Update the user email verification status to true
  await prisma.users.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: true,
    },
  });

  // Return the response
  return { message: "Email verified" };
}

export async function resendVerificationLink(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the email from the search params
  const email = searchParams.get("email");

  // If the email is not provided, return an error
  if (!email) {
    return {
      error: ApplicationError.EmailIsRequired.Text,
      errorCode: ApplicationError.EmailIsRequired.Code,
      statusCode: 400,
    };
  }

  // Generate a verification token
  const verificationToken = uuidv4();

  // Find user with the email, and update the verification token
  await prisma.users.update({
    where: {
      email: email,
    },
    data: {
      verificationToken: verificationToken,
    },
  });

  // Send the verification email
  await sendVerificationEmail(email, verificationToken);

  // Return the response
  return { message: "Verification email sent" };
}
