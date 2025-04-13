import express from 'express';
import { createPaymentIntent } from '../controllers/stripeController.js';

const router = express.Router();

// ✅ Use the Stripe controller function
router.post('/create-payment-intent', createPaymentIntent);

export default router;