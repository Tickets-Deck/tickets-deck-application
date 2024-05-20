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
import { handleSuccessfulPayment } from "@/app/api/services/payment/paymentsService";
import { processEmailNotification } from "@/app/api/services/notification/emailNotification";

/**
 * Function to initialize the payment
 * @param req is the request object
 * @returns the payment result
 */
export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    // Get the body of the request
    const request = (await req.json()) as InitializePayStack;
    // console.log("🚀 ~ POST ~ request:", request)

    const ticketOrderId = request.ticketOrderId;
    const callbackUrl = request.callbackUrl;

    // Check if the ticketOrderId or callbackUrl is null
    if (ticketOrderId === null || callbackUrl === null) {
      return NextResponse.json(
        { error: "Ticket order id and callback url are required" },
        { status: 400 }
      );
    }

    // Check if ticket order id exist in database
    const existingTicketOrder = await prisma.ticketOrders.findUnique({
      where: {
        id: ticketOrderId,
      },
      include: {
        user: true,
      },
    });

    // If ticket order id does not exist in database...
    if (!existingTicketOrder) {
      return NextResponse.json(
        {
          error:
            "Ticket order based on the ticket order id provided could not be found",
        },
        { status: 400 }
      );
    }

    const paymentInitiatedForOrder =
      existingTicketOrder.orderStatus == OrderStatus.PaymentInitiated;
    const orderConfirmed =
      existingTicketOrder.orderStatus == OrderStatus.Confirmed;
    const orderCancelled =
      existingTicketOrder.orderStatus == OrderStatus.Cancelled;

    // If payment has been initiated for the order
    if (paymentInitiatedForOrder || orderConfirmed || orderCancelled) {
      return NextResponse.json(
        { error: "Ticket order has been processed" },
        { status: 400 }
      );
    }

    // Get the user associated with that ticket order
    const associatedUser = existingTicketOrder.user;

    const amountInKobo = existingTicketOrder.totalPrice.toNumber() * 100;

    // Initialize paystack payment
    const paymentResult = await Paystack(
      process.env.PAYSTACK_SECRET_URL as string
    ).transaction.initialize({
      amount: amountInKobo,
      reference: generatePaymentReference(),
      name: associatedUser
        ? `${associatedUser.firstName} ${associatedUser.lastName}`
        : existingTicketOrder.contactEmail,
      email: existingTicketOrder.contactEmail,
      callback_url: callbackUrl,
      metadata: {
        ticketOrderId: ticketOrderId,
      },
    });

    if (paymentResult.status === true) {
      // Create the payment
      await prisma.payments.create({
        data: {
          userId: associatedUser ? associatedUser.id : null,
          amount: existingTicketOrder.totalPrice,
          ticketOrderId: ticketOrderId,
          amountPaid: null,
          currency: null,
          paymentStatus: PaymentStatus.Pending,
          paymentReference: paymentResult.data.reference,
          paymentServiceProvider: PaymentServiceProvider.Paystack,
        },
      });

      // Update the order status of the order
      await prisma.ticketOrders.update({
        where: {
          id: ticketOrderId,
        },
        data: {
          orderStatus: OrderStatus.PaymentInitiated,
        },
      });

      // Update the each ordered ticket status
      await prisma.orderedTickets.updateMany({
        where: {
          orderId: ticketOrderId,
        },
        data: {
          orderStatus: OrderStatus.PaymentInitiated,
        },
      });

      // Get the ordered tickets from the ticket order id
      const orderedTickets = await prisma.orderedTickets.findMany({
        where: {
          orderId: ticketOrderId,
        },
        include: {
          ticket: true,
        },
      });

      // Update the ticket ordered count of each ticket
      for (const ticket of orderedTickets) {
        await prisma.tickets.update({
          where: {
            id: ticket.ticketId,
          },
          data: {
            ticketOrdersCount: ticket.ticket.ticketOrdersCount + 1,
            // remainingTickets: ticket.ticket.remainingTickets -
          },
        });
      }

      return NextResponse.json({ data: paymentResult.data }, { status: 200 });
    } else {
      return NextResponse.json({ paymentResult }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}

/**
 * Function to verify the payment
 * @param req is the request object
 * @returns the payment result
 */
export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    // Get the transaction reference id from the search params
    const trxref = searchParams.get("trxref");

    // If a transaction reference id is not provided...
    if (!trxref) {
      return NextResponse.json(
        { error: "Transaction reference id is required" },
        { status: 400 }
      );
    }

    // Check if the payment has been verified ~ by checking if the payment reference id exists in the database, and the payment status is paid
    const existingPayment = await prisma.payments.findFirst({
      where: {
        paymentReference: trxref,
        AND: {
          paymentStatus: PaymentStatus.Paid,
        },
      },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "Payment has already been verified" },
        { status: 400 }
      );
    }

    // Verify the transaction
    const paymentResult = await Paystack(
      process.env.PAYSTACK_SECRET_URL as string
    ).transaction.verify(trxref);

    // console.log("payment result: ", paymentResult);
    const { headers } = req;
    const baseUrl = `${headers.get("x-forwarded-proto") || "http"}://${headers.get("host")}`;
    // console.log("🚀 ~ GET ~ headers:", headers)
    // console.log("🚀 ~ baseUrl ~ baseUrl:", baseUrl)

    // If the payment is successful...
    if (paymentResult.status === true) {
      // Process the payment result
      await handleSuccessfulPayment(paymentResult);

      // Process the email notification to the user
      await processEmailNotification(paymentResult, baseUrl);

      //   console.log("Payment result data: ", paymentResult.data);

      return NextResponse.json({ data: paymentResult.data }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: paymentResult.message },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
