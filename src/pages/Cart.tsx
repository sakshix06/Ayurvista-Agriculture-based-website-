import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Minus, Plus } from "lucide-react";

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

  // 🔹 LOAD CART
  useEffect(() => {
    const saved = localStorage.getItem("shop_cart");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  // 🔹 SYNC CART
  const syncCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("shop_cart", JSON.stringify(items));
  };

  // 🔹 UPDATE QTY
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

  // 🔹 REMOVE
  const removeItem = (id: number) => {
    syncCart(cartItems.filter(i => i.id !== id));
  };

  // 🔹 TOTAL
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNavigation />
        <div className="pt-24 text-center">
          <h1 className="text-xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />

      <div className="pt-24 container mx-auto max-w-4xl px-4">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        <div className="space-y-4">
          {cartItems.map(item => (
            <Card key={item.id}>
              <CardContent className="p-6 flex items-center gap-4">
                <img
                  src={item.image}
                  className="w-20 h-20 object-contain rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>₹ {item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                  >
                    <Minus />
                  </Button>

                  <span>{item.quantity}</span>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                  >
                    <Plus />
                  </Button>
                </div>

                <p className="w-20 text-right font-bold">
                  ₹ {item.price * item.quantity}
                </p>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>

          <div className="text-right">
            <p className="text-lg">
              Total: <b className="text-2xl">₹ {total}</b>
            </p>
            <Button
              className="bg-red-500 text-white px-10 mt-2"
              onClick={() => navigate("/checkout")}
            >
              CHECKOUT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
