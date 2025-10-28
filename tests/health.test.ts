import request from "supertest";
import app from "../src/app";

import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });

describe("Health Check", () => {
  afterAll(async () => {
    if (redis.isOpen) await redis.quit();
  });

  it("should return 404 for unknown routes", async () => {
    const response = await request(app).get("/nonexistent").expect(404);

    expect(response.body).toHaveProperty("error", "Route not found");
  });
});
