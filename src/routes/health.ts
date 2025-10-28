import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

const router = Router();
const prisma = new PrismaClient();
const redis = createClient({ url: process.env.REDIS_URL });

let redisReady = false;
redis.on("ready", () => {
  redisReady = true;
});
redis.on("error", () => {
  redisReady = false;
});

// (async () => {
//   try {
//     if (!redis.isOpen) await redis.connect();
//   } catch (e) {
//     console.log("Redis connection error in health check route:");
//   }
// })();

router.get("/", async (_req, res) => {
  const start = Date.now();

  const checks: Record<string, { ok: boolean; details?: string }> = {
    postgres: { ok: false },
    valkey: { ok: redisReady },
  };

  // connect to redis if not connected
  if (!redis.isOpen) {
    try {
      await redis.connect();
    } catch (e) {
      console.log("Redis connection error in health check route:");
    }
  }

  // Check Postgres
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.postgres.ok = true;
  } catch (e: any) {
    checks.postgres.details = e?.message;
  }

  // Check Valkey/Redis
  if (!checks.valkey.ok) {
    try {
      await redis.ping();
      checks.valkey.ok = true;
    } catch (e: any) {
      checks.valkey.details = e?.message;
    }
  }

  // close redis connection if it was not open before
  if (!redisReady && redis.isOpen) {
    await redis.disconnect();
  }

  const allOk = Object.values(checks).every((c) => c.ok);
  const payload = {
    status: allOk ? "ok" : "degraded",
    uptimeSec: process.uptime(),
    responseTimeMs: Date.now() - start,
    env: process.env.NODE_ENV ?? "unknown",
    version: process.env.npm_package_version,
    gitSha: process.env.GIT_SHA ?? null,
    checks,
  };

  res.status(allOk ? 200 : 503).json(payload);
});

export default router;
