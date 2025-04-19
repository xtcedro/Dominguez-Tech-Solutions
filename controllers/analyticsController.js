import { db } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const SITE_KEY = process.env.SITE_KEY;

/**
 * GET /api/analytics
 * Returns dashboard statistics for appointments, blogs, and contact messages
 */
export const getSiteAnalytics = async (req, res) => {
  console.log("📈 GET /api/analytics hit");

  try {
    const [[{ totalAppointments }]] = await db.execute(
      "SELECT COUNT(*) AS totalAppointments FROM appointments WHERE site_key = ?",
      [SITE_KEY]
    );

    const [[{ totalBlogs }]] = await db.execute(
      "SELECT COUNT(*) AS totalBlogs FROM blogs WHERE site_key = ?",
      [SITE_KEY]
    );

    const [[{ totalMessages }]] = await db.execute(
      "SELECT COUNT(*) AS totalMessages FROM contact_messages WHERE site_key = ?",
      [SITE_KEY]
    );

    res.status(200).json({
      totalAppointments,
      totalBlogs,
      totalMessages
    });
  } catch (error) {
    console.error("❌ Analytics error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};