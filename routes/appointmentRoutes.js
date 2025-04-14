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

<<<<<<< HEAD
=======
// Log for deleting an appointment with auth middleware
router.delete("/", (req, res, next) => {
  console.log("Incoming DELETE /api/appointments with body:", req.body);
  next();
}, verifyAdminToken, deleteAppointment); // <- Secure with token
>>>>>>> refs/remotes/origin/main

export default router;