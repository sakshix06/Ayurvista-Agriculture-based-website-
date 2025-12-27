import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const placeOrderAfterStripe = async () => {
      const pendingOrder = localStorage.getItem("pending_order");

      if (!pendingOrder) {
        console.error("No pending order found");
        return;
      }

      const orderData = JSON.parse(pendingOrder);

      try {
        const res = await fetch("http://localhost:5000/api/order/place-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (!res.ok) throw new Error("Order placement failed");

        // ✅ CLEANUP
        localStorage.removeItem("pending_order");
        localStorage.removeItem("shop_cart");

        // Optional redirect after 2 seconds
        setTimeout(() => {
          navigate("/shop");
        }, 2000);

      } catch (err) {
        console.error("Order error:", err);
      }
    };

    placeOrderAfterStripe();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Payment Successful 🎉</h1>
      <p>Your order is confirmed.</p>
      <p>Confirmation email has been sent.</p>
    </div>
  );
};

export default Success;
