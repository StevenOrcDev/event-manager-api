// Test setup file
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

// Global test database
let prisma: PrismaClient;
let redis: ReturnType<typeof createClient>;

beforeAll(async () => {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url:
          process.env.DATABASE_URL ||
          "postgresql://postgres:postgres@localhost:5432/event_manager_test",
      },
    },
  });

  redis = createClient({ url: process.env.REDIS_URL });
  if (!redis.isOpen) await redis.connect();
});

afterAll(async () => {
  if (redis && redis.isOpen) {
    await redis.quit();
  }

  if (prisma) {
    await prisma.$disconnect();
  }
});

export { prisma };
