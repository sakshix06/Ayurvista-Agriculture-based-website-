import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number | string;   // ✅ FIX
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const products: Product[] = [
  { id: 1, name: "Air Purifier Money Plant with pot", price: 249, image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png" },
  { id: 2, name: "Top 4 Jasmine Flowering Plants for Fragrance", price: 1205, image: "/lovable-uploads/124c9240-d734-40d5-aaad-699471ad9889.png" },
  { id: 3, name: "Peace Lily, Spathiphyllum - Plant", price: 169, image: "/lovable-uploads/57676f3f-fcca-4be2-83f5-99907f0f3068.png" },
  { id: 4, name: "Set of 4 Summer Special Plants (2 Jasmine + 2 Aloe Vera)", price: 993, image: "/lovable-uploads/b3353135-a7cc-4a7f-861d-ffbce405151c.png" }
];

// ✅ ORDER ID
const generateOrderId = () =>
  "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 10000);

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  // ✅ CLEAN CART ON LOAD
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

  // ✅ SAFE CART PRODUCTS
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

  const getShippingCost = () => (getSubtotal() > 500 ? 0 : 50);

  const getTotal = () => {
    const total = getSubtotal() + getShippingCost();
    return isNaN(total) ? 0 : total;   // 🔒 FINAL GUARD
  };

  // ✅ REMOVE ITEM
  const removeItem = (id: number) => {
    const updated = cartItems.filter((i) => Number(i.id) !== id);
    setCartItems(updated);
    localStorage.setItem("shop_cart", JSON.stringify(updated));
  };

  // ✅ COD ORDER
  const placeOrderAndSendMail = async () => {
    const orderId = generateOrderId();

    await fetch("http://localhost:5000/api/order/place-order", {
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

    toast({ title: "Order Confirmed", description: `Order ID: ${orderId}` });
    localStorage.removeItem("shop_cart");
    navigate("/shop");
  };

  // ✅ STRIPE
  const redirectToStripe = async () => {
    const orderId = generateOrderId();

    localStorage.setItem(
      "pending_order",
      JSON.stringify({ orderId, ...formData, total: getTotal() })
    );

    const res = await fetch("http://localhost:5000/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: getCartProducts().map((p) => ({
          name: p.name,
          price: p.price,
          quantity: p.quantity,
        })),
      }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  const handlePlaceOrder = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }

    paymentMethod === "upi" ? redirectToStripe() : placeOrderAndSendMail();
  };

  return (
    <div className="min-h-screen">
      <GlobalNavigation />

      <div className="pt-24 container mx-auto grid lg:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Name" onChange={(e)=>setFormData({...formData,fullName:e.target.value})}/>
              <Input placeholder="Email" onChange={(e)=>setFormData({...formData,email:e.target.value})}/>
              <Input placeholder="Phone" onChange={(e)=>setFormData({...formData,phone:e.target.value})}/>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Address</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea placeholder="Address" onChange={(e)=>setFormData({...formData,address:e.target.value})}/>
              <Input placeholder="City" onChange={(e)=>setFormData({...formData,city:e.target.value})}/>
              <Input placeholder="State" onChange={(e)=>setFormData({...formData,state:e.target.value})}/>
              <Input placeholder="Pincode" onChange={(e)=>setFormData({...formData,pincode:e.target.value})}/>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(v)=>setPaymentMethod(v as any)}>
                <div className="flex gap-2 items-center">
                  <RadioGroupItem value="cod" /> COD
                </div>
                <div className="flex gap-2 items-center">
                  <RadioGroupItem value="upi" /> UPI (Stripe Test)
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          {getCartProducts().map((p) => (
            <div key={p.id} className="flex justify-between items-center">
              <span>{p.name} × {p.quantity}</span>
              <Button variant="destructive" onClick={() => removeItem(p.id)}>
                Remove
              </Button>
            </div>
          ))}

          <Card>
            <CardHeader><CardTitle>Total</CardTitle></CardHeader>
            <CardContent>₹{getTotal()}</CardContent>
          </Card>

          <Button className="w-full bg-green-600 text-lg" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
