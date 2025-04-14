// payment.js

const stripe = Stripe(
  "pk_live_51QsBMaB2ZF7d2k3EpiLM1QRwI3s2RL2PJl57Ctkl0tAxouh6kcP9F580Iyo3eW6qVTGix5f6eQdXNHmMgOxyO2Td00KiYFudmT"
);

const elements = stripe.elements();
const card = elements.create("card", {
  style: {
    base: {
      color: "#f4f4f4",
      fontFamily: "'Segoe UI', Tahoma, sans-serif",
      fontSize: "16px",
      "::placeholder": {
        color: "#aaa",
      },
    },
    invalid: {
      color: "#ff6b6b",
      iconColor: "#ff6b6b",
    },
  },
});
card.mount("#card-element");

const form = document.getElementById("payment-form");
const messageEl = document.getElementById("payment-message");
const amountInput = document.getElementById("payment-amount");

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageEl.textContent = "Processing payment...";

  const amount = parseFloat(amountInput.value) * 100; // Convert to cents
  if (isNaN(amount) || amount <= 0) {
    messageEl.textContent = "Please enter a valid amount.";
    return;
  }

  try {
    // Create a PaymentIntent on the server
    const res = await fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(amount) }),
    });

    const data = await res.json();

    if (!res.ok) {
      messageEl.textContent = data.error || "Failed to create payment intent.";
      return;
    }

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: card,
      },
    });

    if (result.error) {
      messageEl.textContent = `❌ ${result.error.message}`;
    } else if (result.paymentIntent.status === "succeeded") {
      messageEl.textContent = "✅ Payment successful! Thank you.";
      form.reset();
      card.clear();
    }
  } catch (err) {
    console.error("Payment Error:", err);
    messageEl.textContent = "An error occurred while processing payment.";
  }
});

// Payment Request Button (for Apple Pay, Google Pay, etc.)
const prButton = stripe.paymentRequest({
  country: "US",
  currency: "usd",
  total: {
    label: "Dominguez Tech Payment",
    amount: 1999, // Default example amount
  },
  requestPayerName: true,
  requestPayerEmail: true,
});

prButton.canMakePayment().then((result) => {
  if (result) {
    const prElement = elements.create("paymentRequestButton", {
      paymentRequest: prButton,
    });
    prElement.mount("#payment-request-button");
  } else {
    document.getElementById("payment-request-button").style.display = "none";
  }
});