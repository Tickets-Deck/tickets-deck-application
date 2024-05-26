import { generatePaymentReference } from "@/app/constants/idgenerator";
import { InitializePayStack } from "@/app/models/IInitializePayStack";
import { prisma } from "@/lib/prisma";
import {
  OrderStatus,
  PaymentServiceProvider,
  PaymentStatus,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Paystack from "paystack";
import {
  handleSuccessfulPayment,
  processPayment,
  verifyPayment,
} from "@/app/api/services/payment/paymentService";
import { processEmailNotification } from "@/app/api/services/notification/emailNotification";
import { validateRequestMethod } from "@/app/api/services/api-services/requestMethodValidator";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { customNextResponseError } from "@/app/api/utils/customNextResponseError";

/**
 * Function to initialize the payment
 * @param req is the request object
 * @returns the payment result
 */
export async function POST(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "POST");

  try {
    // Call the function to process the payment
    const operation = await processPayment(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.InternalServerError.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

/**
 * Function to verify the payment
 * @param req is the request object
 * @returns the payment result
 */
export async function GET(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "GET");

  try {
    // Call the function to verify the payment
    const operation = await verifyPayment(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data || operation, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.InternalServerError.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
