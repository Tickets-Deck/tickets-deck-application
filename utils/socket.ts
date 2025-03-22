import { ApiRoutes } from "@/app/api/apiRoutes";
import { StorageKeys } from "@/app/constants/storageKeys";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

// Retrieve or create a session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem(StorageKeys.ClientSessionWS);
  if (!sessionId) {
    sessionId = uuidv4(); // Generate a unique ID
    localStorage.setItem(StorageKeys.ClientSessionWS, sessionId);
  }
  console.log("🚀 ~ getSessionId ~ sessionId:", sessionId);
  return sessionId;
};

const socket = io(ApiRoutes.BASE_URL, {
  // Your backend URL
  auth: {
    token: process.env.NEXT_PUBLIC_API_KEY,
    sessionId: getSessionId(),
  },
  reconnection: true,
});

export default socket;
