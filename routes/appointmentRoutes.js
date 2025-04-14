import express from "express";
import { submitAppointment, fetchAppointments } from "../controllers/appointmentController.js";

const router = express.Router();

// Appointment submission route
router.post("/", submitAppointment);

// Fetch all appointments route
router.get("/", fetchAppointments);

export default router;