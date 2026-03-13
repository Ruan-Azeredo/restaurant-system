import { Server } from "socket.io";
import http from "http";

let io: Server | null = null;

export const initSocketServer = (httpServer: http.Server): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    /**
     * Client subscribes to updates for a specific order job.
     * Event: "subscribe-order"
     * Payload: { job_id: string }
     */
    socket.on("subscribe-order", ({ job_id }: { job_id: string }) => {
      const room = `order:${job_id}`;
      socket.join(room);
      console.log(`[Socket.IO] Client ${socket.id} subscribed to room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  console.log("[Socket.IO] Server initialized.");
  return io;
};

export const getIo = (): Server => {
  if (!io) {
    throw new Error("[Socket.IO] Server not initialized. Call initSocketServer first.");
  }
  return io;
};
