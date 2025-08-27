import { useEffect } from "react";
import socket from "@/utils/socket";
import { SocketEvents } from "@/app/enums/SocketEvents";
import { PaymentVerificationEventRes } from "@/app/models/ISocketEventsResponse";
import { useRouter } from "next/navigation";

export default function WebSocketListener() {
  const router = useRouter();

  useEffect(() => {
    socket.on("connect", () => console.debug(`Connected to websocket!`));

    socket.on("disconnect", () =>
      console.debug(`Disconnected from websocket!`)
    );

    socket.on(SocketEvents.User_Email_Verfied, (data) => {
      console.debug("User Email Verified");
    });

    socket.on(
      SocketEvents.Payment_Verfied,
      (data: PaymentVerificationEventRes) => {
        // Route to order page
        router.push(`/order/${data.ticketOrderId}`);
      }
    );

    return () => {
      socket.off(SocketEvents.User_Email_Verfied);
      socket.off(SocketEvents.Payment_Verfied);
      // socket.disconnect(); // Disconnect WebSocket on unmount
    };
  }, []);

  return null; // Runs in the background
}
