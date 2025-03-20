import { WebSocketServer } from "ws";
import { Server as NetServer, Socket } from 'net';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponse } from 'next';

declare module "http" {
  interface Server {
    wss?: WebSocketServer;
  }
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: NetServer & {
    server: NetServer & {
      io?: ServerIO;
    };
  };
};
