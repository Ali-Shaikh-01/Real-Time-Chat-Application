import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

// Factory — always creates a fresh socket (no singleton!)
export function createSocket() {
  return io(SERVER_URL, {
    autoConnect: false,
  });
}
