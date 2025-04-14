import { io } from "socket.io-client";

// Do NOT auto connect on import
export const socket = io("http://localhost:8000", {
  autoConnect: false,
  withCredentials: true,
});
