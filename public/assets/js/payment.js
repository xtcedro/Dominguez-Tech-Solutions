let stripePublicKey = "";

// Step 1: Fetch public key from backend
async function fetchPublicKey() {
  try {
    const res = await fetch("/api/stripe/public-key");
    const data = await res.json();
    stripePublicKey = data.publicKey;

    if (!stripePublicKey) {
      throw new Error("Stripe public key not found.");
    }

    initializePaymentFlow(stripePublicKey);
  } catch (err) {
    document.getElementById("payment-message").textContent =
      "❌ Unable to load payment form.";
    console.error("Stripe Key Fetch Error:", err.message);
  }
}

function initializePaymentFlow(publicKey) {
  const stripe = Stripe(publicKey);
  const elements = stripe.elements();

  const cardElement = elements.create("card");
  cardElement.mount("#card-element");

  const paymentRequest = stripe.paymentRequest({
    country: "US",
    currency: "usd",
    total: {
      label: "Heavenly Roofing LLC",
      amount: 0, // dynamically set
    },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  const prButton = elements.create("paymentRequestButton", {
    paymentRequest,
  });

  paymentRequest.canMakePayment().then((result) => {
    if (result) {
      prButton.mount("#payment-request-button");
    } else {
      document.getElementById("payment-request-button").style.display = "none";
    }
  });

  const paymentForm = document.getElementById("payment-form");
  const amountInput = document.getElementById("payment-amount");
  const payButton = document.getElementById("payment-button");
  const messageBox = document.getElementById("payment-message");

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
}

// Initialize
fetchPublicKey();