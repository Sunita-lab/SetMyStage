import express from "express";
import { registerForEvent, getMyRegistrations } from "../controllers/registrationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, registerForEvent);
router.get("/my", protect, getMyRegistrations);

export default router;