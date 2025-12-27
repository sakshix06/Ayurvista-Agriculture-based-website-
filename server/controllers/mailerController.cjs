const nodemailer = require("nodemailer");

exports.sendMail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ success: false, msg: "Missing fields" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `AyurVista <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    res.json({ success: true, msg: "Email sent successfully" });
  } catch (err) {
    console.error("MAIL ERROR:", err);
    res.status(500).json({ success: false, msg: "Sending failed" });
  }
};
