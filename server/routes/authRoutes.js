const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { sendOtp, verifyOtp, register, login, googleLogin, sendForgotPasswordOtp, resetPassword } = require('../controllers/authController');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP requests per `window` (here, per 15 minutes)
  message: { message: "Too many OTP requests from this IP, please try again after 15 minutes" }
});

// OTP endpoints
router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);

// Auth endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);

// Forgot Password endpoints
router.post('/forgot-password-otp', otpLimiter, sendForgotPasswordOtp);
router.post('/reset-password', resetPassword);

module.exports = router;

