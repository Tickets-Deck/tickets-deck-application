import { ApplicationError } from "@/app/constants/applicationError";
import { CustomerEnquiry } from "@/app/models/ICustomerEnquiries";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function createEnquiry(req: NextRequest) {
  // Get the request body
  const request = (await req.json()) as CustomerEnquiry;

  // If the request body is empty, or any of the required fields are missing, return an error
  if (
    !request ||
    !request.name ||
    !request.email ||
    !request.subject ||
    !request.message
  ) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      errorCode: ApplicationError.MissingRequiredParameters.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Create the customer enquiry
  await prisma.customerEnquiries.create({
    data: {
      name: request.name,
      email: request.email,
      subject: request.subject,
      message: request.message,
    },
  });

  // Return the customer enquiry
  return { message: "Customer enquiry created successfully" };
}

export async function fetchEnquiries() {
  // Fetch all customer enquiries
  const enquiries = await prisma.customerEnquiries.findMany();

  // Return the customer enquiries
  return { data: enquiries };
}
