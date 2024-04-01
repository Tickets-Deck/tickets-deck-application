import { StatusCodes } from "@/app/models/IStatusCodes";
import { compileNewsletterSubscriptionTemplate, sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const request = await req.json();

    try {
      const { email } = request;

      // If email is not provided, return 400
      if (!email) {
        return NextResponse.json(
          { error: "Email is required" },
          { status: 400 }
        );
      }

      // If email is not valid, return 400
      if (!email.includes("@")) {
        return NextResponse.json(
          { error: "Email is not valid" },
          { status: 400 }
        );
      }

      // Check if email already exists
      const subscriberExists = await prisma.newsLetterSubscribers.findFirst({
        where: {
          email,
        },
      });

      // If email already exists, return 400
      if (subscriberExists) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }

      // Save it to the database
      const subscriber = await prisma.newsLetterSubscribers.create({
        data: {
          email, 
        },
      });

      // Send email to the subscriber
      await sendMail({
        to: email,
        name: "Subscriber",
        subject: "Welcome to the newsletter",
        body: compileNewsletterSubscriptionTemplate(email),
        // body: `<p>Thank you for subscribing to the newsletter</p>`,
      });

      return NextResponse.json(subscriber, { status: StatusCodes.Created });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}
