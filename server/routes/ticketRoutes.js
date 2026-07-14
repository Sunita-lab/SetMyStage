import express from "express";
import { createTicket, getTicketsForEvent } from "../controllers/ticketController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", getTicketsForEvent);
router.post("/", protect, authorize("organizer", "admin"), createTicket);

export default router;