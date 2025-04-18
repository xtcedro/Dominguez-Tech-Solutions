import { db } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const SITE_KEY = process.env.SITE_KEY;

// Submit an appointment
export const submitAppointment = async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    if (!name || !phone || !email || !service) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled." });
    }

    const [result] = await db.execute(
      `INSERT INTO appointments 
      (name, phone, email, service, message, created_at, site_key)
      VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [name, phone, email, service, message, SITE_KEY]
    );

    res.status(201).json({
      message: "Appointment submitted successfully!",
      appointmentId: result.insertId,
    });
  } catch (error) {
    console.error("Error submitting appointment:", error);
    res.status(500).json({ error: "Failed to submit appointment" });
  }
};

// Fetch all appointments (filter by site_key)
export const fetchAppointments = async (req, res) => {
  try {
    const [appointments] = await db.execute(
      "SELECT * FROM appointments WHERE site_key = ? ORDER BY created_at DESC",
      [SITE_KEY]
    );

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Delete appointment (site_key constraint is optional for multi-tenant security)
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Appointment ID is required" });
  }

  try {
    const [result] = await db.execute(
      "DELETE FROM appointments WHERE id = ? AND site_key = ?",
      [id, SITE_KEY]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};