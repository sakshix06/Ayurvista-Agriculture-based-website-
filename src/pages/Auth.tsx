import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Mail, Lock, User, Eye, EyeOff, Calendar, ShieldCheck, BrainCircuit, CheckCircle2, Users } from "lucide-react";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function Auth({ initialMode = "login" }: { initialMode?: "login" | "register" }) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
     const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }
      
      // Clear old state
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("herbalgarden_username");
      localStorage.removeItem("herbalgarden_email");
      localStorage.removeItem("herbalgarden_user_id");
      localStorage.removeItem("profile_image");

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("herbalgarden_username", data.user.name);
      localStorage.setItem("herbalgarden_email", data.user.email);
      if (data.user.id) localStorage.setItem("herbalgarden_user_id", data.user.id);
      
      toast.success(`Welcome back ${data.user.name} 🌿`);
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (err) {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const targetUrl = API_URL ? `${API_URL}/api/auth/google` : '/api/auth/google';
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Google login failed");
        return;
      }
      
      // Clear old state before setting new user
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("herbalgarden_username");
      localStorage.removeItem("herbalgarden_email");
      localStorage.removeItem("herbalgarden_user_id");
      localStorage.removeItem("profile_image");
      
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("herbalgarden_username", data.user.name);
      localStorage.setItem("herbalgarden_email", data.user.email);
      if (data.user.id) localStorage.setItem("herbalgarden_user_id", data.user.id);
      if (data.user.picture) localStorage.setItem("profile_image", data.user.picture);
      
      toast.success(`Welcome ${data.user.name} 🌿`);
      
      // Dispatch storage event to notify other components (like Navbar) of auth change
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (err) {
      toast.error("Server error during Google login.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }
      
      // Clear old state
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("herbalgarden_username");
      localStorage.removeItem("herbalgarden_email");
      localStorage.removeItem("herbalgarden_user_id");
      localStorage.removeItem("profile_image");

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("herbalgarden_username", data.user.name);
      localStorage.setItem("herbalgarden_email", data.user.email);
      if (data.user.id) localStorage.setItem("herbalgarden_user_id", data.user.id);
      
      toast.success("Account created 🌿");
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (err) {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants removed
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a150f] text-white relative overflow-hidden font-sans pt-12 pb-12">
      {/* Background gradients and particles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#1a4028] rounded-full blur-[120px] opacity-60 mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#0e3b1c] rounded-full blur-[120px] opacity-60 mix-blend-screen" />
      </div>

      {/* Main Container */}
      <div className="z-10 w-full max-w-5xl px-4 flex flex-col items-center">
        
        <div className="relative w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(10,35,20,0.4)] flex overflow-hidden min-h-[650px] p-2">
          
          {/* Left Panel */}
          <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#1c3f27]/40 to-[#0e2716]/40 rounded-[2rem] p-12 flex-col justify-between overflow-hidden border border-white/5">
            <div className="z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#599e52] p-2 rounded-full">
                  <Leaf className="text-white w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Ayur<span className="text-[#a4d792]">vista</span></h1>
              </div>
              <p className="text-gray-300 text-sm tracking-wide">Virtual Herbal Garden</p>
            </div>
            
            <div className="z-10 relative mt-8 flex-grow flex items-center justify-center">
               <div 
                 className="relative w-64 h-64 bg-gradient-to-b from-white/10 to-transparent rounded-t-full border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(89,158,82,0.2)]"
               >
                 {/* Placeholder for the dome/plant */}
                 <div className="absolute inset-0 rounded-t-full bg-gradient-to-t from-[#1b3a26] to-transparent opacity-80" />
                 <Leaf className="w-24 h-24 text-[#8cc678] z-10 drop-shadow-[0_0_15px_rgba(140,198,120,0.6)]" />
                 
                 {/* Static mini leaves */}
                 <div className="absolute top-10 left-10">
                    <Leaf className="w-4 h-4 text-[#8cc678] opacity-60" />
                 </div>
                 <div className="absolute top-20 right-10">
                    <Leaf className="w-6 h-6 text-[#8cc678] opacity-70" />
                 </div>
               </div>
            </div>

            <div className="z-10 mt-8 text-center">
              <p className="text-[#a8d39f] font-medium italic text-lg">"Explore the healing power of nature, digitally."</p>
            </div>
            
            {/* Soft decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4CAF50] rounded-full blur-[100px] opacity-20" />
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div 
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full max-w-md mx-auto"
                >
                  <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome <span className="text-[#8cc678]">Back!</span></h2>
                  <p className="text-gray-400 mb-8 text-sm">Login to continue your herbal journey</p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 bg-black/20 border-white/10 text-white placeholder:text-gray-500 h-14 rounded-xl focus:border-[#599e52] focus:ring-1 focus:ring-[#599e52] transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12 bg-black/20 border-white/10 text-white placeholder:text-gray-500 h-14 rounded-xl focus:border-[#599e52] focus:ring-1 focus:ring-[#599e52] transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" className="border-white/20 data-[state=checked]:bg-[#599e52]" />
                        <label htmlFor="remember" className="text-gray-400 cursor-pointer hover:text-white transition-colors">Remember Me</label>
                      </div>
                      <Link to="/forgot-password" className="text-[#8cc678] hover:text-[#a4d792] transition-colors">Forgot Password?</Link>
                    </div>

                    <Button
                      disabled={loading}
                      className="w-full h-14 bg-gradient-to-r from-[#447a3e] to-[#599e52] hover:from-[#4b8a44] hover:to-[#65b35d] text-white rounded-xl text-lg font-medium shadow-[0_4px_20px_rgba(89,158,82,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                      <Leaf className="w-5 h-5" />
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </form>

                  <div className="mt-8 flex items-center justify-between">
                    <div className="h-px bg-white/10 flex-grow" />
                    <span className="px-4 text-xs text-gray-500 uppercase tracking-widest">Or continue with</span>
                    <div className="h-px bg-white/10 flex-grow" />
                  </div>

                  <div className="flex justify-center mt-6">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error("Google Login Failed")}
                    />
                  </div>

                  <p className="mt-8 text-center text-gray-400">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => setIsLogin(false)} className="text-[#8cc678] font-medium hover:text-[#a4d792] transition-colors">
                      Sign Up
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full max-w-md mx-auto"
                >
                  <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Create <span className="text-[#8cc678]">Account</span></h2>
                  <p className="text-gray-400 mb-6 text-sm">Start your journey towards natural living</p>

                  <form onSubmit={handleRegister} className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 bg-black/20 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-[#599e52] focus:ring-1 focus:ring-[#599e52] transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 bg-black/20 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-[#599e52] focus:ring-1 focus:ring-[#599e52] transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12 bg-black/20 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-[#599e52] focus:ring-1 focus:ring-[#599e52] transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-12 pr-12 bg-black/20 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-[#599e52] focus:ring-1 focus:ring-[#599e52] transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="pl-12 bg-black/20 border-white/10 text-gray-400 h-12 rounded-xl focus:border-[#599e52] focus:ring-1 focus:ring-[#599e52] transition-all [color-scheme:dark]"
                      />
                    </div>

                    <div className="flex items-start space-x-3 py-2 text-sm">
                      <Checkbox 
                        id="terms" 
                        checked={agreed}
                        onCheckedChange={(c) => setAgreed(c as boolean)}
                        className="border-white/20 data-[state=checked]:bg-[#599e52] mt-1" 
                      />
                      <label htmlFor="terms" className="text-gray-400 leading-tight">
                        I agree to the <Link to="/terms" className="text-[#8cc678] hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-[#8cc678] hover:underline">Privacy Policy</Link>
                      </label>
                    </div>

                    <Button
                      disabled={loading}
                      className="w-full h-12 mt-2 bg-gradient-to-r from-[#447a3e] to-[#599e52] hover:from-[#4b8a44] hover:to-[#65b35d] text-white rounded-xl font-medium shadow-[0_4px_20px_rgba(89,158,82,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                      <Leaf className="w-5 h-5" />
                      {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                  </form>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="h-px bg-white/10 flex-grow" />
                    <span className="px-4 text-[10px] text-gray-500 uppercase tracking-widest">Or sign up with</span>
                    <div className="h-px bg-white/10 flex-grow" />
                  </div>

                  <div className="flex justify-center mt-4">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error("Google Signup Failed")}
                    />
                  </div>

                  <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setIsLogin(true)} className="text-[#8cc678] font-medium hover:text-[#a4d792] transition-colors">
                      Login
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Footer Features Bar */}
      <div className="z-10 w-full max-w-5xl mt-6 px-4 hidden md:block">
         <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-4 px-8 flex justify-between items-center w-full shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#8cc678]" />
               </div>
               <div>
                  <h4 className="text-white text-sm font-medium">Secure & Safe</h4>
                  <p className="text-gray-400 text-xs">Protected data with top security</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-[#8cc678]" />
               </div>
               <div>
                  <h4 className="text-white text-sm font-medium">AI Powered</h4>
                  <p className="text-gray-400 text-xs">Smart herbal insights at your fingertips</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#8cc678]" />
               </div>
               <div>
                  <h4 className="text-white text-sm font-medium">100% Natural</h4>
                  <p className="text-gray-400 text-xs">Rooted in Ayurveda, backed by AI</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#8cc678]" />
               </div>
               <div>
                  <h4 className="text-white text-sm font-medium">Trusted by 10K+</h4>
                  <p className="text-gray-400 text-xs">Thousands trust Ayurvista every day</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
