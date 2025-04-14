import express from "express";
import {
  submitAppointment,
  fetchAppointments
} from "../controllers/appointmentController.js";
import { verifyAdminToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route for submitting an appointment
router.post("/", submitAppointment);

// Protected route for fetching all appointments
router.get("/", verifyAdminToken, fetchAppointments);

export default router;