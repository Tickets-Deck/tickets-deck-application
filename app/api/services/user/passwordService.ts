import { ApplicationError } from "@/app/constants/applicationError";
import { generatePasswordResetToken } from "@/app/constants/idgenerator";
import {
  PasswordResetLinkRequest,
  PasswordResetRequest,
} from "@/app/models/IPassword";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function requestPasswordResetLink(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as PasswordResetLinkRequest;

  // If email is not provided, return 400
  if (!request.email) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      errorCode: ApplicationError.MissingRequiredParameters.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if there are any users with the specified email
  const anyUserWithSpecifiedEmail = await prisma.users.findUnique({
    where: {
      email: request.email,
    },
  });

  // If there are no users with the specified email, return 404
  if (!anyUserWithSpecifiedEmail) {
    return {
      error: ApplicationError.UserWithEmailNotFound.Text,
      errorCode: ApplicationError.UserWithEmailNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Check if the user password is not "google-signup-no-password"
  if (anyUserWithSpecifiedEmail.password === "google-signup-no-password") {
    return {
      error: ApplicationError.UserSignedUpWithSocialMedia.Text,
      errorCode: ApplicationError.UserSignedUpWithSocialMedia.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Create the token
  const token = generatePasswordResetToken();

  // Set the expiry date for the token ~ 30 minutes
  const expiryDate = new Date(Date.now() + 30 * 60 * 1000);

  // Store the token in the database
  await prisma.users.update({
    where: {
      email: request.email,
    },
    data: {
      passwordResetToken: token,
      passwordResetTokenExpiry: expiryDate,
    },
  });

  // Get the origin of the request
  const origin = req.headers.get("origin");

  // Construct the password reset link
  const passwordResetLink = `${origin}/auth/reset-password?token=${token}`;

  await sendMail({
    to: request.email,
    name: "Forgot Password",
    subject: "Password Reset Link",
    body: `Click the link below to reset your password ~ ${passwordResetLink}`,
  });

  // Return the message
  return {
    data: { message: "Password reset link sent successfully" },
  };
}

export async function resetPassword(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as PasswordResetRequest;

  // If token, or new password is not provided, return 400
  if (!request.token || !request.newPassword) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      errorCode: ApplicationError.MissingRequiredParameters.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if there are any users with the specified token
  const userWithSpecifiedToken = await prisma.users.findFirst({
    where: {
      passwordResetToken: request.token,
    },
  });

  // If there are no users with the specified token, return 404
  if (!userWithSpecifiedToken) {
    return {
      error: ApplicationError.UserWithTokenNotFound.Text,
      errorCode: ApplicationError.UserWithTokenNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Check if the token has expired
  if (
    !userWithSpecifiedToken.passwordResetTokenExpiry ||
    userWithSpecifiedToken.passwordResetTokenExpiry < new Date()
  ) {
    return {
      error: ApplicationError.PasswordResetTokenExpired.Text,
      errorCode: ApplicationError.PasswordResetTokenExpired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Hash the new password
  const hashedPassword = bcrypt.hashSync(request.newPassword, 10);

//   console.log("🚀 ~ resetPassword ~ hashedPassword:", hashedPassword)
//   console.log("🚀 ~ resetPassword ~ password:", userWithSpecifiedToken.password)

  // Check if the new password is the same as the old password
  if (hashedPassword === userWithSpecifiedToken.password) {
    return {
      error: ApplicationError.PasswordSameAsOld.Text,
      errorCode: ApplicationError.PasswordSameAsOld.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Update the user's password
  await prisma.users.update({
    where: {
      email: userWithSpecifiedToken.email,
    },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiry: null,
    },
  });

  // Return the message
  return {
    data: { message: "Password reset successfully" },
  };
}
