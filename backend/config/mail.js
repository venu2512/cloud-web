const getMailConfig = () => {
  const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_KEY;
  const from = process.env.EMAIL_FROM || process.env.RESEND_FROM;

  return { apiKey, from };
};

const sendOtpEmail = async ({ to, otp }) => {
  const { apiKey, from } = getMailConfig();

  if (!apiKey) {
    throw new Error(
      "Missing Resend API key. Set RESEND_API_KEY (preferred) or RESEND_KEY"
    );
  }

  if (!from) {
    throw new Error(
      "Missing sender email. Set EMAIL_FROM (preferred) or RESEND_FROM"
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  let response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        subject: "Your OTP Code",
        html: `
          <h2>Your OTP Code</h2>
          <p>Your verification code is:</p>
          <h1>${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        `
      }),
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Resend API timeout after 10 seconds");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Resend API error: ${response.status} ${responseText}`);
  }
};

module.exports = { sendOtpEmail, getMailConfig };