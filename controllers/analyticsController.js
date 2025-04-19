import { db } from "../config/db.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SITE_KEY = process.env.SITE_KEY;

/**
 * GET /api/analytics
 * Returns dashboard statistics for appointments, blogs, messages, and transactions
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

    const payments = await stripe.paymentIntents.list({ limit: 100 });
    const totalTransactions = payments.data.length;

    res.status(200).json({
      totalAppointments,
      totalBlogs,
      totalMessages,
      totalTransactions,
    });
  } catch (error) {
    console.error("❌ Analytics error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};