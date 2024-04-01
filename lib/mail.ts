import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { newsletterSubscriptionTemplate } from "./templates/newsletterSubscription";
import { accountCreationTemplate } from "./templates/accountCreation";

type Mail = {
  to: string;
  name: string;
  subject: string;
  body: string;
};

export async function sendMail({ to, name, subject, body }: Mail) {
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
