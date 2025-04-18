import express from "express";
import {
  submitAppointment,
  fetchAppointments,
  deleteAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Public: Submit appointment
router.post("/", (req, res, next) => {
  console.log("📬 Incoming POST /api/appointments");
  next();
}, submitAppointment);

// Public: Fetch appointments
router.get("/", (req, res, next) => {
  console.log("📥 Incoming GET /api/appointments");
  next();
}, fetchAppointments);

// Temporary: Unprotected delete route
router.delete("/:id", (req, res, next) => {
  console.log("🗑️ Incoming DELETE /api/appointments/:id with ID:", req.params.id);
  next();
}, deleteAppointment);

export default router;