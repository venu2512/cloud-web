const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Otp = require("../models/Otp");
const transporter = require("../config/mail");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {

    console.error("Register Error:", error);

    res.status(500).json({ message: "Server error" });

  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove old OTP
    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    // Respond immediately
    res.json({ message: "OTP sent to your email" });

    // Send email in background
    const mailOptions = {
      from: `"NimbuCloud" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Login OTP - NimbuCloud",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px;">
          <h2 style="color:#0050FF;">NimbuCloud</h2>
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
    };

    transporter.sendMail(mailOptions)
      .then(() => {
        console.log(`✅ OTP email sent to ${email}`);
      })
      .catch((err) => {
        console.error("❌ Email failed:", err.message);
      });

  } catch (error) {

    console.error("Login Error:", error);

    res.status(500).json({ message: "Server error" });

  }

});

// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {

  try {

    const { email, otp } = req.body;

    const validOtp = await Otp.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (!validOtp) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    const user = await User.findOne({ email });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await Otp.deleteMany({ email });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error("OTP Verify Error:", error);

    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;