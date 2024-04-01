import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import Paystack from "paystack";

export async function processEmailNotification(
  paymentResult: Paystack.Response
) {
  //   console.log("Processing email notification...");

  // Get ticker order ID from metadata
  const ticketOrderId = paymentResult.data.metadata.ticketOrderId;

  //   console.log(ticketOrderId);

  // Get the ticket order from the ticket order ID
  const ticketOrder = await prisma.ticketOrders.findUnique({
    where: {
      id: ticketOrderId,
    },
  });

  if (!ticketOrder) {
    throw new Error(
      "Ticket order based on the provided ticket order ID could not be found"
    );
  }

  // Send email to the contact email of the ticket order
  await sendMail({
    to: ticketOrder.contactEmail,
    name: "Ticket Order",
    subject: "You've got a new ticket order",
    // body: compileNewsletterSubscriptionTemplate(email),
    body: `<p>Thank you for your purchase.</p>`,
  });

  // Get each ordered ticket from the ticket order ID
  const orderedTickets = await prisma.orderedTickets.findMany({
    where: {
      orderId: ticketOrderId,
    },
  });

  // If we have one ticket, and the associated email is the same as the contact email, we can send one email to the contact email
  if (
    orderedTickets.length === 1 &&
    orderedTickets[0].associatedEmail === ticketOrder.contactEmail
  ) {
    return;
  } else {
    // If we have more than one ticket, we can send an email to each associated email
    for (const ticket of orderedTickets) {
      // await sendMail(ticket.contactEmail);
      if (!ticket.associatedEmail) {
        throw new Error("Ticket does not have an associated email");
      }

      await sendMail({
        to: ticket.associatedEmail,
        name: "Ticket Order",
        subject: "You've got a new ticket!",
        // body: compileNewsletterSubscriptionTemplate(email),
        body: `<p>Thank you for your purchase.</p>`,
      });
    }
  }
}
