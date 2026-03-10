const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "venu25122005@gmail.com",
    pass: "xqjmgzsjuygbkyty",
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = transporter;