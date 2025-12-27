import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";

// Pages
import Index from "./pages/Index";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import PlantDetail from "./pages/PlantDetail";
import VirtualTour from "./pages/VirtualTour";
import VirtualGarden from "./pages/VirtualGarden";
import AdvancedSearch from "./pages/AdvancedSearch";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import Bookmarks from "./pages/Bookmarks";
import ImmunityBooster from "./pages/ImmunityBooster";
import Skincare from "./pages/Skincare";
import PlantBlog from "./pages/PlantBlog";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AIPage from "./pages/AI";
import Profile from "./pages/Profile";
import Consultation from "./pages/Consultation";
import Cancel from "./pages/Cancel";
import Success from "./pages/Success";

const queryClient = new QueryClient();

/* =======================
   Protected Route Wrapper
======================= */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const check = () => {
      setAuth(isAuthenticated());
      setLoading(false);
    };
    check();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 to-green-200">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return auth ? <>{children}</> : <Navigate to="/login" replace />;
};

/* =======================
          App
======================= */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/index" element={<Index />} />
            <Route
              path="/login"
              element={isAuthenticated() ? <Navigate to="/" replace /> : <Auth />}
            />
            <Route
              path="/register"
              element={isAuthenticated() ? <Navigate to="/" replace /> : <Auth />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />

            {/* Protected */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
            <Route path="/plant/:plantId" element={<ProtectedRoute><PlantDetail /></ProtectedRoute>} />
            <Route path="/virtual-tour" element={<ProtectedRoute><VirtualTour /></ProtectedRoute>} />
            <Route path="/virtual-garden" element={<ProtectedRoute><VirtualGarden /></ProtectedRoute>} />
            <Route path="/immunity-booster" element={<ProtectedRoute><ImmunityBooster /></ProtectedRoute>} />
            <Route path="/skincare" element={<ProtectedRoute><Skincare /></ProtectedRoute>} />
            <Route path="/plant-blog" element={<ProtectedRoute><PlantBlog /></ProtectedRoute>} />
            <Route path="/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
            <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute><AIPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
