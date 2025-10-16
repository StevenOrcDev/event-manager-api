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

const prisma = new PrismaClient();

export const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    status: "Server OK,running...",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

async function startServer() {
  try {
    redis.on("error", (err) => {
      logger.error("Redis Client Error", err);
      process.exit(1);
    });
    await redis.connect();
    logger.info("Connected to Redis");
    await prisma.$connect();
    logger.info("Connected to Prisma");

    app.listen(PORT, () => {});
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down server...");
  await prisma.$disconnect();
  logger.info("Disconnected from Prisma");
  await redis.quit();
  logger.info("Disconnected from Redis");
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

export default app;
