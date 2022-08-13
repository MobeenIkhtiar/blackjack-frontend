import socketio from "socket.io-client";
import { createContext } from "react";

export const socket = socketio.connect("http://localhost:3001");
// export const socket = socketio.connect("https://blackjack-backendd.herokuapp.com/");
export const SocketContext = createContext();