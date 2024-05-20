import { sendMail } from "@/lib/mail";

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?vrtkn=${token}`;

  // Send email to the new customer
  await sendMail({
    to: email,
    name: "Verify Email",
    subject: "Verify your email address",
    body: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}" target="_blank">Verify Email</a></p>`,
  });
}
