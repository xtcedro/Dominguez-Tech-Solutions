import express from "express";
import {
  submitContactMessage,
  fetchContactMessages,
  deleteContactMessage
} from "../controllers/contactController.js";
import { verifyAdminToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Submit contact form
router.post("/", (req, res, next) => {
  console.log("📨 Incoming POST /api/contact");
  console.log("📝 Payload:", req.body);
  next();
}, submitContactMessage);

// Admin: Fetch all contact messages
router.get("/", verifyAdminToken, (req, res, next) => {
  console.log("📬 Authenticated GET /api/contact - Fetching contact inquiries");
  next();
}, fetchContactMessages);

// Admin: Delete contact message
router.delete("/:id", verifyAdminToken, (req, res, next) => {
  console.log(`🗑️ Authenticated DELETE /api/contact/${req.params.id}`);
  next();
}, deleteContactMessage);

export default router;