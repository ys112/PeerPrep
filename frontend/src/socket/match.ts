import { io, Socket } from "socket.io-client";
import { accessTokenStorage } from "../utils/accessTokenStorage";

const token = accessTokenStorage.getAccessToken();

export function initializeMatchSocket() {
  return io(import.meta.env.VITE_MATCH_SERVICE_API_URL, {
    auth: {
      token,
    }
  })
}
