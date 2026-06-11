import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Calendar, ShoppingBag, ShieldCheck } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. If redirected from checkout with state
    if (location.state) {
      setOrderInfo(location.state);
      setLoading(false);
      return;
    }

    // 2. If redirected from Stripe or other external source with pending order in localStorage
    const placeOrderAfterExternalPayment = async () => {
      const pendingOrder = localStorage.getItem("pending_order");
      const savedCart = localStorage.getItem("shop_cart");

      if (!pendingOrder) {
        setLoading(false);
        return;
      }

      const orderData = JSON.parse(pendingOrder);
      const cartItems = savedCart ? JSON.parse(savedCart) : [];

      try {
        const res = await fetch(`${API_URL}/api/order/place-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (!res.ok) throw new Error("Order placement failed");

        const orderDetails = {
          orderId: orderData.orderId,
          formData: {
            fullName: orderData.fullName || orderData.name,
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address,
            city: orderData.city,
            state: orderData.state,
            pincode: orderData.pincode,
          },
          total: orderData.total,
          items: cartItems,
          paymentMethod: "Online Payment"
        };

        setOrderInfo(orderDetails);

        // ✅ CLEANUP
        localStorage.removeItem("pending_order");
        localStorage.removeItem("shop_cart");

      } catch (err) {
        console.error("Order error:", err);
      } finally {
        setLoading(false);
      }
    };

    placeOrderAfterExternalPayment();
  }, [navigate, location, API_URL]);

  // Fallback demo state if no order details found (direct access to success page)
  const order = orderInfo || {
    orderId: "AVS-20260611-182379",
    formData: {
      fullName: "Sakshi Sharma",
      email: "sakshi@example.com",
      phone: "9876543210",
      address: "23, Green Avenue, Civil Lines",
      city: "Jalandhar",
      state: "Punjab",
      pincode: "144001",
    },
    total: 647,
    items: [
      {
        id: 1,
        name: "Air Purifier Money Plant with pot",
        price: 249,
        image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png",
        quantity: 1
      },
      {
        id: 3,
        name: "Peace Lily, Spathiphyllum - Plant",
        price: 169,
        image: "/lovable-uploads/57676f3f-fcca-4be2-83f5-99907f0f3068.png",
        quantity: 1
      }
    ],
    paymentMethod: "UPI (Razorpay)"
  };

  const steps = [
    { label: "Order Placed", date: "Today, 10:45 AM", completed: true, active: false },
    { label: "Payment Successful", date: "Today, 10:46 AM", completed: true, active: false },
    { label: "Processing", date: "Today, 11:00 AM", completed: true, active: true },
    { label: "Shipped", date: "Expected in 2 days", completed: false, active: false },
    { label: "Delivered", date: "Expected in 4 days", completed: false, active: false }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070E08]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#a8e063] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#95A5A0] font-medium">Processing your payment & order confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070E08] text-[#E2ECE9] font-sans pb-16">
      <GlobalNavigation />

      <div className="max-w-4xl mx-auto px-4 pt-28 flex flex-col items-center">
        {/* Animated Checkmark Badge */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#a8e063] rounded-full filter blur-md opacity-30 animate-pulse" />
          <div className="relative w-20 h-20 bg-[#1D3D18] border border-[#a8e063] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,224,99,0.3)] animate-scale-in">
            <Check className="h-10 w-10 text-[#a8e063] stroke-[3]" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight">
          Order Placed <span className="text-[#a8e063]">Successfully!</span> 🎉
        </h1>
        <p className="text-[#95A5A0] text-center mt-2.5 max-w-lg text-sm md:text-base leading-relaxed">
          Thank you for shopping with Ayurvista. Your herbal wellness order is confirmed and will be prepared shortly.
        </p>

        {/* Order Details Card */}
        <Card className="bg-[#111F10]/95 border-[#1E351B] text-[#E2ECE9] shadow-2xl w-full max-w-2xl mt-10 overflow-hidden">
          <CardContent className="p-6 md:p-8 space-y-8">
            
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-[#1E351B]/50 text-sm">
              <div>
                <p className="text-[#95A5A0] text-xs font-bold uppercase tracking-wider">Order Number</p>
                <p className="font-extrabold text-[#a8e063] mt-1">{order.orderId}</p>
              </div>
              <div>
                <p className="text-[#95A5A0] text-xs font-bold uppercase tracking-wider">Order Placed On</p>
                <p className="font-semibold mt-1">
                  {new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>

            {/* Visual Timeline tracker */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#95A5A0] mb-6 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#a8e063]" />
                Delivery Timeline
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex md:flex-col items-center md:text-center relative gap-3 md:gap-0">
                    {/* Circle badge */}
                    <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold relative z-10 transition-all ${
                      step.active
                        ? "bg-[#1D3D18] border-[#a8e063] text-[#a8e063] shadow-[0_0_10px_rgba(168,224,99,0.4)]"
                        : step.completed
                        ? "bg-[#a8e063] border-[#a8e063] text-[#070E08]"
                        : "bg-[#070E08] border-[#1E351B] text-[#95A5A0]"
                    }`}>
                      {step.completed && !step.active ? <Check size={10} className="stroke-[3]" /> : idx + 1}
                    </div>

                    {/* Timeline connection lines on desktop */}
                    {idx < steps.length - 1 && (
                      <div className="hidden md:block absolute top-3.5 left-[calc(50%+14px)] right-[calc(-50%+14px)] h-0.5 bg-[#1E351B] z-0" />
                    )}

                    {/* Content text */}
                    <div className="md:mt-3 flex flex-col md:items-center">
                      <span className={`text-xs font-bold ${step.active ? "text-[#a8e063]" : step.completed ? "text-[#E2ECE9]" : "text-[#95A5A0]"}`}>
                        {step.label}
                      </span>
                      <span className="text-[10px] text-[#95A5A0] md:mt-0.5">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Helper message */}
            <div className="bg-[#070E08]/50 border border-[#1E351B] p-4 rounded-xl flex items-start gap-3 text-xs text-[#95A5A0]">
              <ShieldCheck className="h-5 w-5 text-[#a8e063] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-[#E2ECE9]">Order Updates Sent</p>
                <p>We've sent a receipt and invoice details to <span className="text-white font-medium">{order.formData.email}</span>. You can track this order's progress in real-time below.</p>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Button
                onClick={() => navigate("/shop")}
                className="bg-transparent hover:bg-[#111F10] border border-[#1E351B] text-[#95A5A0] hover:text-[#E2ECE9] rounded-xl font-bold py-3 transition-all"
              >
                CONTINUE SHOPPING
              </Button>
              <Button
                onClick={() => navigate("/order-tracking", { state: order })}
                className="bg-[#1D3D18] hover:bg-[#a8e063] hover:text-[#070E08] border border-[#2D6A4F] text-[#a8e063] rounded-xl font-bold py-3 shadow-lg transition-all"
              >
                GO TO MY ORDERS / TRACK
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Success;
