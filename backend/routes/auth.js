const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Otp = require("../models/Otp");
const { sendOtpEmail } = require("../config/mail");

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

    // Save OTP
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    // 👉 EMAIL SEND
    try {
      await sendOtpEmail({ to: email, otp });
      console.log(`✅ OTP email sent to ${email}`);

      return res.json({ message: "OTP sent to your email" });

    } catch (err) {
      console.error("❌ Email failed:", err.message);

      if (process.env.ALLOW_OTP_LOGIN_WITHOUT_EMAIL === "true") {
        const debugOtp = process.env.DEBUG_OTP === "true";
        
        console.warn(`⚠️ OTP fallback enabled for ${email}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📧 Email: ${email}`);
        console.log(`🔐 OTP:   ${otp}`);
        console.log(`⏰ Expires in 5 minutes`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        const response = {
          message: "OTP generated. Check server logs.",
          deliveryMode: "log_fallback",
        };

        if (debugOtp) {
          response.otp = otp;
          response.message = "OTP generated (debug mode)";
        }

        return res.json(response);
      }

      await Otp.deleteMany({ email });

      return res.status(500).json({
        message: err.message.includes("testing mode")
          ? "Resend is in testing mode. Use your email or verify domain."
          : "Failed to send OTP email",
      });
    }

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Server error"
    });
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

    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;