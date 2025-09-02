import { Router } from "express";

export const eventRoutes = Router();

// GET /api/events
eventRoutes.get("/", (req, res) => {
  res.json({ message: "Get events - TODO", events: [] });
});

// GET /api/events/:id
eventRoutes.get("/:id", (req, res) => {
  res.json({ message: `Get event ${req.params.id} - TODO` });
});

// POST /api/events
eventRoutes.post("/", (req, res) => {
  res.json({ message: "Create event - TODO" });
});

// PUT /api/events/:id
eventRoutes.put("/:id", (req, res) => {
  res.json({ message: `Update event ${req.params.id} - TODO` });
});

// DELETE /api/events/:id
eventRoutes.delete("/:id", (req, res) => {
  res.json({ message: `Delete event ${req.params.id} - TODO` });
});
