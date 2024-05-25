import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { compileNewsletterSubscriptionTemplate, sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function subscribeToNewsletter(req: NextRequest) {
  // Get the request body
  const request = await req.json();

  try {
    const { email } = request;

    // If email is not provided, return 400
    if (!email) {
      return {
        error: ApplicationError.UserEmailIsRequired.Text,
        errorCode: ApplicationError.UserEmailIsRequired.Code,
        statusCode: StatusCodes.BadRequest,
      };
    }

    // If email is not valid, return 400
    if (!email.includes("@")) {
      return {
        error: ApplicationError.UserEmailIsNotValid.Text,
        errorCode: ApplicationError.UserEmailIsNotValid.Code,
        statusCode: StatusCodes.BadRequest,
      };
    }

    // Check if email already exists
    const subscriberExists = await prisma.newsLetterSubscribers.findFirst({
      where: {
        email,
      },
    });

    // If email already exists, return 400
    if (subscriberExists) {
      return {
        error: ApplicationError.UserWithEmailAlreadyExists.Text,
        errorCode: ApplicationError.UserWithEmailAlreadyExists.Code,
        statusCode: StatusCodes.BadRequest,
      };
    }

    // Begin transaction
    await prisma.$transaction([
      // Save it to the database
      prisma.newsLetterSubscribers.create({
        data: {
          email,
        },
      }),
      // Update the count in user table
      prisma.users.update({
        where: {
          email,
        },
        data: {
          isNewsletterSubscribed: true,
        },
      }),
    ]);

    // Send email to the subscriber
    await sendMail({
      to: email,
      name: "Subscriber",
      subject: "Welcome to the newsletter",
      body: compileNewsletterSubscriptionTemplate(email),
    });

    return { message: "Subscribed to newsletter successfully" };
  } catch (error) {
    return {
      error: ApplicationError.InternalServerError.Text,
      errorCode: ApplicationError.InternalServerError.Code,
      statusCode: StatusCodes.InternalServerError,
    };
  }
}
