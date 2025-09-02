import { Router } from "express";

export const authRoutes = Router();

// POST /api/auth/register
authRoutes.post("/register", (req, res) => {
  res.json({ message: "Register endpoint - TODO" });
});

// POST /api/auth/login
authRoutes.post("/login", (req, res) => {
  res.json({ message: "Login endpoint - TODO" });
});

// POST /api/auth/logout
authRoutes.post("/logout", (req, res) => {
  res.json({ message: "Logout endpoint - TODO" });
});
