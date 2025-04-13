import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config(); // Load environment variables

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-01-27.acacia', // Ensure correct Stripe API version
});

export default stripe;