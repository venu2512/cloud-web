

const sendOtpEmail = async ({ to, otp }) => {

const apiKey = process.env.re_DjqCNHJa_8gpmpfpzDqBrs7JTaNedSksZ;

if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("Missing EMAIL_FROM environment variable");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      `,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Resend API error: ${response.status} ${responseText}`);
  }
};

module.exports = { sendOtpEmail };