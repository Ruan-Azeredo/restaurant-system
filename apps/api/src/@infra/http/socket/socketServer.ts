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
    socket.on("subscribe-order", async ({ job_id }: { job_id: string }) => {
      const room = `order:${job_id}`;
      socket.join(room);
      console.log(
        `[Socket.IO] Client ${socket.id} subscribed to room: ${room}`,
      );

      try {
        // Prevent race conditions where the job completes before the socket connects
        const { orderQueue } =
          await import("@application/services/queue/orderQueue");
        const job = await orderQueue.getJob(job_id);

        if (job) {
          const state = await job.getState();

          if (state === "completed") {
            const result = job.returnvalue;
            if (result && result.order) {
              socket.emit("order-result", {
                status: "confirm-order",
                order: result.order,
                order_products: result.order_products,
                ingredient_verification: result.ingredient_verification,
              });
            }
          } else if (state === "failed") {
            socket.emit("order-result", {
              status: "failed",
              reason: job.failedReason || "Unknown error occurred",
            });
          }
        }
      } catch (err) {
        console.error(
          `[Socket.IO] Error checking initial job status for ${job_id}:`,
          err,
        );
      }
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
    throw new Error(
      "[Socket.IO] Server not initialized. Call initSocketServer first.",
    );
  }
  return io;
};
