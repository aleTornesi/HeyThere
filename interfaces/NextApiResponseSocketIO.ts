import {Server as SocketIOServer} from 'socket.io'
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from 'next';

type T = {
    socket: Socket & {
        server: NetServer & {
        io: SocketIOServer;
        }
    }
}

interface NetServerWithSocketIO extends NetServer {
    io: SocketIOServer | null
}

interface SocketWithServer extends Socket {
    server: NetServerWithSocketIO | null
}

export interface NextApiResponseSocketIO extends NextApiResponse {
    socket: SocketWithServer | null
}
