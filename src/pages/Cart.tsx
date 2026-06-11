import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Minus, Plus, ShoppingCart, ChevronLeft, ShieldCheck, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shop_cart");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  const syncCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("shop_cart", JSON.stringify(items));
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    syncCart(
      cartItems.map(i =>
        i.id === id ? { ...i, quantity: qty } : i
      )
    );
  };

  const removeItem = (id: number) => {
    syncCart(cartItems.filter(i => i.id !== id));
    toast({
      title: "Item Removed",
      description: "Product has been removed from your cart."
    });
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#070E08] text-[#E2ECE9] font-sans pb-12">
        <GlobalNavigation />
        <div className="pt-32 text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-[#111F10] border border-[#1E351B] text-[#a8e063] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <ShoppingCart size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-[#95A5A0] text-sm mb-6">Looks like you haven't added any Ayurvedic herbs yet.</p>
          <Button
            onClick={() => navigate("/shop")}
            className="bg-[#1D3D18] border border-[#2D6A4F] hover:bg-[#a8e063] hover:text-[#070E08] text-[#a8e063] font-bold rounded-xl px-8"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070E08] text-[#E2ECE9] font-sans pb-16">
      <GlobalNavigation />

      <div className="pt-28 container mx-auto max-w-4xl px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center space-x-2 text-[#95A5A0] hover:text-[#a8e063] transition-colors mb-6 text-sm font-semibold uppercase tracking-wider"
        >
          <ChevronLeft size={16} />
          <span>Back to Shop</span>
        </button>

        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
          Your <span className="text-[#a8e063]">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id} className="bg-[#111F10]/95 border-[#1E351B] text-[#E2ECE9] overflow-hidden shadow-xl hover:shadow-[0_4px_15px_rgba(26,52,22,0.3)] transition-all">
                <CardContent className="p-4 md:p-6 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-[#070E08] border border-[#1E351B] p-2 flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm md:text-base truncate">{item.name}</h3>
                    <p className="text-xs md:text-sm text-[#a8e063] font-semibold mt-1">₹ {item.price}</p>
                  </div>

                  <div className="flex items-center border border-[#1E351B] rounded-lg bg-[#070E08]">
                    <button
                      className="p-1 text-[#95A5A0] hover:text-[#a8e063] transition-colors"
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-2.5 text-xs font-bold">{item.quantity}</span>
                    <button
                      className="p-1 text-[#95A5A0] hover:text-[#a8e063] transition-colors"
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <p className="w-16 md:w-20 text-right font-extrabold text-sm md:text-base text-[#a8e063]">
                    ₹ {item.price * item.quantity}
                  </p>

                  <button
                    className="text-red-400 hover:text-red-500 p-2 transition-colors"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="space-y-6">
            <Card className="bg-[#111F10]/95 border-[#1E351B] text-[#E2ECE9] shadow-xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#a8e063] border-b border-[#1E351B] pb-2">Order Summary</h3>
                
                <div className="space-y-2 text-sm text-[#95A5A0]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#E2ECE9]">₹{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-[#E2ECE9]">{total > 500 ? "FREE" : "₹40"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging Charge</span>
                    <span className="font-semibold text-[#E2ECE9]">₹10</span>
                  </div>
                </div>

                <div className="border-t border-[#1E351B] pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-bold">Total Amount</span>
                  <span className="text-2xl font-extrabold text-[#a8e063]">₹{total > 500 ? total + 10 : total + 40 + 10}</span>
                </div>

                <Button
                  className="w-full bg-[#1D3D18] hover:bg-[#a8e063] hover:text-[#070E08] border border-[#2D6A4F] text-[#a8e063] font-bold rounded-xl py-3 shadow-lg transition-all"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>

            {/* Security Badges */}
            <div className="bg-[#111F10]/30 border border-[#1E351B] p-4 rounded-xl flex items-center gap-3 text-xs text-[#95A5A0]">
              <ShieldCheck className="h-5 w-5 text-[#a8e063] flex-shrink-0" />
              <span>Secure Checkout: Your payment info is encrypted and completely safe.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
