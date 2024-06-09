import { generateQRCode } from "@/app/services/GenerateQrImage";
import { compileTicketOrderTemplate, sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import moment from "moment";
import Paystack from "paystack";

export async function processEmailNotification(
  paymentResult: Paystack.Response,
  baseUrl: string
) {
  // Get ticker order ID from metadata
  const ticketOrderId = paymentResult.data.metadata.ticketOrderId;

  //   console.log("🚀 ~ ticketOrderId:", ticketOrderId);
  //   console.log("🚀 ~ paymentResult gotten:", paymentResult);

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

  //   const qrImageUrl = await generateQRCode(ticketOrder.contactEmail);
  // console.log("QR image gotten: ", qrImageUrl);

  // Get each ordered ticket from the ticket order ID
  const orderedTickets = await prisma.orderedTickets.findMany({
    where: {
      orderId: ticketOrder.orderId,
    },
  });

  // Check if we have only one ordered ticket, and if the associated email for the ordered ticket is the same as the contact email
  // If this is the case, we can send one email to the contact email
  // If not, we can send an email to each associated email

  if (
    orderedTickets.length === 1 &&
    orderedTickets[0].associatedEmail == ticketOrder.contactEmail
  ) {
    const orderedTicket = orderedTickets[0];

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
        orderPageUrl: `${process.env.NEXTAUTH_URL}/order/${ticketOrder.id}`,
      }),
      attachments: [
        {
          filename: "qr-code.png",
          content: await generateQRCode(ticketOrder.contactEmail),
        },
      ],
    });

    return;
  }

  // If we have more than one ordered ticket, we can send an email to the contact email first, then send an email to each associated email

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
      orderPageUrl: `${process.env.NEXTAUTH_URL}/order/${ticketOrder.id}`,
    }),
    // attachments: [
    //   {
    //     filename: "qr-code.png",
    //     content: await generateQRCode(ticketOrder.contactEmail),
    //   },
    // ],
  });

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
        orderPageUrl: `${process.env.NEXTAUTH_URL}/order/${ticketOrder.id}`,
      }),
    });
  }
}
