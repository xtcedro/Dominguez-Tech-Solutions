// /middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware to verify JWT token for protected admin routes
 */
export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Optional: attach admin info to request
    next();
  } catch (error) {
    console.error("Invalid JWT token:", error.message);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};