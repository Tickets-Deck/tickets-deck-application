import { EventRequest } from "@/app/models/IEvents";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const request = (await req.json()) as EventRequest;

    console.log("request", request);

    try {
      const { email } = request;

      // If email is not provided, return 400
      if (!email) {
        return {
          status: 400,
          json: { error: "Email is required" },
        };
      }

      // If email is not valid, return 400
      if (!email.includes("@")) {
        return {
          status: 400,
          json: { error: "Email is not valid" },
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
          status: 400,
          json: { error: "Email already exists" },
        };
      }

      // If email is valid, save it to the database
      const subscriber = await prisma.newsLetterSubscribers.create({
        data: {
          email,
        },
      });

      return {
        status: 201,
        json: subscriber,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        json: { error: "Something went wrong" },
      };
    }
  }
}
