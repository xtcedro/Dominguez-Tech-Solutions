import express from "express";
import { chatController } from "../controllers/chatController.js";

const router = express.Router();

// User sends a new message -> AI responds and stores in DB
router.post("/", chatController);

// Fetch chat history

export default router;
