import stripe from '../config/stripe.js';

/**
 * ✅ Create a Payment Intent (Handles client payment requests)
 */
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ['card'],
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Stripe Payment Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const fetchStripeTransactions = async (req, res) => {
  try {
    const payments = await stripe.paymentIntents.list({
      limit: 10, // Adjust the limit as needed
    });

    const cleaned = payments.data.map((intent) => ({
      id: intent.id,
      amount: intent.amount,
      created: intent.created,
      status: intent.status,
      payment_method_types: intent.payment_method_types,
    }));

    res.status(200).json(cleaned);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err.message);
    res.status(500).json({ error: "Unable to fetch transactions" });
  }
};