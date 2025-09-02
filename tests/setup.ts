// Test setup file
import { PrismaClient } from "@prisma/client";

// Global test database
let prisma: PrismaClient;

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
});

afterAll(async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});

export { prisma };
