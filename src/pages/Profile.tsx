import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  ShoppingBag,
  Heart,
  Award,
  Star,
  Check,
  Download,
  Gift,
  ArrowRight,
  UserPlus,
  MapPin,
  CreditCard,
  Pencil,
  Sparkles,
  RefreshCw
} from "lucide-react";

interface RecommendedProduct {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
}

const recommendedProducts: RecommendedProduct[] = [
  {
    id: 11,
    name: "Tulsi Immunity Boost",
    price: 199,
    rating: 4.6,
    reviews: 128,
    image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png"
  },
  {
    id: 12,
    name: "Neem Skin Purifier",
    price: 249,
    rating: 4.5,
    reviews: 98,
    image: "/lovable-uploads/4569bb5e-341b-40ca-a57d-012a38c41449.png"
  },
  {
    id: 13,
    name: "Aloe Vera Gel",
    price: 179,
    rating: 4.7,
    reviews: 156,
    image: "/lovable-uploads/57676f3f-fcca-4be2-83f5-99907f0f3068.png"
  },
  {
    id: 14,
    name: "Ashwagandha Capsules",
    price: 299,
    rating: 4.6,
    reviews: 210,
    image: "/lovable-uploads/124c9240-d734-40d5-aaad-699471ad9889.png"
  }
];

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("sakshi");
  const [userEmail, setUserEmail] = useState("sb1712567@gmail.com");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [wishlistCount, setWishlistCount] = useState(7);
  const [totalOrders, setTotalOrders] = useState(12);
  const [herbalPoints, setHerbalPoints] = useState(860);
  const [xp, setXp] = useState(450);
  const [lifetimePoints, setLifetimePoints] = useState(960);
  const [recentConsultations, setRecentConsultations] = useState<any[]>([]);

  // Load information from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem("herbalgarden_username");
    if (savedName) setUserName(savedName);

    const savedEmail = localStorage.getItem("herbalgarden_email");
    if (savedEmail) setUserEmail(savedEmail);

    const savedImg = localStorage.getItem("profile_image");
    if (savedImg) setProfileImage(savedImg);

    // Get actual wishlist count
    const savedWishlist = localStorage.getItem("shop_wishlist");
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) setWishlistCount(parsed.length || 7);
      } catch (e) {}
    }

    // Get actual orders count
    const savedOrdersHistory = localStorage.getItem("orders_history_count");
    if (savedOrdersHistory) {
      setTotalOrders(Number(savedOrdersHistory));
    }

    // Fetch consultations
    const savedConsultations = localStorage.getItem("booked_consultations");
    if (savedConsultations) {
      try {
        setRecentConsultations(JSON.parse(savedConsultations));
      } catch (e) {}
    }

    // Fetch XP & Points dynamically
    const savedXp = localStorage.getItem("ayurvista_journey_xp");
    const savedPoints = localStorage.getItem("herbal_points_balance");
    const savedLifetime = localStorage.getItem("lifetime_points_earned");

    if (savedXp) setXp(Number(savedXp));
    if (savedPoints) setHerbalPoints(Number(savedPoints));
    if (savedLifetime) setLifetimePoints(Number(savedLifetime));
  }, []);

  const getLevelInfo = (currentXp: number) => {
    if (currentXp >= 600) return { title: "Gold Explorer", rank: 4, nextXp: 1000, progress: 100 };
    if (currentXp >= 350) return { title: "Herbal Researcher", rank: 3, nextXp: 600, progress: ((currentXp - 350) / 250) * 100 };
    if (currentXp >= 150) return { title: "Plant Explorer", rank: 2, nextXp: 350, progress: ((currentXp - 150) / 200) * 100 };
    return { title: "Beginner Herbalist", rank: 1, nextXp: 150, progress: (currentXp / 150) * 100 };
  };

  const levelInfo = getLevelInfo(xp);

  const handleConvertXp = () => {
    if (xp < 100) {
      toast({
        title: "Insufficient XP",
        description: "You need at least 100 XP to convert into points.",
        variant: "destructive"
      });
      return;
    }
    const xpToConvert = Math.floor(xp / 100) * 100;
    const pointsEarned = (xpToConvert / 100) * 10;
    
    const newXp = xp - xpToConvert;
    const newPoints = herbalPoints + pointsEarned;
    const newLifetime = lifetimePoints + pointsEarned;

    setXp(newXp);
    setHerbalPoints(newPoints);
    setLifetimePoints(newLifetime);

    localStorage.setItem("ayurvista_journey_xp", String(newXp));
    localStorage.setItem("herbal_points_balance", String(newPoints));
    localStorage.setItem("lifetime_points_earned", String(newLifetime));

    toast({
      title: "XP Converted!",
      description: `Successfully converted ${xpToConvert} XP into ${pointsEarned} Herbal Points!`
    });
  };

  const handleEditProfile = () => {
    const newName = prompt("Enter your Name:", userName);
    const newEmail = prompt("Enter your Email:", userEmail);
    
    if (newName !== null && newName.trim() !== "") {
      setUserName(newName);
      localStorage.setItem("herbalgarden_username", newName);
    }
    if (newEmail !== null && newEmail.trim() !== "") {
      setUserEmail(newEmail);
      localStorage.setItem("herbalgarden_email", newEmail);
    }

    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved."
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfileImage(url);
    localStorage.setItem("profile_image", url);
    toast({
      title: "Avatar Uploaded",
      description: "Your new profile picture has been set."
    });
  };

  // Mock Order matches image data exactly
  const mockOrder = {
    id: "AYV-1023",
    product: "Herbal Skin Kit",
    amount: 1499,
    discount: 100,
    total: 1399,
    date: "12 Aug 2025",
    itemsCount: 3,
    image: "/lovable-uploads/4569bb5e-341b-40ca-a57d-012a38c41449.png",
    emails: ["Order Confirmation", "Invoice Generated", "Care Guide Sent"],
  };

  const timelineSteps = [
    { label: "Order Placed", date: "08 Aug 2025", completed: true },
    { label: "Confirmed", date: "08 Aug 2025", completed: true },
    { label: "Packed", date: "09 Aug 2025", completed: true },
    { label: "Shipped", date: "10 Aug 2025", completed: true },
    { label: "Delivered", date: "12 Aug 2025", completed: true }
  ];

  const handleDownloadInvoice = () => {
    const docContent = `AYURVISTA INVOICE
==============================
Order ID: ${mockOrder.id}
Date: ${mockOrder.date}
Product: ${mockOrder.product} (${mockOrder.itemsCount} Items)
------------------------------
Subtotal: ₹${mockOrder.amount}
Discount: -₹${mockOrder.discount}
Delivery: FREE
------------------------------
Total Paid: ₹${mockOrder.total}
==============================
Thank you for supporting Ayurvedic wellness!
`;
    const blob = new Blob([docContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${mockOrder.id}.txt`;
    link.click();

    toast({
      title: "Invoice Downloaded",
      description: `Invoice PDF for order ${mockOrder.id} saved.`
    });
  };

  const handleDownloadConsultationSummary = (docName: string) => {
    const content = `AYURVISTA CONSULTATION SUMMARY
====================================
Doctor: ${docName}
Date: 12 Aug 2025, 10:30 AM
Status: Completed
Diagnosis: Healthy skin wellness check.
Recommendations:
- Neem Skin Purifier twice daily
- Avoid dry spices in food
- Drink 3L warm water
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Consultation-Summary-${docName.replace(/\s+/g, "-")}.txt`;
    link.click();

    toast({
      title: "Summary Downloaded",
      description: `Consultation report from ${docName} saved.`
    });
  };

  const handleAddRecommendedToCart = (p: RecommendedProduct) => {
    const savedCart = localStorage.getItem("shop_cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    const existing = cart.find((item: any) => item.id === p.id);
    let newCart;
    if (existing) {
      newCart = cart.map((item: any) =>
        item.id === p.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 }];
    }

    localStorage.setItem("shop_cart", JSON.stringify(newCart));
    toast({
      title: "Added to Cart",
      description: `${p.name} added to your cart successfully!`
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F8F5] text-[#1D3D18] font-sans pb-16">
      <GlobalNavigation />

      <div className="pt-28 container mx-auto px-4 max-w-7xl space-y-6">

        {/* 1. USER PROFILE HEADER & STATS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Profile Details */}
          <Card className="lg:col-span-5 bg-white border border-[#E1EDE4] shadow-sm rounded-2xl flex flex-col justify-center">
            <CardContent className="flex items-center gap-6 p-6">
              
              {/* Profile Image & Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-[#B93E59] overflow-hidden flex items-center justify-center text-white text-3xl font-extrabold shadow-md">
                  {profileImage ? (
                    <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    userName.charAt(0).toUpperCase()
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 bg-[#1D3D18] hover:bg-[#2D6A4F] text-white p-1.5 rounded-full cursor-pointer shadow-md transition-all">
                  <Pencil size={12} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>

              {/* Text Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-[#1D3D18]">{userName}</h2>
                  <button
                    onClick={handleEditProfile}
                    className="text-xs text-[#2D6A4F] hover:text-[#1D3D18] font-bold underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-xs text-[#5C6E5A] font-semibold">{userEmail}</p>
                
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge className="bg-[#EAF2EC] text-[#2D6A4F] border border-[#C5DCD0] font-bold text-[10px] py-0.5 px-2">
                    🌱 {levelInfo.title}
                  </Badge>
                  <span className="text-[10px] text-[#7A8C78]">
                    Member since {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Points Card */}
            <Card className="bg-white border border-[#E1EDE4] shadow-sm rounded-2xl hover:-translate-y-0.5 transition-transform duration-200">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[#EAF2EC] text-[#2D6A4F]">
                    <Award size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-[#5C6E5A]">Herbal Points</span>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#1D3D18]">{herbalPoints}</p>
                  <button onClick={() => navigate("/virtual-garden")} className="text-[9px] font-bold text-[#2D6A4F] flex items-center gap-0.5 mt-1 hover:underline">
                    Earn in Garden <ArrowRight size={10} />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Level XP Card */}
            <Card className="bg-white border border-[#E1EDE4] shadow-sm rounded-2xl hover:-translate-y-0.5 transition-transform duration-200">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[#FFF9E6] text-amber-500">
                    <Star size={18} className="fill-amber-500" />
                  </div>
                  <span className="text-[10px] font-bold text-[#5C6E5A]">Level</span>
                </div>
                <div>
                  <p className="text-xs font-black text-[#1D3D18]">{levelInfo.title}</p>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${levelInfo.progress}%` }} />
                  </div>
                  <p className="text-[8px] text-[#7A8C78] mt-1">XP: {xp} / {levelInfo.nextXp}</p>
                </div>
              </CardContent>
            </Card>

            {/* Total Orders Card */}
            <Card className="bg-white border border-[#E1EDE4] shadow-sm rounded-2xl hover:-translate-y-0.5 transition-transform duration-200">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[#EAF2EC] text-[#2D6A4F]">
                    <ShoppingBag size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-[#5C6E5A]">Total Orders</span>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#1D3D18]">{totalOrders}</p>
                  <button onClick={() => navigate("/shop")} className="text-[9px] font-bold text-[#2D6A4F] flex items-center gap-0.5 mt-1 hover:underline">
                    View all orders <ArrowRight size={10} />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Wishlist Card */}
            <Card className="bg-white border border-[#E1EDE4] shadow-sm rounded-2xl hover:-translate-y-0.5 transition-transform duration-200">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[#FFEAF0] text-pink-500">
                    <Heart size={18} className="fill-pink-500" />
                  </div>
                  <span className="text-[10px] font-bold text-[#5C6E5A]">Wishlist</span>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#1D3D18]">{wishlistCount}</p>
                  <button onClick={() => navigate("/shop")} className="text-[9px] font-bold text-[#2D6A4F] flex items-center gap-0.5 mt-1 hover:underline">
                    View wishlist <ArrowRight size={10} />
                  </button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* 2. MAIN LAYOUT COLUMNS (Order Activity + Rewards Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Order Activity & Consultations */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Recent Order Activity Card */}
            <Card className="bg-white border border-[#E1EDE4] shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-2 border-b border-[#F0F6F1]">
                  <h3 className="text-base font-extrabold flex items-center gap-2">
                    <ShoppingBag size={18} className="text-[#2D6A4F]" />
                    Recent Order Activity
                  </h3>
                  <button onClick={() => navigate("/shop")} className="text-xs font-bold text-[#2D6A4F] hover:underline flex items-center gap-1">
                    View All Orders <ArrowRight size={12} />
                  </button>
                </div>

                {/* Details layout */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#F4F8F5] border border-[#E1EDE4] p-2 flex items-center justify-center flex-shrink-0">
                      <img src={mockOrder.image} alt="product" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-[#1D3D18]">{mockOrder.product}</h4>
                        <Badge className="bg-[#EAF2EC] text-[#2D6A4F] font-bold text-[9px] hover:bg-[#EAF2EC] border border-[#C5DCD0] px-1.5 py-0">
                          Delivered
                        </Badge>
                      </div>
                      <p className="text-xs text-[#7A8C78] mt-0.5">Order ID: <span className="font-bold text-[#1D3D18]">{mockOrder.id}</span></p>
                      <p className="text-[10px] text-[#95A5A0] mt-1">{mockOrder.date} | {mockOrder.itemsCount} Items</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 self-stretch md:self-auto justify-between md:justify-end">
                    <span className="text-lg font-black text-[#1D3D18]">₹{mockOrder.total}</span>
                    <Button
                      onClick={() => navigate("/order-tracking")}
                      className="bg-transparent hover:bg-[#F4F8F5] border border-[#C5DCD0] text-[#2D6A4F] font-bold text-xs rounded-xl h-8 px-3"
                    >
                      Order Details
                    </Button>
                  </div>
                </div>

                {/* Tracking Progress Timeline */}
                <div className="relative pt-4 pb-2">
                  <div className="absolute top-[28px] left-[5%] right-[5%] h-0.5 bg-[#E1EDE4] z-0" />
                  <div className="absolute top-[28px] left-[5%] right-[5%] h-0.5 bg-[#2D6A4F] z-0" style={{ width: "90%" }} />
                  
                  <div className="grid grid-cols-5 text-center relative z-10">
                    {timelineSteps.map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shadow-md border-2 border-white">
                          <Check size={10} className="stroke-[3]" />
                        </div>
                        <span className="text-[10px] font-black mt-2 text-[#1D3D18]">{step.label}</span>
                        <span className="text-[9px] text-[#7A8C78]">{step.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email confirmations checklist */}
                <div className="flex flex-wrap items-center gap-4 bg-[#F4F8F5] border border-[#E1EDE4] p-3.5 rounded-xl text-xs text-[#5C6E5A]">
                  <span className="font-bold text-[#1D3D18]">Emails Sent:</span>
                  {mockOrder.emails.map((email, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-[#EAF2EC] border border-[#C5DCD0] text-[#2D6A4F] flex items-center justify-center">
                        <Check size={9} className="stroke-[3]" />
                      </div>
                      <span className="font-medium">{email}</span>
                    </div>
                  ))}
                </div>

                {/* Order total footer & invoice download */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center border-t border-[#F0F6F1] pt-4 gap-4">
                  <div className="flex gap-6 text-xs text-[#5C6E5A]">
                    <div>
                      <span>Subtotal</span>
                      <p className="font-extrabold text-[#1D3D18]">₹{mockOrder.amount}</p>
                    </div>
                    <div>
                      <span>Discount</span>
                      <p className="font-extrabold text-red-500">-₹{mockOrder.discount}</p>
                    </div>
                    <div>
                      <span>Shipping</span>
                      <p className="font-extrabold text-green-600">FREE</p>
                    </div>
                    <div className="border-l border-[#E1EDE4] pl-6">
                      <span>Total</span>
                      <p className="font-black text-sm text-[#1D3D18]">₹{mockOrder.total}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleDownloadInvoice}
                    className="bg-[#1D3D18] hover:bg-[#2D6A4F] text-white font-bold text-xs rounded-xl h-10 px-5 flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Download size={14} />
                    Download Invoice (PDF)
                  </Button>
                </div>

              </CardContent>
            </Card>

            {/* Recent Consultations Card */}
            <Card className="bg-white border border-[#E1EDE4] shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-4">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-2 border-b border-[#F0F6F1]">
                  <h3 className="text-base font-extrabold flex items-center gap-2">
                    <UserPlus size={18} className="text-[#2D6A4F]" />
                    Your Recent Consultations
                  </h3>
                  <button onClick={() => navigate("/consultation")} className="text-xs font-bold text-[#2D6A4F] hover:underline flex items-center gap-1">
                    View All Consultations <ArrowRight size={12} />
                  </button>
                </div>

                {/* Booked Consultations List */}
                <div className="space-y-4 divide-y divide-[#F0F6F1]">
                  {recentConsultations.length > 0 ? (
                    recentConsultations.map((consult, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 first:pt-0">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#EAF2EC] text-[#2D6A4F] font-bold flex items-center justify-center text-lg flex-shrink-0 border border-[#C5DCD0]">
                            Doc
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-[#1D3D18]">{consult.doctor}</h4>
                              <Badge className="bg-[#EAF2EC] text-[#2D6A4F] font-bold text-[9px] hover:bg-[#EAF2EC] border border-[#C5DCD0]">
                                {consult.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-[#7A8C78] mt-0.5">{consult.details}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between sm:justify-end">
                          <div className="text-right text-xs">
                            <p className="font-extrabold text-[#1D3D18]">{consult.date}</p>
                            <p className="text-[#7A8C78] mt-0.5">{consult.timeSlot}</p>
                          </div>
                          <Button
                            onClick={() => handleDownloadConsultationSummary(consult.doctor)}
                            className="bg-transparent hover:bg-[#F4F8F5] border border-[#C5DCD0] text-[#2D6A4F] font-bold text-xs rounded-xl h-8 px-4"
                          >
                            View Summary
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Default mockup consultation if none is booked
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#EAF2EC] overflow-hidden flex items-center justify-center flex-shrink-0 border border-[#C5DCD0]">
                          <span className="font-extrabold text-[#2D6A4F]">DrA</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-[#1D3D18]">Dr. Ananya Sharma</h4>
                            <Badge className="bg-[#EAF2EC] text-[#2D6A4F] font-bold text-[9px] hover:bg-[#EAF2EC] border border-[#C5DCD0] px-1.5 py-0">
                              Completed
                            </Badge>
                          </div>
                          <p className="text-xs text-[#7A8C78] mt-0.5">Ayurveda Expert • Skin & Hair Specialist</p>
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-amber-500 font-bold">
                            <Star size={11} className="fill-amber-500" />
                            <span>4.8 Rating</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between sm:justify-end">
                        <div className="text-right text-xs">
                          <p className="font-extrabold text-[#1D3D18]">12 Aug 2025</p>
                          <p className="text-[#7A8C78] mt-0.5">10:30 AM</p>
                        </div>
                        <Button
                          onClick={() => handleDownloadConsultationSummary("Dr. Ananya Sharma")}
                          className="bg-transparent hover:bg-[#F4F8F5] border border-[#C5DCD0] text-[#2D6A4F] font-bold text-xs rounded-xl h-8 px-4"
                        >
                          View Summary
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>

          </div>

          {/* RIGHT COLUMN: Herbal Rewards & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Herbal Points & Rewards Panel */}
            <Card className="bg-white border border-[#E1EDE4] shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-6">
                
                {/* Points balance and illustration */}
                <div className="flex justify-between items-start gap-4 pb-2 border-b border-[#F0F6F1]">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8C78]">Herbal Points & Rewards</h3>
                    <p className="text-xs text-[#5C6E5A] mt-1">Your Balance</p>
                    <p className="text-2xl font-black text-[#1D3D18]">{herbalPoints} <span className="text-xs font-bold text-[#7A8C78]">Points</span></p>
                  </div>
                  
                  {/* Gift graphic mockup */}
                  <div className="w-14 h-14 bg-[#EAF2EC] border border-[#C5DCD0] rounded-xl flex items-center justify-center text-[#2D6A4F]">
                    <Gift size={28} className="animate-bounce" />
                  </div>
                </div>

                {/* Gamified XP Progress inside Rewards */}
                <div className="space-y-2.5 bg-[#F4F8F5] border border-[#E1EDE4] p-4 rounded-xl">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#1D3D18]">Garden Level XP</span>
                    <span className="font-extrabold text-[#2D6A4F]">{xp} XP</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${levelInfo.progress}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-[#7A8C78]">
                    <span>Lifetime Points: {lifetimePoints}</span>
                    <span>Next Level: {levelInfo.nextXp} XP</span>
                  </div>
                  
                  {xp >= 100 && (
                    <Button
                      onClick={handleConvertXp}
                      className="w-full bg-[#EAF2EC] border border-[#C5DCD0] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white font-bold text-[10px] h-7 mt-2 flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw size={11} />
                      Convert XP to Points (100 XP = 10 pts)
                    </Button>
                  )}
                </div>

                {/* Redeem alert and CTA */}
                <div className="space-y-3">
                  <div className="bg-[#EAF2EC] border border-[#C5DCD0] text-[#2D6A4F] p-3 rounded-xl text-center text-xs font-bold">
                    You can redeem up to ₹{Math.floor(herbalPoints * 0.1)} on your next order!
                  </div>
                  <Button
                    onClick={() => {
                      navigate("/shop");
                      toast({ title: "Shop & Redeem", description: "Select products and redeem your points at checkout!" });
                    }}
                    className="w-full bg-[#1D3D18] hover:bg-[#2D6A4F] text-[#E2ECE9] font-bold rounded-xl py-3 shadow-md transition-all text-xs"
                  >
                    Redeem Points
                  </Button>
                </div>

                {/* How to Earn Points checklist */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold text-[#1D3D18]">How to Earn Points</h4>
                  <div className="space-y-2.5">
                    {[
                      { label: "Discover Herbs in Virtual Garden", pts: "+3 pts + 25 XP" },
                      { label: "Daily Garden Quiz", pts: "+5 pts + 50 XP" },
                      { label: "Purchase in Shop (10% back)", pts: "10% points" },
                      { label: "Book a Consultation", pts: "+30 pts" },
                      { label: "Refer a Friend", pts: "+100 pts" }
                    ].map((act, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-[#5C6E5A] font-semibold text-left pr-2">{act.label}</span>
                        <span className="bg-[#EAF2EC] text-[#2D6A4F] border border-[#C5DCD0] font-bold text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap">
                          {act.pts}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => navigate("/virtual-garden")} className="text-[10px] font-bold text-[#2D6A4F] hover:underline flex items-center gap-0.5 mt-2">
                    Enter the Virtual Garden <ArrowRight size={10} />
                  </button>
                </div>

              </CardContent>
            </Card>

            {/* Quick Actions Panel */}
            <Card className="bg-white border border-[#E1EDE4] shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-sm font-extrabold text-[#1D3D18]">Quick Actions</h3>
                
                <div className="grid grid-cols-2 gap-3 text-center">
                  
                  {/* My Orders */}
                  <div
                    onClick={() => navigate("/shop")}
                    className="bg-[#F4F8F5] border border-[#E1EDE4] hover:border-[#2D6A4F] hover:bg-[#EAF2EC] p-3 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                  >
                    <div className="p-2 rounded-lg bg-white border border-[#E1EDE4] text-[#2D6A4F]">
                      <ShoppingBag size={16} />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#1D3D18]">My Orders</span>
                  </div>

                  {/* My Consultations */}
                  <div
                    onClick={() => navigate("/consultation")}
                    className="bg-[#F4F8F5] border border-[#E1EDE4] hover:border-[#2D6A4F] hover:bg-[#EAF2EC] p-3 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                  >
                    <div className="p-2 rounded-lg bg-white border border-[#E1EDE4] text-[#2D6A4F]">
                      <UserPlus size={16} />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#1D3D18]">My Consultations</span>
                  </div>

                  {/* Saved Addresses */}
                  <div
                    onClick={() => toast({ title: "Addresses", description: "Default Address: 23, Green Avenue, Civil Lines" })}
                    className="bg-[#F4F8F5] border border-[#E1EDE4] hover:border-[#2D6A4F] hover:bg-[#EAF2EC] p-3 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                  >
                    <div className="p-2 rounded-lg bg-white border border-[#E1EDE4] text-[#2D6A4F]">
                      <MapPin size={16} />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#1D3D18]">My Addresses</span>
                  </div>

                  {/* Payment Methods */}
                  <div
                    onClick={() => toast({ title: "Payment Methods", description: "Linked Card: **** **** **** 4321 (VISA)" })}
                    className="bg-[#F4F8F5] border border-[#E1EDE4] hover:border-[#2D6A4F] hover:bg-[#EAF2EC] p-3 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                  >
                    <div className="p-2 rounded-lg bg-white border border-[#E1EDE4] text-[#2D6A4F]">
                      <CreditCard size={16} />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#1D3D18]">Payment Methods</span>
                  </div>

                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* 3. RECOMMENDED PRODUCTS & REFERRAL CARD ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recommended Products Row */}
          <Card className="lg:col-span-8 bg-white border border-[#E1EDE4] shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-4">
              
              <div className="flex items-center gap-2 pb-1">
                <Sparkles size={16} className="text-[#2D6A4F]" />
                <h3 className="text-sm font-extrabold text-[#1D3D18]">Recommended for You</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#F4F8F5] border border-[#E1EDE4] p-3 rounded-xl flex flex-col justify-between hover:shadow-md transition-all group"
                  >
                    <div className="h-24 bg-white border border-[#E1EDE4] rounded-lg p-1.5 flex items-center justify-center overflow-hidden">
                      <img src={p.image} alt={p.name} className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="mt-2 space-y-1">
                      <h4 className="text-[10px] font-extrabold truncate text-[#1D3D18]">{p.name}</h4>
                      <div className="flex items-center gap-1 text-[9px] text-amber-500">
                        <Star size={10} className="fill-amber-500" />
                        <span>{p.rating} ({p.reviews})</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-xs font-black text-[#1D3D18]">₹{p.price}</span>
                        <button
                          onClick={() => handleAddRecommendedToCart(p)}
                          className="bg-white border border-[#C5DCD0] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white rounded-md p-1 transition-all"
                        >
                          <ShoppingBag size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

          {/* Referral Card */}
          <Card className="lg:col-span-4 bg-gradient-to-br from-[#EAF2EC] to-[#D5EADF] border border-[#C5DCD0] shadow-sm rounded-2xl flex flex-col justify-between overflow-hidden relative">
            <CardContent className="p-6 flex flex-col justify-between h-full space-y-4 z-10">
              <div className="space-y-1.5">
                <h3 className="text-sm font-black text-[#1D3D18]">Refer & Earn</h3>
                <p className="text-xs text-[#5C6E5A] leading-relaxed">
                  Invite your friends and earn <span className="font-bold text-[#1D3D18]">100 points</span> each when they make their first order.
                </p>
              </div>

              <div className="flex justify-between items-end gap-4">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText("https://ayurvista.com/referral-code/AVS860");
                    toast({ title: "Referral Link Copied!", description: "Share the link with your friends to earn points." });
                  }}
                  className="bg-[#1D3D18] hover:bg-[#2D6A4F] text-[#E2ECE9] font-bold text-xs rounded-xl h-9 px-4 shadow-sm"
                >
                  Refer Now
                </Button>
                
                <div className="flex items-center gap-1 bg-white/70 border border-white/60 p-1.5 rounded-lg text-[9px] font-bold text-[#2D6A4F]">
                  <Gift size={11} />
                  <span>Code: AVS860</span>
                </div>
              </div>
            </CardContent>
            
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#a8e063]/10 rounded-full filter blur-xl pointer-events-none" />
          </Card>

        </div>

      </div>
    </div>
  );
};

export default Profile;
