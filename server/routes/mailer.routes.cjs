const express = require("express");
const router = express.Router();
const { sendMail } = require("../controllers/mailerController.cjs");

// POST /api/mail/send
router.post("/send", sendMail);

module.exports = { mailerRouter: router };
