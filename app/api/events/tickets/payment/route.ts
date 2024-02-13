import { generatePaymentReference } from "@/app/constants/idgenerator";
import { InitializePayStack } from "@/app/models/IInitializePayStack";
import { PaymentResultData } from "@/app/models/IPaymentResultData";
import { prisma } from "@/lib/prisma";
import {
  OrderStatus,
  PaymentServiceProvider,
  PaymentStatus,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Paystack from "paystack";

/**
 * Function to initialize the payment
 * @param req is the request object
 * @returns the payment result
 */
export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    // Get the body of the request
    const request = (await req.json()) as InitializePayStack;

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

    // Verify the transaction
    const paymentResult = await Paystack(
      process.env.PAYSTACK_SECRET_URL as string
    ).transaction.verify(trxref);

    // console.log(paymentResult);

    // If the payment result is successful...
    if (paymentResult.status === true) {
      // Get the data from the payment result
      const { data } = paymentResult;
      const {
        reference,
        amount,
        paid_at,
        status,
        metadata,
        currency,
      }: PaymentResultData = data;

      // Get the ticket order id from the metadata
      const ticketOrderId = metadata.ticketOrderId;

      // Fetch the ticket order from the database using the ticket order id
      const existingTicketOrder = await prisma.ticketOrders.findUnique({
        where: {
          id: ticketOrderId,
        },
      });

      // If ticket order does not exist in database...
      if (!existingTicketOrder) {
        return NextResponse.json(
          {
            error:
              "Ticket order based on the ticket order id provided could not be found",
          },
          { status: 400 }
        );
      }

      // If the amount paid is not equal to the total price of the ticket order - Isn't needed now.
      //   if (amount !== existingTicketOrder.totalPrice.toNumber() * 100) {
      //     return NextResponse.json(
      //       {
      //         error:
      //           "Amount paid is not equal to the total price of the ticket order",
      //       },
      //       { status: 400 }
      //     );
      //   }

      // Find the payment associated with the ticket order's id from the database
      const existingPayment = await prisma.payments.findFirst({
        where: {
          ticketOrderId: existingTicketOrder.id,
        },
      });

      // If payment based on the ticket order id does not exist in the database...
      if (!existingPayment) {
        return NextResponse.json(
          { error: "Payment based on the ticket order id provided not found" },
          { status: 400 }
        );
      }

      // Update the payment
      await prisma.payments.update({
        where: {
          id: existingPayment.id,
        },
        data: {
          amountPaid: amount / 100,
          currency: currency,
          paidAt: new Date(paid_at),
          paymentStatus:
            status === "success" ? PaymentStatus.Paid : PaymentStatus.Failed,
        },
      });

      // Update the order status and payment status of the order
      const updatedTicketOrders = await prisma.ticketOrders.update({
        where: {
          id: ticketOrderId,
        },
        data: {
          orderStatus: OrderStatus.Confirmed,
          paymentStatus: PaymentStatus.Paid,
          paymentId: existingPayment.id,
        },
      });

      // Update the each ordered ticket status
      await prisma.orderedTickets.updateMany({
        where: {
          orderId: updatedTicketOrders.orderId,
        },
        data: {
          orderStatus: OrderStatus.Confirmed,
          paymentId: existingPayment.id,
        },
      });

      // Update the ticket order count of the event from the ticket order id
      const updatedEvent = await prisma.events.update({
        where: {
          id: updatedTicketOrders.eventId,
        },
        data: {
          ticketOrdersCount: {
            increment: 1,
          },
        },
      });

      // If a registered user bought the ticket, update the tickets bought count for the user
      if (updatedTicketOrders.userId) {
        await prisma.users.update({
          where: {
            id: updatedTicketOrders.userId,
          },
          data: {
            ticketsBought: {
              increment: 1,
            },
          },
        });
      }

      // Find the user who published the event, then update the ticketSold count property
      await prisma.users.update({
        where: {
          id: updatedEvent.publisherId,
        },
        data: {
          ticketsSold: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ data: paymentResult.data }, { status: 200 });
    } else {
      return NextResponse.json({ paymentResult }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
