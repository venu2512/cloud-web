const nodemailer = require("nodemailer");

const hasSmtpConfig =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  : null;

const sendOtpEmail = async ({ to, otp }) => {
  if (!transporter) {
    console.warn(`⚠️ SMTP not configured. OTP for ${to}: ${otp}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || "CloudNova <no-reply@cloudnova.local>",
    to,
    subject: "Your Login OTP - CloudNova",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px;">
        <h2 style="color:#0050FF;">CloudNova</h2>
        <p>Your one-time login password is:</p>
        <h1 style="font-size:48px; letter-spacing:8px; color:#00C8FF; text-align:center;">
          ${otp}
        </h1>
        <p style="color:#666;">This OTP expires in <strong>5 minutes</strong>.</p>
        <p style="color:#999; font-size:12px;">
          If you didn't request this login, please ignore this email.
        </p>
      </div>
    `
  });
};

module.exports = { sendOtpEmail };