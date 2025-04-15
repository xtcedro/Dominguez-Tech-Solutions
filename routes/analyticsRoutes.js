// routes/analyticsRoutes.js
import express from "express";
import { getSiteAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// Route: GET /api/analytics
router.get("/", async (req, res, next) => {
  console.log("🔍 [Analytics] Request received at /api/analytics");
  console.log("🕵️‍♂️ Verifying analytics route execution...");

  try {
    await getSiteAnalytics(req, res);
    console.log("✅ [Analytics] Successfully handled analytics request");
  } catch (err) {
    console.error("❌ [Analytics] Error occurred in analytics route:", err.message);
    next(err); // Forward to error handler middleware if defined
  }
});

export default router;