import express from "express";
import {
  submitAppointment,
  fetchAppointments,
  deleteAppointment
} from "../controllers/appointmentController.js";
import { verifyAdminToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitAppointment);
router.get("/", verifyAdminToken, fetchAppointments);
router.delete("/:id", verifyAdminToken, deleteAppointment); // <-- new route

export default router;