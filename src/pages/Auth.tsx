import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import "./auth.css";

const Auth = ({ initialMode = "login" }: { initialMode?: "login" | "register" }) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const navigate = useNavigate();

  const isLogin = mode === "login";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    /* ✅ THIS WAS MISSING — AUTH TOKEN */
    const fakeToken = `token_${Date.now()}`;
    localStorage.setItem("auth_token", fakeToken);

    /* Optional but good practice */
    localStorage.setItem(
      "herbalgarden_username",
      isLogin ? "User" : "New User"
    );
    localStorage.setItem("herbalgarden_email", "demo@email.com");

    toast.success(isLogin ? "Logged in!" : "Account created!");

    /* ✅ Now ProtectedRoute will allow access */
    navigate("/", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className={`auth-container ${isLogin ? "" : "signup-active"}`}>

        {/* LEFT PANEL */}
        <div className="panel left-panel">
          <h1>WELCOME!</h1>
          <p>
            {isLogin
              ? "Already a member? Please login."
              : "Create account?"}
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel right-panel">
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <User size={18} />
                <input type="text" placeholder="Username" required />
              </div>
            )}

            <div className="input-group">
              <Mail size={18} />
              <input type="email" placeholder="Email" required />
            </div>

            <div className="input-group">
              <Lock size={18} />
              <input type="password" placeholder="Password" required />
            </div>

            <button type="submit" className="auth-btn">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="switch-text">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <span onClick={() => setMode("register")}>Sign Up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => setMode("login")}>Login</span>
              </>
            )}
          </p>
        </div>

        {/* DIAGONAL SHAPE */}
        <div className="diagonal-shape" />
      </div>
    </div>
  );
};

export default Auth;
