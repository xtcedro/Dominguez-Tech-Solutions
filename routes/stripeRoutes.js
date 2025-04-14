// routes/stripeRoutes.js
import express from 'express';
import {
  createPaymentIntent,
  fetchTransactions
} from '../controllers/stripeController.js';

const router = express.Router();

// ✅ Create a Stripe Payment Intent
router.post('/create-payment-intent', (req, res, next) => {
  console.log("💳 POST /api/stripe/create-payment-intent hit");
  next();
}, createPaymentIntent);

// ✅ Fetch recent Stripe transactions
router.get('/transactions', (req, res, next) => {
  console.log("📄 GET /api/stripe/transactions hit");
  next();
}, fetchTransactions);

export default router;
