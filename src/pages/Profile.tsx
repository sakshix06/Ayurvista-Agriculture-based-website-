import GlobalNavigation from "@/components/GlobalNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Bookmark, Download, ShoppingBag } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { getBookmarks } from "@/utils/bookmarks";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { t } = useI18n();

  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(
    localStorage.getItem("profile_image")
  );

  useEffect(() => {
    setBookmarks(getBookmarks());
    const onStorage = () => setBookmarks(getBookmarks());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const userName = localStorage.getItem("herbalgarden_username") || "User";
  const userEmail = localStorage.getItem("herbalgarden_email") || "user@example.com";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfileImage(url);
    localStorage.setItem("profile_image", url);
  };

  // 🔹 Mock Order (college-friendly, realistic)
  const mockOrder = {
    id: "AYV-1023",
    product: "Herbal Skin Kit",
    amount: 1499,
    discount: 100,
    total: 1399,
    date: "12 Aug 2025",
    emails: ["Order Confirmation", "Invoice Generated", "Care Guide Sent"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-emerald-50 to-green-100">
      <GlobalNavigation />

      <div className="pt-28 container mx-auto px-4 pb-16 max-w-5xl space-y-8">

        {/* 🌿 USER HEADER */}
        <Card className="bg-green-50/80 backdrop-blur-md border-green-200">
          <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-600 overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-white w-10 h-10" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-green-700 text-white text-xs px-2 py-1 rounded cursor-pointer">
                Edit
                <input type="file" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-900">{userName}</h2>
              <p className="text-gray-600">{userEmail}</p>
              <p className="mt-1 text-sm text-green-700">
                🌱 Herbal Explorer • Member since {new Date().getFullYear()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 📦 ORDER ACTIVITY */}
        <Card className="bg-white/80 backdrop-blur-md border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <ShoppingBag className="w-5 h-5" />
              Recent Order Activity
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">{mockOrder.product}</span>
              <span>{mockOrder.date}</span>
            </div>

            <div className="text-sm">
              Order ID: <span className="font-medium">{mockOrder.id}</span>
            </div>

            <div className="text-sm">
              Emails Sent:
              <ul className="list-disc ml-5 mt-1">
                {mockOrder.emails.map((mail, i) => (
                  <li key={i}>{mail}</li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{mockOrder.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-₹{mockOrder.discount}</span>
              </div>
              <div className="flex justify-between font-semibold text-green-800">
                <span>Total</span>
                <span>₹{mockOrder.total}</span>
              </div>
            </div>

            <Button className="bg-green-700 hover:bg-green-800">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice (PDF)
            </Button>
          </CardContent>
        </Card>

        {/* 🔖 BOOKMARKS PREVIEW */}
        <Card className="bg-white/80 backdrop-blur-md border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Bookmark className="w-5 h-5" />
              Your Herbal Journal
            </CardTitle>
          </CardHeader>

          <CardContent>
            {bookmarks.length === 0 ? (
              <p className="text-gray-600">No plants bookmarked yet 🌿</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {bookmarks.slice(0, 3).map((plant, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-green-50 border border-green-200 text-center text-sm font-medium"
                  >
                    🌿 {plant.name || "Saved Plant"}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Link to="/bookmarks">
                <Button variant="outline" className="border-green-600 text-green-700">
                  View All Bookmarks
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ⚡ QUICK ACTIONS */}
        <Card className="bg-white/80 backdrop-blur-md border-green-200">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/explore"><Button variant="outline" className="w-full">🌿 Explore</Button></Link>
              <Link to="/ai"><Button variant="outline" className="w-full">🤖 AI</Button></Link>
              <Link to="/virtual-tour"><Button variant="outline" className="w-full">🧘 Garden</Button></Link>
              <Link to="/shop"><Button variant="outline" className="w-full">📦 Orders</Button></Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Profile;
