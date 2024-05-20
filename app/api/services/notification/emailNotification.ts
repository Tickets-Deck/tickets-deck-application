import { generateQRCode } from "@/app/services/GenerateQrImage";
import { compileTicketOrderTemplate, sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import moment from "moment";
import Paystack from "paystack";

export async function processEmailNotification(
  paymentResult: Paystack.Response,
  baseUrl: string
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
    include: {
      event: true,
    },
  });

  if (!ticketOrder) {
    throw new Error(
      "Ticket order based on the provided ticket order ID could not be found"
    );
  }

  const qrImageUrl = await generateQRCode(ticketOrder.contactEmail);

  // console.log("QR image gotten: ", qrImageUrl);

  // Send email to the contact email of the ticket order
  await sendMail({
    to: ticketOrder.contactEmail,
    name: "Ticket Order",
    subject: ticketOrder.event.title,
    body: compileTicketOrderTemplate({
      title: ticketOrder.event.title,
      image: ticketOrder.event.mainImageUrl,
      description: ticketOrder.event.description,
      venue: ticketOrder.event.venue as string,
      date: moment(ticketOrder.event.date).format("Do of MMM, YYYY"),
      time: ticketOrder.event.time as string,
      qrImage: ticketOrder.orderId,
      ticketOrderId: ticketOrder.orderId,
      orderPageUrl: `${process.env.NEXTAUTH_URL}/order/${ticketOrder.id}`
    }),
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
    const orderedTicket = orderedTickets[0];
    
    // const qrImageUrl = await generateQRCode(ticketOrder.contactEmail);

    // console.log("QR image gotten: ", qrImageUrl);

    await sendMail({
      to: orderedTicket.associatedEmail as string,
      name: "Ticket Order",
      subject: ticketOrder.event.title,
      body: compileTicketOrderTemplate({
        title: ticketOrder.event.title,
        image: ticketOrder.event.mainImageUrl,
        description: ticketOrder.event.description,
        venue: ticketOrder.event.venue as string,
        date: moment(ticketOrder.event.date).format("Do of MMM, YYYY"),
        time: ticketOrder.event.time as string,
        qrImage: ticketOrder.orderId,
        ticketOrderId: ticketOrder.orderId,
        orderPageUrl: `${process.env.NEXTAUTH_URL}/order/${ticketOrder.id}`
      }),
    });
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
        subject: ticketOrder.event.title,
        body: compileTicketOrderTemplate({
          title: ticketOrder.event.title,
          image: ticketOrder.event.mainImageUrl,
          description: ticketOrder.event.description,
          venue: ticketOrder.event.venue as string,
          date: moment(ticketOrder.event.date).format("Do of MMM, YYYY"),
          time: ticketOrder.event.time,
          qrImage: ticketOrder.orderId,
          ticketOrderId: ticketOrder.orderId,
          orderPageUrl: `${process.env.NEXTAUTH_URL}/order/${ticketOrder.id}`
        }),
      });
    }
  }
}
