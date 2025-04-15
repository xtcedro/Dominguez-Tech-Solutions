// controllers/analyticsController.js
import mysql from "mysql2/promise";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.ADMIN_DB_HOST,
  user: process.env.ADMIN_DB_USER,
  password: process.env.ADMIN_DB_PASSWORD,
  database: process.env.ADMIN_DB_NAME,
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * GET /api/analytics
 * Returns dashboard statistics for appointments, blogs, messages, and transactions
 */
export const getSiteAnalytics = async (req, res) => {
  console.log("📈 GET /api/analytics hit");

  try {
    const db = await mysql.createConnection(dbConfig);

    const [[{ totalAppointments }]] = await db.execute(
      "SELECT COUNT(*) AS totalAppointments FROM appointments"
    );
    const [[{ totalBlogs }]] = await db.execute(
      "SELECT COUNT(*) AS totalBlogs FROM blogs"
    );
    const [[{ totalMessages }]] = await db.execute(
      "SELECT COUNT(*) AS totalMessages FROM contact_messages"
    );

    await db.end();

    // Fetch Stripe transactions
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