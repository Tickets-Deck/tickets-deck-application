import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export default function useWebSocket() {
  const [eventData, setEventData] = useState<{
    event: string;
    payload: any;
  } | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3050");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
    });

    socket.on("payment.success", (data) => {
      console.log("Payment Success Event:", data);
      setEventData({ event: "payment.success", payload: data });
    });

    socket.on("user.verified", (data) => {
      console.log("User Verified Event:", data);
      setEventData({ event: "user.verified", payload: data });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
      //   socket.off(event, callback);
    };
  }, []);

  return eventData;
}
