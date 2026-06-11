import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ShieldCheck, CreditCard, Landmark, Wallet, Check, AlertCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

interface CartItem {
  id: number | string;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Air Purifier Money Plant with pot",
    price: 249,
    originalPrice: 350,
    image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png"
  },
  {
    id: 2,
    name: "Top 4 Jasmine Flowering Plants for Fragrance",
    price: 1205,
    originalPrice: 1607,
    image: "/lovable-uploads/124c9240-d734-40d5-aaad-699471ad9889.png"
  },
  {
    id: 3,
    name: "Peace Lily, Spathiphyllum - Plant",
    price: 169,
    originalPrice: 199,
    image: "/lovable-uploads/57676f3f-fcca-4be2-83f5-99907f0f3068.png"
  },
  {
    id: 4,
    name: "Set of 4 Summer Special Plants (2 Jasmine + 2 Aloe Vera) Pack",
    price: 993,
    originalPrice: 1324,
    image: "/lovable-uploads/b3353135-a7cc-4a7f-861d-ffbce405151c.png"
  },
  {
    id: 5,
    name: "Snake Plant, Sansevieria - Air Purifier",
    price: 299,
    originalPrice: 399,
    image: "/lovable-uploads/4569bb5e-341b-40ca-a57d-012a38c41449.png"
  },
  {
    id: 6,
    name: "Fiddle Leaf Fig - Premium Indoor Plant",
    price: 899,
    originalPrice: 1200,
    image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png"
  },
  {
    id: 7,
    name: "Ashwagandha",
    price: 149,
    originalPrice: 199,
    image: "/lovable-uploads/4569bb5e-341b-40ca-a57d-012a38c41449.png"
  },
  {
    id: 8,
    name: "Giloy Plant",
    price: 190,
    originalPrice: 250,
    image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png"
  },
  {
    id: 9,
    name: "Mint Plant",
    price: 145,
    originalPrice: 195,
    image: "/lovable-uploads/57676f3f-fcca-4be2-83f5-99907f0f3068.png"
  }
];

const generateOrderId = () =>
  "AVS-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + Math.floor(100000 + Math.random() * 900000);

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("upi");
  const [checkoutStep, setCheckoutStep] = useState<"details" | "payment">("details");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: ""
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("shop_cart");
    if (!saved) return;

    const parsed: CartItem[] = JSON.parse(saved);
    const cleaned = parsed.filter(
      (i) =>
        !isNaN(Number(i.id)) &&
        !isNaN(Number(i.quantity)) &&
        Number(i.quantity) > 0
    );

    setCartItems(cleaned);
    localStorage.setItem("shop_cart", JSON.stringify(cleaned));
  }, []);

  const getCartProducts = () =>
    cartItems
      .map((item) => {
        const productId = Number(item.id);
        const product = products.find((p) => p.id === productId);
        if (!product) return null;

        return {
          ...product,
          quantity: Number(item.quantity),
        };
      })
      .filter((p): p is Product & { quantity: number } => p !== null);

  const getSubtotal = () =>
    getCartProducts().reduce((sum, p) => sum + p.price * p.quantity, 0);

  const getShippingCost = () => (getSubtotal() > 500 ? 0 : 40);
  const getPackagingCost = () => 10;
  const getTotal = () => getSubtotal() + getShippingCost() + getPackagingCost();

  const getSavings = () => {
    return getCartProducts().reduce((sum, p) => {
      const original = p.originalPrice || (p.price + 50);
      return sum + (original - p.price) * p.quantity;
    }, 0);
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter((i) => Number(i.id) !== id);
    setCartItems(updated);
    localStorage.setItem("shop_cart", JSON.stringify(updated));
    if (updated.length === 0) {
      navigate("/shop");
    }
  };

  // COD ORDER
  const placeOrderAndSendMail = async (preGeneratedId?: string) => {
    const orderId = preGeneratedId || generateOrderId();

    try {
      await fetch(`${API_BASE}/api/order/place-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          total: getTotal(),
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        }),
      });

      toast({
        title: "Order Confirmed",
        description: `Order ID: ${orderId}`,
      });

      localStorage.removeItem("shop_cart");

      navigate("/success", {
        state: {
          orderId,
          formData,
          total: getTotal(),
          items: getCartProducts(),
          paymentMethod: paymentMethod === "upi" ? "UPI (Razorpay)" : "Cash on Delivery"
        }
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Order Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  };

  // RAZORPAY
  const redirectToRazorpay = async () => {
    try {
      const orderId = generateOrderId();

      localStorage.setItem(
        "pending_order",
        JSON.stringify({
          orderId,
          ...formData,
          total: getTotal(),
        })
      );

      const res = await fetch(`${API_BASE}/api/razorpay/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: getCartProducts().map((p) => ({
            name: p.name,
            price: p.price,
            quantity: p.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          title: "Payment Failed",
          description: "Unable to create Razorpay order",
          variant: "destructive",
        });
        return;
      }

      const options = {
        key: "rzp_test_SojH2k24fHZ6zb",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "AyurVista",
        description: "Plant Purchase",
        order_id: data.order.id,

        handler: async function () {
          await placeOrderAndSendMail(orderId);

          toast({
            title: "Payment Successful",
            description: "Your order has been placed",
          });
        },

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },

        theme: {
          color: "#16a34a",
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();

    } catch (error) {
      console.error(error);

      toast({
        title: "Payment Error",
        description: "Something went wrong during payment setup",
        variant: "destructive",
      });
    }
  };

  const handleProceedToPayment = () => {
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      toast({
        title: "Details Required",
        description: "Please fill in all mandatory fields to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setCheckoutStep("payment");
  };

  const handlePlaceOrder = () => {
    paymentMethod === "upi"
      ? redirectToRazorpay()
      : placeOrderAndSendMail();
  };

  // Steps for visual progress tracker
  const steps = [
    { label: "Cart", completed: true, active: false },
    { label: "Details", completed: checkoutStep === "payment", active: checkoutStep === "details" },
    { label: "Payment", completed: false, active: checkoutStep === "payment" },
    { label: "Confirm", completed: false, active: false },
    { label: "Order Placed", completed: false, active: false }
  ];

  const savings = getSavings();

  return (
    <div className="min-h-screen bg-[#070E08] text-[#E2ECE9] font-sans pb-16">
      <GlobalNavigation />

      <div className="pt-28 container mx-auto max-w-6xl px-4">
        
        {/* Progress Tracker Banner */}
        <div className="mb-12 max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1E351B] -translate-y-1/2 z-0" />
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center z-10 relative">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step.active
                    ? "bg-[#1D3D18] border-[#a8e063] text-[#a8e063] shadow-[0_0_10px_rgba(168,224,99,0.4)]"
                    : step.completed
                    ? "bg-[#a8e063] border-[#a8e063] text-[#070E08]"
                    : "bg-[#070E08] border-[#1E351B] text-[#95A5A0]"
                }`}>
                  {step.completed ? <Check size={12} className="stroke-[3]" /> : idx + 1}
                </div>
                <span className={`text-xs mt-2 font-semibold ${step.active ? "text-[#a8e063]" : step.completed ? "text-[#E2ECE9]" : "text-[#95A5A0]"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {checkoutStep === "details" ? (
          /* ========================================================= */
          /* STEP 1: DELIVERY DETAILS                                  */
          /* ========================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Left Side */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="bg-[#111F10]/95 border-[#1E351B] text-[#E2ECE9] shadow-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <h2 className="text-xl font-bold border-b border-[#1E351B] pb-3 text-[#a8e063]">
                    Delivery Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A0]">Full Name *</label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Sakshi Sharma"
                        className="bg-[#070E08] border-[#1E351B] focus:border-[#2D6A4F] text-[#E2ECE9] rounded-xl placeholder-[#5c6e69]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A0]">Phone Number *</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="9876543210"
                        className="bg-[#070E08] border-[#1E351B] focus:border-[#2D6A4F] text-[#E2ECE9] rounded-xl placeholder-[#5c6e69]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A0]">Email Address *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sakshi@example.com"
                      className="bg-[#070E08] border-[#1E351B] focus:border-[#2D6A4F] text-[#E2ECE9] rounded-xl placeholder-[#5c6e69]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A0]">Address (House/Flat No, Building, Street) *</label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="23, Green Avenue, Civil Lines"
                      rows={3}
                      className="bg-[#070E08] border-[#1E351B] focus:border-[#2D6A4F] text-[#E2ECE9] rounded-xl placeholder-[#5c6e69] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A0]">Landmark (Optional)</label>
                    <Input
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="Near Lovely Professional University"
                      className="bg-[#070E08] border-[#1E351B] focus:border-[#2D6A4F] text-[#E2ECE9] rounded-xl placeholder-[#5c6e69]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A0]">City *</label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Jalandhar"
                        className="bg-[#070E08] border-[#1E351B] focus:border-[#2D6A4F] text-[#E2ECE9] rounded-xl placeholder-[#5c6e69]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A0]">State *</label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-[#070E08] border border-[#1E351B] focus:border-[#2D6A4F] text-[#E2ECE9] rounded-xl h-10 px-3 text-sm focus:outline-none"
                      >
                        <option value="" disabled className="text-[#5c6e69]">Select State</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Rajasthan">Rajasthan</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#95A5A0]">Pincode *</label>
                      <Input
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="144001"
                        className="bg-[#070E08] border-[#1E351B] focus:border-[#2D6A4F] text-[#E2ECE9] rounded-xl placeholder-[#5c6e69]"
                      />
                    </div>
                  </div>

                  <label className="flex items-center space-x-3 cursor-pointer group text-xs text-[#95A5A0] hover:text-[#E2ECE9] pt-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-[#1E351B] text-[#a8e063] focus:ring-0 bg-[#070E08] w-4 h-4 accent-[#a8e063]"
                    />
                    <span>Save this address for future orders</span>
                  </label>
                </CardContent>
              </Card>
            </div>

            {/* Summary Right Side */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-[#111F10]/95 border-[#1E351B] text-[#E2ECE9] shadow-2xl">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-lg font-bold border-b border-[#1E351B] pb-3 text-[#a8e063] mb-4">
                    Order Summary
                  </h2>

                  {/* Items List */}
                  <div className="divide-y divide-[#1E351B]/40 max-h-[220px] overflow-y-auto pr-2 scrollbar-hide space-y-3">
                    {getCartProducts().map((p) => (
                      <div key={p.id} className="flex justify-between items-center gap-4 py-3 first:pt-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-[#070E08] border border-[#1E351B] p-1.5 flex items-center justify-center flex-shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold truncate">{p.name}</h4>
                            <p className="text-[10px] text-[#95A5A0] mt-0.5">Qty: {p.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#a8e063]">₹{p.price * p.quantity}</p>
                          <button
                            onClick={() => removeItem(p.id)}
                            className="text-[10px] text-red-400 hover:text-red-500 underline mt-0.5"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cost breakdown */}
                  <div className="border-t border-[#1E351B] pt-4 mt-4 space-y-2.5 text-xs text-[#95A5A0]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{getSubtotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>{getShippingCost() === 0 ? "FREE" : `₹${getShippingCost()}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Packaging Charge</span>
                      <span>₹{getPackagingCost()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm font-extrabold pt-3 border-t border-[#1E351B] text-[#E2ECE9]">
                      <span>Total Amount</span>
                      <span className="text-[#a8e063]">₹{getTotal()}</span>
                    </div>
                  </div>

                  {/* Promo Box */}
                  {savings > 0 && (
                    <div className="mt-6 bg-[#1D3D18]/40 border border-[#2D6A4F] p-3 rounded-xl flex items-center gap-3 text-xs text-[#a8e063]">
                      <AlertCircle className="h-4 w-4 text-[#a8e063] flex-shrink-0" />
                      <span>Yay! You're saving ₹{savings} on this order</span>
                    </div>
                  )}

                  <Button
                    className="w-full bg-[#1D3D18] hover:bg-[#a8e063] hover:text-[#070E08] border border-[#2D6A4F] text-[#a8e063] font-bold rounded-xl mt-6 py-3 shadow-lg transition-all"
                    onClick={handleProceedToPayment}
                  >
                    PROCEED TO PAYMENT
                  </Button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#95A5A0]">
                    <ShieldCheck className="h-4.5 w-4.5 text-[#a8e063]" />
                    <span>Secure checkout | 100% Safe Payments</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* STEP 2: PAYMENT PAGE                                      */
          /* ========================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Order Summary & We Accept */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-[#111F10]/95 border-[#1E351B] text-[#E2ECE9] shadow-2xl">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-lg font-bold border-b border-[#1E351B] pb-3 text-[#a8e063] mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-xs text-[#95A5A0]">
                    <div className="flex justify-between">
                      <span>{getCartProducts().length} Items in Cart</span>
                      <span className="font-semibold text-[#E2ECE9]">₹{getSubtotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span className="font-semibold text-[#E2ECE9]">{getShippingCost() === 0 ? "FREE" : `₹${getShippingCost()}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Packaging Charge</span>
                      <span className="font-semibold text-[#E2ECE9]">₹{getPackagingCost()}</span>
                    </div>
                    
                    <div className="flex justify-between text-base font-extrabold pt-3 border-t border-[#1E351B] text-[#E2ECE9]">
                      <span>Total Amount</span>
                      <span className="text-[#a8e063]">₹{getTotal()}</span>
                    </div>
                  </div>

                  {/* Payment Logo Options */}
                  <div className="mt-8 pt-6 border-t border-[#1E351B] space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#95A5A0]">We Accept</p>
                    <div className="flex flex-wrap gap-2">
                      {["VISA", "Mastercard", "UPI", "RuPay", "NetBanking"].map((brand) => (
                        <span key={brand} className="text-[10px] font-extrabold bg-[#070E08] border border-[#1E351B] text-[#95A5A0] px-2.5 py-1 rounded-md">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Back Button */}
              <button
                onClick={() => setCheckoutStep("details")}
                className="flex items-center space-x-2 text-[#95A5A0] hover:text-[#a8e063] transition-colors text-xs font-bold uppercase tracking-wider pl-2"
              >
                <ChevronLeft size={14} />
                <span>Go back to Delivery details</span>
              </button>
            </div>

            {/* Right Column: Payment Methods Choice */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="bg-[#111F10]/95 border-[#1E351B] text-[#E2ECE9] shadow-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <h2 className="text-xl font-bold border-b border-[#1E351B] pb-3 text-[#a8e063]">
                    Choose a Payment Method
                  </h2>

                  <div className="space-y-3">
                    {/* UPI Option */}
                    <div
                      onClick={() => setPaymentMethod("upi")}
                      className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === "upi"
                          ? "bg-[#1D3D18]/30 border-[#a8e063] shadow-[0_0_15px_rgba(168,224,99,0.1)]"
                          : "bg-[#070E08]/40 border-[#1E351B] hover:border-[#2D6A4F]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "upi"}
                          onChange={() => setPaymentMethod("upi")}
                          className="text-[#a8e063] focus:ring-0 bg-[#070E08] w-4 h-4 accent-[#a8e063]"
                        />
                        <div>
                          <p className="text-sm font-bold">UPI / Cards / Netbanking (Razorpay)</p>
                          <p className="text-xs text-[#95A5A0] mt-0.5">Pay securely using UPI apps, credit/debit cards, netbanking, or wallets.</p>
                        </div>
                      </div>
                      <CreditCard className={`h-5 w-5 ${paymentMethod === "upi" ? "text-[#a8e063]" : "text-[#95A5A0]"}`} />
                    </div>

                    {/* COD Option */}
                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === "cod"
                          ? "bg-[#1D3D18]/30 border-[#a8e063] shadow-[0_0_15px_rgba(168,224,99,0.1)]"
                          : "bg-[#070E08]/40 border-[#1E351B] hover:border-[#2D6A4F]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="text-[#a8e063] focus:ring-0 bg-[#070E08] w-4 h-4 accent-[#a8e063]"
                        />
                        <div>
                          <p className="text-sm font-bold">Cash on Delivery (COD)</p>
                          <p className="text-xs text-[#95A5A0] mt-0.5">Pay with cash or digital UPI upon receiving your delivery at your doorstep.</p>
                        </div>
                      </div>
                      <Wallet className={`h-5 w-5 ${paymentMethod === "cod" ? "text-[#a8e063]" : "text-[#95A5A0]"}`} />
                    </div>
                  </div>

                  {/* QR Code section for UPI visual */}
                  {paymentMethod === "upi" && (
                    <div className="bg-[#070E08]/60 border border-[#1E351B] p-5 rounded-2xl flex flex-col items-center text-center space-y-4">
                      <p className="text-xs text-[#E2ECE9] font-bold">Scan QR Code using any UPI App</p>
                      
                      {/* Interactive Visual QR code mock */}
                      <div className="w-36 h-36 bg-[#111F10] border border-[#2D6A4F] rounded-xl p-3 flex items-center justify-center relative shadow-inner">
                        <div className="w-full h-full border border-dashed border-[#a8e063]/60 rounded p-1 flex items-center justify-center">
                          {/* Inner Mock QR pattern */}
                          <div className="w-full h-full bg-[radial-gradient(#a8e063_2px,transparent_2px)] [background-size:8px_8px] opacity-70 flex items-center justify-center">
                            <span className="font-extrabold text-[#070E08] bg-[#a8e063] px-2 py-1 rounded text-[10px] tracking-widest shadow-md">
                              AVS-PAY
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2.5 text-[10px] text-[#95A5A0]">
                        <span>Google Pay</span>
                        <span>•</span>
                        <span>PhonePe</span>
                        <span>•</span>
                        <span>Paytm</span>
                        <span>•</span>
                        <span>BHIM UPI</span>
                      </div>
                    </div>
                  )}

                  {/* Payment Button */}
                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full bg-[#1D3D18] hover:bg-[#a8e063] hover:text-[#070E08] border border-[#2D6A4F] text-[#a8e063] font-bold rounded-xl py-3 shadow-lg transition-all text-base uppercase tracking-wider"
                  >
                    {paymentMethod === "upi" ? `Pay ₹${getTotal()}` : "Place Order (COD)"}
                  </Button>

                  <p className="text-center text-[10px] text-[#95A5A0] leading-relaxed">
                    {paymentMethod === "upi"
                      ? "You will be redirected to the secure Razorpay payment gateway to authorize transaction."
                      : "By confirming, you agree to pay the total order amount of ₹" + getTotal() + " upon home delivery."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;