const express = require("express");
const router = express.Router();
const { sendMail } = require("../controllers/mailerController.cjs");
const nodemailer = require("nodemailer");

// Existing Route
// POST /api/mail/send
router.post("/send", sendMail);

/* =========================
   SUBSCRIBE EMAIL ROUTE
========================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Welcome to Ayurvista 🌿",
      html: `
        <h2>Thanks for subscribing to Ayurvista 🌱</h2>
        <p>You will now receive herbal blogs, wellness tips and updates.</p>
      `,
    });

    res.json({
      success: true,
    });

  } catch (error) {

    console.log("MAIL ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = { mailerRouter: router };