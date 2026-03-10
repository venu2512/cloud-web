const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

transporter.verify((error) => {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email server ready");
  }
});

module.exports = transporter;