import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://your-backend-url.com", {
  transports: ["websocket"], // Use WebSocket transport for real-time communication
  reconnection: true, // Enable automatic reconnection
});

export default socket;
