const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Otp = require("../models/Otp");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-please-change";

/** Generate 6-digit OTP */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/** ======================================================
 *  SEND OTP (NO EMAIL — returns OTP in response for dev)
 * ====================================================== */
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Remove previous OTPs
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({ email, otp, expiresAt });

    // 🚫 NO EMAIL — return OTP for development
    return res.json({
      message: "OTP generated successfully (email disabled in development mode)",
      otp, // show OTP only for testing
      expiresIn: "5 minutes",
    });
  } catch (error) {
    console.error("sendOtp Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/** ======================================================
 *  VERIFY OTP → CREATE USER
 * ====================================================== */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp, name, password } = req.body;

    if (!email || !otp || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get latest OTP
    const otpRecord = await Otp.findOne({ email, verified: false }).sort({
      createdAt: -1,
    });

    if (!otpRecord) {
      return res
        .status(404)
        .json({ message: "OTP not found or already used" });
    }

    // Check expiration
    if (new Date() > otpRecord.expiresAt) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Check OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await Otp.updateOne({ _id: otpRecord._id }, { verified: true });
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    await Otp.updateOne({ _id: otpRecord._id }, { verified: true });

    // Create JWT Token
    const token = jwt.sign(
      { sub: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("verifyOtp Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/** ======================================================
 *  REGISTER (NOT USED — requires OTP instead)
 * ====================================================== */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    return res.status(400).json({
      message:
        "Registration now requires OTP. Use /api/auth/send-otp and /api/auth/verify-otp",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/** ======================================================
 *  LOGIN (NO LOGIN ALERT EMAIL)
 * ====================================================== */
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { sub: user._id, email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  register,
  login,
};
