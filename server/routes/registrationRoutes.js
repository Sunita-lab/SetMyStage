import express from "express";
import { registerForEvent, getMyRegistrations, checkInAttendee } from "../controllers/registrationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { exportAttendance } from "../controllers/registrationController.js";

const router = express.Router();

router.post("/", protect, registerForEvent);
router.get("/my", protect, getMyRegistrations);
router.post("/checkin", protect, authorize("organizer", "admin"), checkInAttendee);
router.get("/event/:eventId/export", protect, authorize("organizer", "admin"), exportAttendance);
export default router;