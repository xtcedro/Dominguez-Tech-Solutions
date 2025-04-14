const stripe = Stripe("pk_live_51QsBMaB2ZF7d2k3EpiLM1QRwI3s2RL2PJl57Ctkl0tAxouh6kcP9F580Iyo3eW6qVTGix5f6eQdXNHmMgOxyO2Td00KiYFudmT");
const elements = stripe.elements();
const cardElement = elements.create("card");
cardElement.mount("#card-element");

// DOM Elements
const paymentForm = document.getElementById("payment-form");
const amountInput = document.getElementById("payment-amount");
const payButton = document.getElementById("payment-button");
const messageBox = document.getElementById("payment-message");

// Payment Request API Setup (Google Pay, Apple Pay, Cash App Pay)
const paymentRequest = stripe.paymentRequest({
  country: "US",
  currency: "usd",
  total: {
    label: "Dominguez Tech Solutions",
    amount: 0, // will be updated dynamically
  },
  requestPayerName: true,
  requestPayerEmail: true,
});

const prButton = elements.create("paymentRequestButton", { paymentRequest });

paymentRequest.canMakePayment().then((result) => {
  if (result) {
    prButton.mount("#payment-request-button");
  } else {
    document.getElementById("payment-request-button").style.display = "none";
  }
});

// Handle Form Submission
paymentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = parseFloat(amountInput.value) * 100;
  if (isNaN(amount) || amount <= 0) {
    messageBox.textContent = "❌ Please enter a valid amount.";
    return;
  }

  messageBox.textContent = "Processing payment...";
  payButton.disabled = true;

  try {
    const res = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const { clientSecret } = await res.json();

    // Handle native payment methods (Apple Pay, Google Pay, Cash App Pay)
    paymentRequest.on("paymentmethod", async (event) => {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
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

    // Handle traditional card method
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      messageBox.textContent = `❌ ${error.message}`;
      payButton.disabled = false;
    } else if (paymentIntent.status === "succeeded") {
      messageBox.textContent = "✅ Payment complete. Thank you!";
    }

  } catch (err) {
    console.error("❌ Payment error:", err);
    messageBox.textContent = "❌ Server error. Please try again.";
    payButton.disabled = false;
  }
});