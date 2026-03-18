const BREVO_API_KEY = process.env.BREVO_API_KEY || "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";
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "noreply@yourdomain.com";
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "VMS Admin";

const sendViaBrevo = async ({ to, otp }) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: BREVO_SENDER_NAME,
        email: BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject: "Your OTP Code",
      htmlContent: `
        <div style="font-family:sans-serif;text-align:center;padding:20px;">
          <h2>🔐 OTP Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="color:#4F46E5;font-size:32px;letter-spacing:4px;">${otp}</h1>
          <p style="color:#666;">This code expires in <strong>5 minutes</strong>.</p>
          <hr style="margin:20px 0;">
          <p style="font-size:12px;color:#999;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Brevo API error: ${error.message || response.status}`);
  }

  return await response.json();
};

const sendOtpEmail = async ({ to, otp }) => {
  if (!BREVO_API_KEY) {
    throw new Error("Missing BREVO_API_KEY in environment variables");
  }
  return await sendViaBrevo({ to, otp });
};

module.exports = { sendOtpEmail };