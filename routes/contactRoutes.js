// routes/contactRoutes.js
import express from "express";
import {
  submitContactMessage,
  fetchContactMessages
} from "../controllers/contactController.js";

const router = express.Router();

// Log and handle contact form submission
router.post("/", (req, res, next) => {
  console.log("📨 Incoming POST /api/contact");
  console.log("📝 Payload:", req.body);
  next();
}, submitContactMessage);

// Log and fetch all contact messages (admin use)
router.get("/", (req, res, next) => {
  console.log("📬 GET /api/contact - Fetching contact inquiries");
  next();
}, fetchContactMessages);

export default router;