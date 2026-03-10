const nodemailer = require("nodemailer");

res.json({ message: "OTP sent" });

try {
  const transporter = require("../config/mail");

  transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your Login OTP",
    html: `<h2>Your OTP Code</h2><h1>${otp}</h1>`
  })
  .then(() => console.log("OTP email sent"))
  .catch(err => console.log("Email error:", err));

} catch (mailError) {
  console.log("Mail service error:", mailError);
}