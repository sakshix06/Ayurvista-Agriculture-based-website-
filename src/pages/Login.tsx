import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      // ✅ SAVE TOKEN + USER
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome back ${data.user.name} 🌿`);
      navigate("/dashboard");
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
        <div className="w-1/2 bg-gradient-to-br from-[#2f6f4e] to-[#1f4f3a] text-white p-12 flex flex-col justify-center">
          <Leaf size={56} className="mb-6" />
          <h1 className="text-4xl font-bold mb-3">AyurVista</h1>
          <p className="text-lg opacity-90">
            Discover the healing power of nature 🌿
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-[#1A2417] mb-6">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              disabled={loading}
              className="w-full bg-[#2f6f4e] hover:bg-[#24563d] text-white rounded-full h-11"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-[#2f6f4e] font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
