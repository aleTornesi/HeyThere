import {Server as SocketIOServer} from 'socket.io'
import { Server as NetServer, Socket } from "net";

type T = {
    socket: Socket & {
        server: NetServer & {
        io: SocketIOServer;
        }
    }
}

var socket: T | null = null

export default socket