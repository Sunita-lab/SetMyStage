import express from "express";
import { getOrganizerStats, getAdminStats, getAttendeeStats } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/organizer", protect, authorize("organizer", "admin"), getOrganizerStats);
router.get("/attendee", protect, getAttendeeStats);
router.get("/admin", protect, authorize("admin"), getAdminStats);

export default router;