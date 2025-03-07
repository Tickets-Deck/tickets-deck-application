import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { newsletterSubscriptionTemplate } from "./templates/newsletterSubscription";
import { accountCreationTemplate } from "./templates/accountCreation";
import { ticketOrderTemplate } from "./templates/ticketOrder";
import { verifyEmailTemplate } from "./templates/verifyAccount";
import { htmlToPlainText } from "@/utils/convertHtmlToText";
import { newTicketPurchaseToOrganizerTemplate } from "./templates/newTicketPurchaseToOrganizer";

type Mail = {
  to: string;
  name: string;
  subject: string;
  body: string;
  bcc?: string;
  attachments?: { filename: string; content: Buffer | string }[];
};

export async function sendMail({
  to,
  name,
  subject,
  body,
  bcc,
  attachments,
}: Mail) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    // Verify connection configuration
    const testResult = await transport.verify();
    // Log test result
    console.log("Transporter test result: ", testResult);
  } catch (error) {
    console.error(error);
  }

  try {
    if (attachments) {
      const sendMail = await transport.sendMail({
        from: SMTP_EMAIL,
        to,
        bcc,
        subject,
        html: body,
        attachments: [
          {
            filename: attachments[0].filename,
            content: attachments[0].content,
          },
        ],
      });

      return sendMail;
    }

    const sendMail = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      bcc,
      subject,
      html: body,
    });
    return sendMail;
  } catch (error) {
    console.error(error);
  }
}

export function compileNewsletterSubscriptionTemplate(email: string) {
  const template = handlebars.compile(newsletterSubscriptionTemplate);
  const htmlBody = template({ email });

  return htmlBody;
}

export function compileAccountCreationTemplate(name: string) {
  const template = handlebars.compile(accountCreationTemplate);
  const htmlBody = template({ name });

  return htmlBody;
}

export function compileTicketOrderTemplate(eventInfo: {
  title: string;
  image: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  qrImage: string;
  ticketOrderId: string;
  ticketType: string;
  orderPageUrl: string;
}) {
  const template = handlebars.compile(ticketOrderTemplate);

  // convert event description html content to text
  const updatedEventDescription = htmlToPlainText(eventInfo.description);

  const htmlBody = template({
    eventTitle: eventInfo.title,
    eventImage: eventInfo.image,
    eventDescription: updatedEventDescription,
    eventLocation: eventInfo.venue,
    eventDate: eventInfo.date,
    eventTime: eventInfo.time,
    qrImage: eventInfo.qrImage,
    ticketOrderId: eventInfo.ticketOrderId,
    ticketType: eventInfo.ticketType,
    orderPageUrl: eventInfo.orderPageUrl,
  });
  //   const htmlBody = '<p>Here is your QR code:</p><img src="' + eventInfo.qrImage + '" alt="QR Code">';

  return htmlBody;
}

export function compileNewTicketPurchaseTemplate(ticketPurchaseInfo: {
  title: string;
  image: string;
  ticketType: string;
  eventName: string;
  quantity: number;
  amountPaid: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventPageUrl: string;
}) {
  const template = handlebars.compile(newTicketPurchaseToOrganizerTemplate);

  const htmlBody = template({
    eventTitle: ticketPurchaseInfo.title,
    eventImage: ticketPurchaseInfo.image,
    ticketType: ticketPurchaseInfo.ticketType,
    eventName: ticketPurchaseInfo.eventName,
    quantity: ticketPurchaseInfo.quantity,
    amountPaid: ticketPurchaseInfo.amountPaid,
    customerName: ticketPurchaseInfo.customerName,
    customerEmail: ticketPurchaseInfo.customerEmail,
    customerPhone: ticketPurchaseInfo.customerPhone,
    eventPageUrl: ticketPurchaseInfo.eventPageUrl,
  });
  
  return htmlBody;
}

export function compileVerifyEmailTemplate({
  verificationUrl,
  userEmail,
}: {
  verificationUrl: string;
  userEmail: string;
}) {
  const template = handlebars.compile(verifyEmailTemplate);
  const htmlBody = template({ verificationUrl, userEmail });

  return htmlBody;
}
