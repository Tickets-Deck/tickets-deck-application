import { generateQRCode } from "@/app/services/GenerateQrImage";
import { compileTicketOrderTemplate, sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import moment from "moment";
import Paystack from "paystack";

// function getEmailPayload() {
//     return {
//       to: email,
//       name: "Ticket Order",
//       subject: ticketOrder.event.title,
//       body: compileTicketOrderTemplate({
//         title: ticketOrder.event.title,
//         image: ticketOrder.event.mainImageUrl,
//         description: ticketOrder.event.description,
//         venue: ticketOrder.event.venue as string,
//         date: moment(ticketOrder.event.date).format("Do of MMM, YYYY"),
//         time: ticketOrder.event.time as string,
//         qrImage: qrCodeBase64,
//         ticketOrderId: ticketOrder.orderId,
//         ticketType: ticket.ticket.name,
//         orderPageUrl: `${process.env.NEXTAUTH_URL}/order/${ticketOrder.id}`,
//       }),
//       attachments: [
//         {
//           filename: `${ticketOrder.event.title}` + ".png",
//           content: qrCodeBuffer,
//         },
//       ],
//     };
//   }
  

export async function processEmailNotification(
  paymentResult: Paystack.Response,
  baseUrl: string
) {
  // Get ticker order ID from metadata
  const ticketOrderId = paymentResult.data.metadata.ticketOrderId;

  // Get the ticket order from the ticket order ID
  const ticketOrder = await prisma.ticketOrders.findUnique({
    where: {
      id: ticketOrderId,
    },
    include: {
      event: true,
      tickets: {
        include: {
            ticket: {
                select: {
                    name: true
                }
            }
        }
      },
    },
  });

  if (!ticketOrder) {
    throw new Error(
      "Ticket order based on the provided ticket order ID could not be found"
    );
  }

  // Generate the QR code as a buffer
  const qrCodeBuffer = await generateQRCode(ticketOrder.orderId);

  // Convert the buffer to a base64 string
  const qrCodeBase64 = qrCodeBuffer.toString("base64");

  // Get each ordered ticket from the ticket order ID
  const orderedTickets = ticketOrder.tickets;

  // Check if we have only one ordered ticket, and if the associated email for the ordered ticket is the same as the contact email
  // If this is the case, we can send one email to the contact email
  // If not, we can send an email to each associated email

  if (
    orderedTickets.length === 1 &&
    (orderedTickets[0].associatedEmail == ticketOrder.contactEmail ||
      !orderedTickets[0].associatedEmail)
  ) {
    const orderedTicket = orderedTickets[0];

    await sendMail({
      to: orderedTicket.contactEmail as string,
      name: "Ticket Order",
      subject: ticketOrder.event.title,
      body: compileTicketOrderTemplate({
        title: ticketOrder.event.title,
        image: ticketOrder.event.mainImageUrl,
        description: ticketOrder.event.description,
        venue: ticketOrder.event.venue as string,
        date: moment(ticketOrder.event.date).format("Do of MMM, YYYY"),
        time: ticketOrder.event.time as string,
        qrImage: qrCodeBase64,
        ticketOrderId: ticketOrder.orderId,
        ticketType: ticketOrder.tickets[0].ticket.name,
        orderPageUrl: `${process.env.NEXTAUTH_URL}/order/${ticketOrder.id}`,
      }),
      attachments: [
        {
          filename: `${ticketOrder.event.title}` + ".png",
          content: qrCodeBuffer,
          // content: await generateQRCode(ticketOrder.orderId),
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
      ticketType: ticketOrder.tickets.map(ticket => ticket.ticket.name).join(', '),
      orderPageUrl: `${process.env.NEXTAUTH_URL}/order/${ticketOrder.id}`,
    }),
    attachments: [
      {
        filename: `${ticketOrder.event.title}` + ".png",
        content: qrCodeBuffer,
      },
    ],
  });

  // If we have more than one ticket, we can send an email to each associated email of the ticket order if it exists
  for (const ticket of orderedTickets) {
    // If the associated email is the same as the contact email, or the associated email does not exist, we can skip sending an email to the associated email
    // if (!ticket.associatedEmail) {
    //   continue;
    // }

    await sendMail({
      to: ticket.associatedEmail ?? ticket.contactEmail,
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
        ticketType: ticket.ticket.name,
        orderPageUrl: `${process.env.NEXTAUTH_URL}/order/${ticketOrder.id}`,
      }),
      attachments: [
        {
          filename: `${ticketOrder.event.title}` + ".png",
          content: qrCodeBuffer,
        },
      ],
    });
  }
}
