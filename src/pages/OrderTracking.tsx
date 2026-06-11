import { useLocation, useNavigate } from "react-router-dom";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Calendar, MapPin, Package, Check, Phone, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderState {
  orderId: string;
  formData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  total: number;
  items: OrderItem[];
}

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderState = location.state as OrderState;

  // Fallback demo state if no state is passed
  const order = orderState || {
    orderId: "AVS-2026-05-11-000123",
    formData: {
      fullName: "Sakshi Sharma",
      email: "sakshi@example.com",
      phone: "9876543210",
      address: "23, Green Avenue, Civil Lines",
      landmark: "Near Lovely Professional University",
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
      },
      {
        id: 5,
        name: "Snake Plant, Sansevieria - Air Purifier",
        price: 299,
        image: "/lovable-uploads/4569bb5e-341b-40ca-a57d-012a38c41449.png",
        quantity: 1
      }
    ]
  };

  const steps = [
    { label: "Order Placed", date: "11 May, 10:45 AM", completed: true, active: false },
    { label: "Payment Successful", date: "11 May, 10:46 AM", completed: true, active: false },
    { label: "Processing", date: "11 May, 11:00 AM", completed: true, active: true },
    { label: "Shipped", date: "Expected by 14 May", completed: false, active: false },
    { label: "Delivered", date: "Expected by 16 May", completed: false, active: false }
  ];

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const packagingCharge = 10;

  const handleSupportClick = () => {
    toast.success("Connecting you to our Ayurvedic support specialist...");
  };

  return (
    <div className="min-h-screen bg-[#070E08] text-[#E2ECE9] font-sans pb-16">
      <GlobalNavigation />

      <div className="max-w-6xl mx-auto px-4 pt-28">
        {/* Back Button */}
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center space-x-2 text-[#95A5A0] hover:text-[#a8e063] transition-colors mb-6 text-sm font-semibold uppercase tracking-wider"
        >
          <ChevronLeft size={16} />
          <span>Back to Shop</span>
        </button>

        {/* Order Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1E351B] pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Order <span className="text-[#a8e063]">#{order.orderId}</span>
              </h1>
              <span className="bg-[#1D3D18] text-[#a8e063] border border-[#2D6A4F] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                Processing
              </span>
            </div>
            <p className="text-sm text-[#95A5A0] mt-1.5">
              Placed on 11 May 2026, 10:46 AM
            </p>
          </div>
        </div>

        {/* Tracking & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Middle: Timeline & Address */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline */}
            <Card className="bg-[#111F10]/95 border-[#1E351B] text-[#E2ECE9] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#a8e063] to-transparent" />
              <CardContent className="p-6 md:p-8">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-[#a8e063]">
                  <Package className="h-5 w-5" />
                  Order Journey
                </h3>

                {/* Horizontal / Vertical Timeline */}
                <div className="relative pl-6 border-l-2 border-[#1E351B] space-y-8 ml-3">
                  {steps.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Node Icon */}
                      <span className={`absolute -left-[35px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full border ${
                        step.active
                          ? "bg-[#1D3D18] border-[#a8e063] text-[#a8e063] shadow-[0_0_10px_rgba(168,224,99,0.5)]"
                          : step.completed
                          ? "bg-[#a8e063] border-[#a8e063] text-[#070E08]"
                          : "bg-[#070E08] border-[#1E351B] text-[#95A5A0]"
                      }`}>
                        {step.completed && !step.active ? (
                          <Check size={12} className="stroke-[3]" />
                        ) : (
                          <span className={`w-2 h-2 rounded-full ${step.active ? "bg-[#a8e063]" : "bg-transparent"}`} />
                        )}
                      </span>

                      {/* Content */}
                      <div>
                        <h4 className={`text-base font-bold ${step.active ? "text-[#a8e063]" : step.completed ? "text-[#E2ECE9]" : "text-[#95A5A0]"}`}>
                          {step.label}
                        </h4>
                        <p className="text-xs text-[#95A5A0] mt-0.5">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Details & Estimated Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Estimated Delivery */}
              <Card className="bg-[#111F10]/95 border-[#1E351B] text-[#E2ECE9] shadow-xl">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-[#1D3D18] border border-[#2D6A4F] rounded-xl text-[#a8e063]">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#95A5A0] uppercase tracking-wider">Estimated Delivery</h3>
                    <p className="text-xl font-extrabold mt-1 text-[#a8e063]">15 - 18 May 2026</p>
                    <span className="inline-block mt-2 bg-[#1A3416] text-[#a8e063] text-xs font-semibold px-2 py-0.5 rounded-md">
                      4-5 days left
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="bg-[#111F10]/95 border-[#1E351B] text-[#E2ECE9] shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-sm font-bold text-[#95A5A0] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#a8e063]" />
                    Delivery Address
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-bold text-[#E2ECE9]">{order.formData.fullName}</p>
                    <p className="text-[#95A5A0]">{order.formData.address}</p>
                    {order.formData.landmark && (
                      <p className="text-xs text-[#95A5A0] italic">Landmark: {order.formData.landmark}</p>
                    )}
                    <p className="text-[#95A5A0]">{order.formData.city}, {order.formData.state} - {order.formData.pincode}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-[#a8e063]">
                      <Phone size={12} />
                      <span>{order.formData.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Need Help Button */}
            <div className="flex justify-start">
              <Button
                onClick={handleSupportClick}
                className="bg-transparent hover:bg-[#1D3D18]/40 text-[#a8e063] border border-[#2D6A4F] px-6 py-2 rounded-xl flex items-center gap-2 font-bold transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                Need Help? Chat with Support
              </Button>
            </div>
          </div>

          {/* Right Sidebar: Order Items Summary */}
          <div className="space-y-6">
            {/* Order Items Card */}
            <Card className="bg-[#111F10]/95 border-[#1E351B] text-[#E2ECE9] shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 pb-3 border-b border-[#1E351B] text-[#a8e063]">
                  Order Items
                </h3>

                <div className="divide-y divide-[#1E351B] max-h-[300px] overflow-y-auto pr-2 scrollbar-hide space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                      <div className="w-16 h-16 rounded-xl bg-[#070E08] border border-[#1E351B] p-2 flex items-center justify-center flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#E2ECE9] truncate">{item.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-[#95A5A0]">Qty: {item.quantity}</p>
                          <p className="text-sm font-extrabold text-[#a8e063]">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#1E351B] mt-6 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-[#95A5A0]">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#95A5A0]">
                    <span>Delivery Charge</span>
                    <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                  </div>
                  <div className="flex justify-between text-[#95A5A0]">
                    <span>Packaging Charge</span>
                    <span>₹{packagingCharge}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold pt-3 border-t border-[#1E351B] text-[#E2ECE9]">
                    <span>Total Amount</span>
                    <span className="text-[#a8e063]">₹{order.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
