import express from "express";
import {
  createEvent,
  getEvents,
  getEventBySlug,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/:slug", getEventBySlug);

router.post("/", protect, authorize("organizer", "admin"), createEvent);
router.put("/:id", protect, authorize("organizer", "admin"), updateEvent);
router.delete("/:id", protect, authorize("organizer", "admin"), deleteEvent);

export default router;