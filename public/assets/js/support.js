const stripe = Stripe("pk_live_51QsBMaB2ZF7d2k3EpiLM1QRwI3s2RL2PJl57Ctkl0tAxouh6kcP9F580Iyo3eW6qVTGix5f6eQdXNHmMgOxyO2Td00KiYFudmT"); // Replace with your Stripe Public Key
const elements = stripe.elements();
const cardElement = elements.create("card");
cardElement.mount("#card-element");

const donationForm = document.getElementById("donation-form");
const donationAmountInput = document.getElementById("donation-amount");
const donateButton = document.getElementById("donate-button");
const paymentMessage = document.getElementById("payment-message");

donationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const amount = parseFloat(donationAmountInput.value) * 100; // Convert to cents

    if (isNaN(amount) || amount <= 0) {
        paymentMessage.textContent = "❌ Please enter a valid donation amount.";
        return;
    }

    donateButton.disabled = true; // Prevent multiple clicks
    paymentMessage.textContent = "Processing donation...";

    // ✅ Create a Payment Intent from the backend
    const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }) // Send donation amount
    });

    const { clientSecret } = await response.json();

    // ✅ Confirm payment with Stripe Elements
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
    });

    if (error) {
        paymentMessage.textContent = `❌ Payment failed: ${error.message}`;
        donateButton.disabled = false;
    } else if (paymentIntent.status === "succeeded") {
        paymentMessage.textContent = "✅ Thank you for your support!";
    }
});
