const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use TLS

  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },

  tls: {
    rejectUnauthorized: false
  },

  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000

});

// Verify connection on startup
transporter.verify(function (error, success) {

  if (error) {
    console.error("❌ Mail server connection failed:", error);
  } else {
    console.log("✅ Mail server ready to send messages");
  }

});

module.exports = transporter;