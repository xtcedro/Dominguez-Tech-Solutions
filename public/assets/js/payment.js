const stripe = Stripe("pk_live_51QsBMaB2ZF7d2k3EpiLM1QRwI3s2RL2PJl57Ctkl0tAxouh6kcP9F580Iyo3eW6qVTGix5f6eQdXNHmMgOxyO2Td00KiYFudmT");
const elements = stripe.elements();

// Card Element
const cardElement = elements.create("card");
cardElement.mount("#card-element");

// Payment Request Button (Apple Pay, Google Pay, Cash App)
const paymentRequest = stripe.paymentRequest({
  country: "US",
  currency: "usd",
  total: {
    label: "Dominguez Tech Solutions",
    amount: 0, // Will be updated dynamically
  },
  requestPayerName: true,
  requestPayerEmail: true,
});

const prButton = elements.create("paymentRequestButton", {
  paymentRequest,
});

// Check support and mount
paymentRequest.canMakePayment().then((result) => {
  if (result) {
    prButton.mount("#payment-request-button");
  } else {
    document.getElementById("payment-request-button").style.display = "none";
  }
});

// DOM Elements
const paymentForm = document.getElementById("payment-form");
const amountInput = document.getElementById("payment-amount");
const payButton = document.getElementById("payment-button");
const messageBox = document.getElementById("payment-message");

// Handle Payment Form Submission
paymentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = parseFloat(amountInput.value) * 100;
  if (isNaN(amount) || amount <= 0) {
    messageBox.textContent = "❌ Please enter a valid amount.";
    return;
  }

  payButton.disabled = true;
  messageBox.textContent = "Processing payment...";

  try {
    const res = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const { clientSecret } = await res.json();

    // Payment Request (Tap-to-pay)
    paymentRequest.on("paymentmethod", async (event) => {
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: event.paymentMethod.id,
      });

      if (error) {
        event.complete("fail");
        messageBox.textContent = `❌ ${error.message}`;
      } else {
        event.complete("success");
        messageBox.textContent = "✅ Payment successful!";
      }
    });

    // Traditional card method
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      messageBox.textContent = `❌ ${error.message}`;
      payButton.disabled = false;
    } else if (paymentIntent.status === "succeeded") {
      messageBox.textContent = "✅ Thank you for your payment!";
    }
  } catch (err) {
    messageBox.textContent = `❌ ${err.message}`;
    payButton.disabled = false;
  }
});