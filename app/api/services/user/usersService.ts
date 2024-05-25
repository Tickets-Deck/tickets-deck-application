import {
  UserCredentialsRequest,
  UserCredentialsUpdateRequest,
} from "@/app/models/IUser";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { compileAccountCreationTemplate, sendMail } from "@/lib/mail";
import { sendVerificationEmail } from "../../utils/sendVerificationEmail";
import { v4 as uuidv4 } from "uuid";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";

export async function createUser(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as UserCredentialsRequest;

  // Check if all required fields are provided
  if (!request.email || !request.password || !request.firstName) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      statusCode: StatusCodes.BadRequest,
    };
  }

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
      statusCode: StatusCodes.BadRequest,
    };
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

  // Set the verification token for the new user
  const verificationToken = await setVerificationToken(newUser.email);

  if (!verificationToken) {
    // Undo the user creation
    await prisma.users.delete({
      where: {
        id: newUser.id,
      },
    });

    return {
      error: ApplicationError.VerificationTokenNotSet.Text,
      errorCode: ApplicationError.VerificationTokenNotSet.Code,
      statusCode: StatusCodes.InternalServerError,
    };
  }

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
  return { message: "Successfully created a new user" };
}

export async function fetchUsers(req: NextRequest) {
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
      return {
        error: ApplicationError.UserWithIdNotFound.Text,
        errorCode: ApplicationError.UserWithIdNotFound.Code,
        statusCode: StatusCodes.NotFound,
      };
    }

    // If user is found, return it
    return { data: user };
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
      return {
        error: ApplicationError.UserWithUsernameNotFound.Text,
        errorCode: ApplicationError.UserWithUsernameNotFound.Code,
        statusCode: StatusCodes.NotFound,
      };
    }

    // If user is found, return it
    return { data: user };
  }

  // Fetch all users
  const users = await prisma.users.findMany();

  // Return all users
  return { data: users };
}

async function fetchUserById(userId: string) {
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
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // If user is found, return it
  return { user };
}

async function fetchUserByUsername(userName: string) {
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
    return {
      error: ApplicationError.UserWithUsernameNotFound.Text,
      errorCode: ApplicationError.UserWithUsernameNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // If user is found, return it
  return { user };
}

async function fetchAllUsers() {
  const users = await prisma.users.findMany({
    include: {
      events: true,
    },
  });

  // Return the users
  return { users };
}

export async function updateUser(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // Get the body of the request
  const request = (await req.json()) as UserCredentialsUpdateRequest;

  // If userId is not provided, return 400
  if (!userId) {
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  //find the current user with the specified id
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
      return {
        error: ApplicationError.UserWithEmailAlreadyExists.Text,
        errorCode: ApplicationError.UserWithEmailAlreadyExists.Code,
        statusCode: StatusCodes.BadRequest,
      };
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
  return { data: updatedUser };
}

export async function verifyUserEmail(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the token from the search params
  const token = searchParams.get("token");

  // If token is not provided, or is not a string, return an error
  if (!token || typeof token !== "string") {
    return {
      error: ApplicationError.TokenIsRequired.Text,
      errorCode: ApplicationError.TokenIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
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
      statusCode: StatusCodes.NotFound,
    };
  }

  // If the user email is already verified, return a message
  if (user.emailVerified) {
    return {
      message: ApplicationError.EmailAlreadyVerified.Text,
      errorCode: ApplicationError.EmailAlreadyVerified.Code,
      statusCode: 200,
    };
  }

  // If not, check if the token has expired ~ if today's date is greater than the expiry date
  if (new Date() > (user.verificationTokenExpiry as Date)) {
    return {
      error: ApplicationError.TokenExpired.Text,
      errorCode: ApplicationError.TokenExpired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Update the user email verification status to true
  const updatedUser = await prisma.users.update({
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
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Set the verification token for the new user
  const verificationToken = await setVerificationToken(email);

  // Send the verification email
  await sendVerificationEmail(email, verificationToken);

  // Return the response
  return { message: "Verification email sent" };
}

/**
 * Function to set the verification token, and token expiry for a user
 * @param email is the email of the newly created user
 * @returns the verification token
 */
async function setVerificationToken(email: string) {
  // Generate a verification token
  const verificationToken = uuidv4();

  // Set the token to expire in 10 minutes
  const tokenExpiration = new Date();
  tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 10);

  // Find user with the email, and update the verification token
  await prisma.users.update({
    where: {
      email: email,
    },
    data: {
      verificationToken: verificationToken,
      verificationTokenExpiry: tokenExpiration,
    },
  });

  // Return the verification token
  return verificationToken;
}
