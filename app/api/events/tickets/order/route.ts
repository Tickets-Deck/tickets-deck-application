import { validateRequestMethod } from "@/app/api/services/api-services/requestMethodValidator";
import { initializeOrder } from "@/app/api/services/order/orderService";
import { customNextResponseError } from "@/app/api/utils/customNextResponseError";
import { ApplicationError } from "@/app/constants/applicationError";
import { OrderStatus } from "@/app/enums/IOrderStatus";
import { PaymentStatus } from "@/app/enums/IPaymentStatus";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { TicketOrderRequest } from "@/app/models/ITicketOrder";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Fetches the orders for the user
 */
export async function GET(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "GET");
}

/**
 * Creates or initializes the order for the user
 */
export async function POST(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "POST");

  try {
    // Call function to create or initialize the order
    const operation = await initializeOrder(req);

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
