import { NextRequest, NextResponse } from "next/server";
import { Server } from "socket.io";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { event, payload } = await req.json();

    // Ensure Socket.IO is initialized
    if (!(global as any).io) {
      (global as any).io = new Server(3050, {
        path: "/api/socketio",
        cors: { origin: "*" },
        addTrailingSlash: false,
      });
    }

    (global as any).io.emit(event, payload);

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Webhook handling error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
