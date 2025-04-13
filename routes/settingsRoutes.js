import express from "express";
import { getSiteSettings, updateSiteSettings } from "../controllers/settingsController.js";

const router = express.Router();

// GET /api/settings
router.get("/", (req, res, next) => {
  console.log("📥 GET /api/settings hit");
  getSiteSettings(req, res, next);
});

// POST /api/settings
router.post("/", (req, res, next) => {
  console.log("🛠️ POST /api/settings hit");
  console.log("🔧 Incoming Payload:", req.body);
  updateSiteSettings(req, res, next);
});

export default router;