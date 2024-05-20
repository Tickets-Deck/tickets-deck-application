import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { newsletterSubscriptionTemplate } from "./templates/newsletterSubscription";
import { accountCreationTemplate } from "./templates/accountCreation";
import { ticketOrderTemplate } from "./templates/ticketOrder";

type Mail = {
  to: string;
  name: string;
  subject: string;
  body: string;
  bcc?: string
};

export async function sendMail({ to, name, subject, body, bcc }: Mail) {
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
  orderPageUrl: string
}) {
  const template = handlebars.compile(ticketOrderTemplate);
  const htmlBody = template({
    eventTitle: eventInfo.title,
    eventImage: eventInfo.image,
    eventDescription: eventInfo.description,
    eventLocation: eventInfo.venue,
    eventDate: eventInfo.date,
    eventTime: eventInfo.time,
    qrImage: eventInfo.qrImage,
    ticketOrderId: eventInfo.ticketOrderId,
    orderPageUrl: eventInfo.orderPageUrl
  });
//   const htmlBody = '<p>Here is your QR code:</p><img src="' + eventInfo.qrImage + '" alt="QR Code">';

  return htmlBody;
}
