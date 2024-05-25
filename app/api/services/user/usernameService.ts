import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { UsernameRequest } from "@/app/models/IUser";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function updateUsername(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // Get the body of the request
  const request = (await req.json()) as UsernameRequest;

  // If userId is not provided, return 400
  if (!userId) {
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If username is not provided, return 400
  if (!request.username) {
    return {
      error: ApplicationError.UsernameIsRequired.Text,
      errorCode: ApplicationError.UsernameIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if there are any users with the specified username
  const anyUserWithSpecifiedUsername = await prisma.users.findUnique({
    where: {
      username: request.username,
    },
  });

  // If any user with the specified username exists, return 400
  if (anyUserWithSpecifiedUsername) {
    return {
      error: ApplicationError.UserWithUsernameAlreadyExists.Text,
      errorCode: ApplicationError.UserWithUsernameAlreadyExists.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Find the current user with the specified userId
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
  return { data: updatedUser };
}
