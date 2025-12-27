// server/controllers/orderMailer.cjs
const nodemailer = require("nodemailer");

exports.sendOrderConfirmation = async (order) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `AyurVista <${process.env.GMAIL_USER}>`,
    to: order.email,
    subject: `Order Confirmation - ${order.orderId}`,
    html: `
      <h2>Hi ${order.name}, your order is confirmed! 🎉</h2>

      <p><b>Order ID:</b> ${order.orderId}</p>
      <p><b>Total Amount:</b> ₹${order.total}</p>

      <h3>Shipping Address:</h3>
      <p>${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>

      <p>Thank you for shopping with <b>AyurVista</b> 🌿</p>
    `
  });
};
