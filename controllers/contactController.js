// controllers/contactController.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.ADMIN_DB_HOST,
  user: process.env.ADMIN_DB_USER,
  password: process.env.ADMIN_DB_PASSWORD,
  database: process.env.ADMIN_DB_NAME,
};

export const submitContactMessage = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  try {
    const db = await mysql.createConnection(dbConfig);
    await db.execute(
      `INSERT INTO contact_messages (name, email, phone, message, submitted_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [name, email, phone || null, message]
    );
    await db.end();

    res.status(200).json({ message: "Message submitted successfully." });
  } catch (error) {
    console.error("Error submitting contact message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};