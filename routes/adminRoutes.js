// /routes/adminRoutes.js
import express from "express";
import { adminLogin, changeAdminPassword } from "../controllers/adminController.js";
import { verifyAdminToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Login Route (with timestamp logging)
router.post("/login", (req, res, next) => {
  console.log(`🛂 /api/admin/login hit at ${new Date().toISOString()}`);
  next();
}, adminLogin);

// Protected Change Password Route
router.post("/change-password", verifyAdminToken, changeAdminPassword);

export default router;
