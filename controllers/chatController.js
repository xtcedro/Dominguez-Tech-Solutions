import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatController = async (req, res) => {
    try {
        const { message } = req.body || {}; // Handle empty requests

        // System prompt: AI identity and behavior
        const systemPrompt = `
        You are Dominguez Tech Solutions AI Assistant, an expert in AI, web development, and business automation.
        Stay professional, concise, and helpful. Ensure all responses reflect the following **accurate pricing**:

        🎓 **AI & Web Development Crash Course:**
        - 💰 **One-time fee:** $69 per person
        - ✅ Includes course materials, real-world projects, and lifetime access to resources.
        - 📍 **Location:** Downtown Oklahoma City Metropolitan Library
        - 📅 **Reserve your seat now:**
          <a href="https://www.domingueztechsolutions.com/appointment-booker.html" target="_blank" style="color: #FFD700; text-decoration: underline;">
          www.domingueztechsolutions.com/appointment-booker.html</a>

        📌 **Website Development Packages:**
        - 🚀 **Starter:** $100 (Fully responsive design, basic SEO)
        - 💼 **Business:** $200 (Advanced SEO, secure user accounts, email verification)
        - 🏆 **Enterprise:** $300 (Premium SEO, E-Commerce, Stripe/PayPal integration)

        💡 **Custom Development:**
        For specialized website features, pricing is based on project scope. Users should contact Dominguez Tech Solutions for a custom quote.

        ✉️ **For inquiries, contact us at:**
        <a href="mailto:domingueztechsolutions@gmail.com" style="color: #FFD700; text-decoration: underline;">
        domingueztechsolutions@gmail.com</a>

        **Important:** The **Appointment Booker** is **only** for enrolling in the AI & Web Development Crash Course.
        For other services, users must **email or request a custom quote**.
        `;

        // If no message is sent (first interaction), return a professional and structured introduction
        if (!message) {
            return res.json({
                reply: `
                <b>Welcome to Dominguez Tech Solutions! 🚀</b><br><br>
                I’m your AI assistant, here to help with <b>AI integration, web development, and business automation.</b><br><br>

                🎓 <b>Join the AI & Web Development Crash Course!</b> Secure your seat for <b>$69</b>.<br>
                📍 <b>Location:</b> Downtown Oklahoma City Metropolitan Library<br>
                📅 <b>Reserve now:</b>
                <a href="https://www.domingueztechsolutions.com/appointment-booker.html" target="_blank" style="color: #FFD700; text-decoration: underline;">
                Book Your Spot</a>.<br><br>

                📩 <b>Need a website?</b> Get a professional site starting at <b>$100</b>.<br>
                💡 <b>For inquiries, email:</b>
                <a href="mailto:domingueztechsolutions@gmail.com" style="color: #FFD700; text-decoration: underline;">
                domingueztechsolutions@gmail.com</a>.<br><br>

                <b>How can I assist you today? 😊</b>
                `
            });
        }

        // Process user messages
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const chat = await model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 1000, // Limits response length
                temperature: 0.7, // Adjusts creativity level
            },
        });

        const response = await chat.sendMessage([systemPrompt, message]);
        const botReply = response.response.text();

        res.json({ reply: botReply });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI processing failed. Please try again later." });
    }
};
