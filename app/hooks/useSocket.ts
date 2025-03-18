import { useEffect } from "react";
import { io } from "socket.io-client";
import { ApiRoutes } from "../api/apiRoutes";

const socket = io(ApiRoutes.BASE_URL); // Change this to your NestJS WebSocket URL

export function useSocket(event: string, callback: (data: any) => void) {
  useEffect(() => {
    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
}
