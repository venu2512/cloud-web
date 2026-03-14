const { Resend } = require("resend");

const apiKey = process.env.re_DjqCNHJa_8gpmpfpzDqBrs7JTaNedSksZ;

const sendOtpEmail = async ({ to, otp }) => {
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("Missing EMAIL_FROM environment variable");
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your OTP Code",
    html: `
      <h2>Your OTP Code</h2>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 5 minutes.</p>
    `,
  });
};

module.exports = { sendOtpEmail };