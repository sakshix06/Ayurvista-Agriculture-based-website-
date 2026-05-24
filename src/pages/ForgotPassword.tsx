import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, KeyRound, Lock, Leaf } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    try {
      setLoading(true);
      const targetUrl = API_URL ? `${API_URL}/api/auth/forgot-password-otp` : '/api/auth/forgot-password-otp';
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.message || "Failed to send OTP");
        return;
      }
      
      toast.success(data.message);
      setStep(2);
    } catch (err) {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const targetUrl = API_URL ? `${API_URL}/api/auth/reset-password` : '/api/auth/reset-password';
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.message || "Failed to reset password");
        return;
      }
      
      toast.success(data.message);
      navigate("/login");
    } catch (err) {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e7f3ec] via-[#d6eadf] to-[#c5dfd4]">
      <div className="w-full max-w-5xl h-[560px] bg-white rounded-3xl shadow-2xl flex overflow-hidden">

        {/* LEFT */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#2f6f4e] to-[#1f4f3a] text-white p-12 flex-col justify-center">
          <Leaf size={56} className="mb-6" />
          <h1 className="text-4xl font-bold mb-3">AyurVista</h1>
          <p className="text-lg opacity-90">
            Secure your natural healing journey 🌱
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-[#1A2417] mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-500 mb-6">
            {step === 1 ? "Enter your email to reset your password" : "Enter OTP and your new password"}
          </p>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2f6f4e] hover:bg-[#24563d] text-white rounded-full h-11 mt-2"
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2f6f4e] hover:bg-[#24563d] text-white rounded-full h-11 mt-2"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center w-full">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link to="/login" className="text-[#2f6f4e] font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
