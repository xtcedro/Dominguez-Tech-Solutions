import express from "express";
import { submitAppointment, fetchAppointments, deleteAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

// Appointment submission route
router.post("/", submitAppointment);

// Fetch all appointments route
router.get("/", fetchAppointments);

router.get("/", deleteAppointment);

export default router;
