import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      // ✅ SAVE TOKEN + USER
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Account created 🌿");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e7f3ec] via-[#d6eadf] to-[#c5dfd4]">
      <div className="w-full max-w-5xl h-[560px] bg-white rounded-3xl shadow-2xl flex overflow-hidden flex-row-reverse">

        {/* RIGHT */}
        <div className="w-1/2 bg-gradient-to-br from-[#2f6f4e] to-[#1f4f3a] text-white p-12 flex flex-col justify-center">
          <Leaf size={56} className="mb-6" />
          <h1 className="text-4xl font-bold mb-3">AyurVista</h1>
          <p className="text-lg opacity-90">
            Join the herbal journey 🌱
          </p>
        </div>

        {/* LEFT */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-[#1A2417] mb-6">
            Create Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
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
              {loading ? "Creating..." : "Register"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#2f6f4e] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
