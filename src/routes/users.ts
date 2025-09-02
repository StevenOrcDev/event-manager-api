import { Router } from "express";

export const userRoutes = Router();

// GET /api/users/profile
userRoutes.get("/profile", (req, res) => {
  res.json({ message: "Get user profile - TODO" });
});

// PUT /api/users/profile
userRoutes.put("/profile", (req, res) => {
  res.json({ message: "Update user profile - TODO" });
});

// GET /api/users/:id
userRoutes.get("/:id", (req, res) => {
  res.json({ message: `Get user ${req.params.id} - TODO` });
});
