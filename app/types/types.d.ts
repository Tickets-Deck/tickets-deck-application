import { WebSocketServer } from "ws";

declare module "http" {
  interface Server {
    wss?: WebSocketServer;
  }
}
