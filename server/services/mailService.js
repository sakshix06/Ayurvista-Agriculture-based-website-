const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendWelcomeEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Welcome to Ayurvista! 🌿",
      text: `Hey ${username}, you have successfully registered in Ayurvista. Kindly explore our services.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

const sendPasswordResetOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Password Reset OTP - Ayurvista",
      text: `Your OTP to reset your password is: ${otp}. It is valid for 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset OTP:", error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetOtpEmail,
};
