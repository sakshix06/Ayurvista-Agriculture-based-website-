const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, register, login } = require('../controllers/authController');

// OTP endpoints
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Auth endpoints
router.post('/register', register);
router.post('/login', login);

module.exports = router;

