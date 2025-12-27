// server/routes/order.routes.cjs
const express = require("express");
const router = express.Router();

const { sendOrderConfirmation } = require("../controllers/orderMailer.cjs");

router.post("/place-order", async (req, res) => {
  try {
    const order = req.body;

    await sendOrderConfirmation(order);

    res.json({ success: true, msg: "Order placed & confirmation email sent!" });
  } catch (err) {
    console.error("ORDER ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Order email failed" });
  }
});

module.exports = router;
