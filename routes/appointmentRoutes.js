import express from "express";
import {
  submitAppointment,
  fetchAppointments,
  deleteAppointment
} from "../controllers/appointmentController.js";
import { verifyAdminToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Log for incoming appointment submission
router.post("/", (req, res, next) => {
  console.log("Incoming POST /api/appointments");
  next();
}, submitAppointment);

// Log for fetching appointments
router.get("/", (req, res, next) => {
  console.log("Incoming GET /api/appointments");
  next();
}, fetchAppointments);


export default router;
