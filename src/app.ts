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

// create log for production to seeif prisma and redis are connected
console.log("Starting server...");
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${PORT}`);
console.log(`Database URL: ${process.env.DATABASE_URL}`);
console.log(`Redis URL: ${process.env.REDIS_URL}`);
console.log(`JWT Secret: ${process.env.JWT_SECRET ? "Set" : "Not Set"}`);
console.log(`prima create client try...`);
const prisma = new PrismaClient();
console.log(`prima create client try... done`);

console.log(`redis create client try...`);
export const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
console.log(`redis create client try... done`);
// Middleware
console.log(`app log on middleware...`);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
console.log(`app log on middleware... done`);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Routes
console.log(`app log on routes...`);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
console.log(`app log on routes... done`);

// Error handling
console.log(`app log on error handling...`);
app.use(errorHandler);
console.log(`app log on error handling... done`);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
async function startServer() {
  try {
    // try connecting to redis with try catch block
    console.log(`Connecting to Redis...`);
    redis.on("error", (err) => {
      console.error("Redis Client Error", err);
      process.exit(1);
    });
    await redis.connect();
    console.log(`Connecting to Redis... done`);
    console.log("Connected to Redis");

    console.log(`Connecting to PostgreSQL...`);
    await prisma.$connect();
    console.log(`Connecting to PostgreSQL... done`);
    console.log("Connected to PostgreSQL");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

export default app;
