import { io, Socket } from "socket.io-client";
import { accessTokenStorage } from "../utils/accessTokenStorage";

const token = accessTokenStorage.getAccessToken();
const socket: Socket = io(import.meta.env.VITE_MATCH_SERVICE_API_URL, {
  auth: {
    token,
  },
});

export default socket;
