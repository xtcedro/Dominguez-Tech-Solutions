import { db } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const SITE_KEY = process.env.SITE_KEY;

export const submitContactMessage = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  try {
    await db.execute(
      `INSERT INTO contact_messages (site_key, name, email, phone, message, submitted_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [SITE_KEY, name, email, phone || null, message]
    );

    res.status(200).json({ message: "Message submitted successfully." });
  } catch (error) {
    console.error("❌ Error submitting contact message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchContactMessages = async (req, res) => {
  try {
    const [messages] = await db.execute(
      `SELECT * FROM contact_messages 
       WHERE site_key = ? 
       ORDER BY submitted_at DESC`,
      [SITE_KEY]
    );

    console.log(`📦 Retrieved ${messages.length} contact messages.`);
    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error fetching contact messages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteContactMessage = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Contact message ID is required." });
  }

  try {
    const [result] = await db.execute(
      `DELETE FROM contact_messages WHERE id = ? AND site_key = ?`,
      [id, SITE_KEY]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Message not found." });
    }

    res.status(200).json({ message: "Contact message deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting contact message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};