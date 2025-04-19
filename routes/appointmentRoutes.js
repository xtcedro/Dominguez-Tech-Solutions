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


export default router;