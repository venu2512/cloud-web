const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000
});

transporter.verify((error) => {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email server ready");
  }
});

module.exports = transporter;