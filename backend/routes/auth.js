const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Otp = require("../models/Otp");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


// ================= LOGIN (GENERATE OTP) =================
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
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCase: false,
      alphabets: false,
      specialChars: false
    });

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    // Send response first
    res.json({ message: "OTP sent" });

    // Send email in background
    const transporter = require("../config/mail");

    transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your Login OTP",
      html: `<h2>Your OTP Code</h2><h1>${otp}</h1>`
    })
    .then(() => console.log("OTP email sent"))
    .catch(err => console.log("Email error:", err));

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
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

    // ✅ Create JWT Token AFTER OTP verification
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Delete OTP after success
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
    console.error(error);
    res.status(500).send("Server error");
  }
});


module.exports = router;