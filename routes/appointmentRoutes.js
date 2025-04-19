import express from "express";
import {
  submitAppointment,
  fetchAppointments,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { verifyAdminToken } from "../middleware/authMiddleware.js";

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

router.delete(
  "/:id",
  verifyAdminToken,
  (req, res, next) => {
    console.log("🗑️ Authenticated DELETE /api/appointments/:id with ID:", req.params.id);
    next();
  },
  deleteAppointment
);


export default router;