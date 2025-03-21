import { useEffect } from "react";
import socket from "@/utils/socket";

export default function WebSocketListener() {
    useEffect(() => {
        socket.on("connect", () => console.log(`Connected to websocket!`));

        socket.on("disconnect", () => console.log(`Disconnected from websocket!`));

        socket.on("user_verified", (data) => {
            console.log("User Verified:", data);
        });

        socket.on("payment_verified", (data) => {
            console.log("Payment Verified:", data);
        });

        return () => {
            socket.off("user_verified");
            socket.off("payment_verified");
            // socket.disconnect(); // Disconnect WebSocket on unmount
        };
    }, []);

    return null; // Runs in the background
}
