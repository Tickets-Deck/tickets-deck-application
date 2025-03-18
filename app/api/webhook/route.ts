import { io } from "socket.io-client";
import { WebhookEvent } from "@/app/enums/WebhookEvent";
import { NextResponse } from "next/server";
import { ApiRoutes } from "../apiRoutes";

// Connect to your NestJS WebSocket server
const socket = io(ApiRoutes.BASE_URL); // Change to your actual API URL

// // Listen for the "user-email-verified" event
// socket.on(WebhookEvent.USER_EMAIL_VERIFIED, (data) => {
//   console.log("User email verified:", data);
//   // You can trigger a page refresh if needed
//   window.location.reload();
// });

export async function POST(req: Request, res: Response) {
  // validate request method
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Parse the request body
    const body = await req.json();
    console.log("🚀 ~ handler ~ body:", body);

    const { event, email } = body;

    // Type check: Ensure event is a valid WebhookEvent
    if (!Object.values(WebhookEvent).includes(event as WebhookEvent)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }

    if (event === WebhookEvent.USER_EMAIL_VERIFIED) {
      console.log(`User email verified: ${email}`);

      // Emit WebSocket event to frontend clients
      socket.emit(event, { email });

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ message: "Unhandled event" }, { status: 200 });
  } catch (error) {
    // Return an error if the operation fails
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
