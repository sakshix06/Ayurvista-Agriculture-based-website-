import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { clearStoredToken } from "@/lib/auth";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("herbalgarden_username");
    setUsername(storedUser || "User");
    const onStorage = () => {
      const updatedUser = localStorage.getItem("herbalgarden_username");
      setUsername(updatedUser || "User");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    localStorage.removeItem("herbalgarden_username");
    clearStoredToken();
    navigate("/login");
  };

  // Main navigation bar with "Other Features" dropdown
  return (
    <nav className="absolute top-0 w-full z-50 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-white font-bold text-xl">
            AYUSH Virtual Herbal Garden
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center
                ${location.pathname === "/dashboard" ? "bg-white/10 font-semibold" : ""}
              `}
            >Home</Link>
            <Link
              to="/explore"
              className={`px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center
                ${location.pathname === "/explore" ? "bg-white/10 font-semibold" : ""}
              `}
            >Explore</Link>
            <Link
              to="/virtual-tour"
              className={`px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center
                ${location.pathname === "/virtual-tour" ? "bg-white/10 font-semibold" : ""}
              `}
            >Virtual Tour</Link>
            {/* Other Features Dropdown */}
            <div className="relative group">
              <button
                className="px-4 py-2 flex items-center text-white bg-transparent hover:bg-white/10 rounded-lg font-semibold transition-colors"
              >
                Other Features
                <svg className="ml-1 w-4 h-4" viewBox="0 0 20 20"><path fill="currentColor" d="M5.293 7.293L10 12l4.707-4.707-1.414-1.414L10 9.172 6.707 5.879z" /></svg>
              </button>
              <div className="hidden group-hover:block absolute z-20 mt-1 bg-white shadow-lg rounded-lg">
                <Link to="/immunity-booster" className="block px-5 py-2 text-green-700 hover:bg-green-100">Immunity Booster</Link>
                <Link to="/skincare" className="block px-5 py-2 text-green-700 hover:bg-green-100">Skincare</Link>
                <Link to="/ai" className="block px-5 py-2 text-green-700 hover:bg-green-100">AI</Link>
              </div>
            </div>
            <Link
              to="/bookmarks"
              className={`px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center
                ${location.pathname === "/bookmarks" ? "bg-white/10 font-semibold" : ""}
              `}
            >
              <Bookmark size={18} className="mr-1" />
              Bookmarks
            </Link>
            <span className="px-3 text-white/80">{username}</span>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:bg-white/10 ml-4"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
