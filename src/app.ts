import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { authRoutes } from "./routes/auth";
import { eventRoutes } from "./routes/events";
import { userRoutes } from "./routes/users";

const app = express();
const PORT = process.env.PORT || 3000;

// Database & Cache
export const prisma = new PrismaClient();
export const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
async function startServer() {
  try {
    // Connect to Redis
    await redis.connect();
    logger.info("Connected to Redis");

    // Connect to Database
    await prisma.$connect();
    logger.info("Connected to PostgreSQL");

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down gracefully...");
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

export default app;
