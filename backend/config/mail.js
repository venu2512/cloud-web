const normalizeEnvValue = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().replace(/^["']|["']$/g, "");
};

const getMailConfig = () => {
  const apiKey = normalizeEnvValue(process.env.RESEND_API_KEY);
  const from = normalizeEnvValue(process.env.EMAIL_FROM) || "onboarding@resend.dev";

  return { apiKey, from };
};

const sendViaResend = async ({ apiKey, from, to, otp }) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Your OTP Code",
      html: `
        <div style="font-family:sans-serif;text-align:center;">
          <h2>🔐 OTP Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="color:blue;">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const text = await response.text();

    if (response.status === 403) {
      throw new Error(
        "Resend error: You are in testing mode. Use onboarding@resend.dev OR verify your domain."
      );
    }

    throw new Error(`Resend API error: ${response.status} ${text}`);
  }

  return await response.json();
};

const sendOtpEmail = async ({ to, otp }) => {
  const { apiKey, from } = getMailConfig();

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY in environment variables");
  }

  return await sendViaResend({ apiKey, from, to, otp });
};

module.exports = { sendOtpEmail };