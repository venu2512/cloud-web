import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

import API_BASE_URL from "@/config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [slowWarning, setSlowWarning] = useState(false);
  const navigate = useNavigate();

  // Keep backend alive
  useEffect(() => {
   fetch(`${API_BASE_URL}/`).catch(() => {});
    const interval = setInterval(() => {
    fetch(`${API_BASE_URL}/`).catch(() => {});
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSlowWarning(false);

    const timer = setTimeout(() => setSlowWarning(true), 5000);

    try {
           const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      clearTimeout(timer);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      toast.success("OTP sent to your email!");
      setOtpSent(true);

    } catch (error) {
      clearTimeout(timer);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
      setSlowWarning(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSlowWarning(false);

    const timer = setTimeout(() => setSlowWarning(true), 5000);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      clearTimeout(timer);
      const data = await res.json();

      if (!res.ok) {
        toast.error("Invalid or expired OTP");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login Successful!");
      navigate("/dashboard");

    } catch (error) {
      clearTimeout(timer);
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
      setSlowWarning(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020B18 0%, #041428 60%, #060D20 100%)" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00C8FF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glow orbs */}
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, top: -100, left: -100, background: "radial-gradient(circle, rgba(0,120,255,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
      <div className="absolute pointer-events-none" style={{ width: 400, height: 400, bottom: -80, right: -80, background: "radial-gradient(circle, rgba(0,200,255,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />

      {/* Card */}
      <div className="relative z-10 w-full mx-4" style={{ maxWidth: "420px" }}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex items-center justify-center rounded-2xl mb-4"
            style={{
              width: 56, height: 56,
              background: "linear-gradient(135deg, #0a1f3d 0%, #0d2a54 100%)",
              border: "1px solid rgba(0,200,255,0.25)",
              boxShadow: "0 0 30px rgba(0,200,255,0.1)",
            }}
          >
            <svg width="28" height="20" viewBox="0 0 38 28" fill="none">
              <path d="M30.5 12.5C30.5 12.5 30.5 12 30.5 11.5C30.5 7.36 27.14 4 23 4C19.96 4 17.36 5.76 16.08 8.32C15.24 7.84 14.26 7.5 13.2 7.5C9.97 7.5 7.35 10.12 7.35 13.35C7.35 13.57 7.37 13.79 7.4 14H7C4.24 14 2 16.24 2 19C2 21.76 4.24 24 7 24H30.5C33.54 24 36 21.54 36 18.5C36 15.72 33.96 13.44 31.28 13.02C31.1 12.84 30.82 12.64 30.5 12.5Z" fill="url(#cg)" />
              <defs>
                <linearGradient id="cg" x1="2" y1="4" x2="36" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00C8FF" />
                  <stop offset="1" stopColor="#0080FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1
            className="font-bold tracking-widest uppercase"
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "15px",
              background: "linear-gradient(90deg, #ffffff, #00C8FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.3em",
            }}
          >
            NimbuCloud
          </h1>
          <p style={{ color: "rgba(0,200,255,0.45)", fontSize: "11px", letterSpacing: "0.15em", marginTop: 2 }}>
            SIGN IN TO YOUR ACCOUNT
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(4, 20, 40, 0.85)",
            border: "1px solid rgba(0,200,255,0.12)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
          }}
        >
          <form onSubmit={otpSent ? verifyOtp : handleLogin} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", color: "rgba(0,200,255,0.6)", letterSpacing: "0.1em" }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={otpSent}
                className="w-full rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(0,200,255,0.15)",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  opacity: otpSent ? 0.5 : 1,
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,200,255,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(0,200,255,0.15)")}
              />
            </div>

            {/* Password - hidden after OTP sent */}
            {!otpSent && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", color: "rgba(0,200,255,0.6)", letterSpacing: "0.1em" }}>
                    PASSWORD
                  </label>
                  <a href="#" style={{ fontSize: "11px", color: "rgba(0,200,255,0.45)", textDecoration: "none" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#00C8FF")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(0,200,255,0.45)")}
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,200,255,0.15)",
                    fontSize: "14px",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,200,255,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(0,200,255,0.15)")}
                />
              </div>
            )}

            {/* OTP input - shown after login */}
            {otpSent && (
              <div className="flex flex-col gap-1.5">
                <label style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", color: "rgba(0,200,255,0.6)", letterSpacing: "0.1em" }}>
                  ENTER OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  autoFocus
                  maxLength={6}
                  className="w-full rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,200,255,0.15)",
                    fontSize: "18px",
                    letterSpacing: "0.5em",
                    textAlign: "center",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,200,255,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(0,200,255,0.15)")}
                />
                <p style={{ fontSize: "11px", color: "rgba(0,200,255,0.4)", marginTop: 2, textAlign: "center" }}>
                  Check your email — OTP expires in 5 minutes
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 font-semibold text-white transition-all duration-200 mt-2"
              style={{
                background: loading ? "rgba(0,100,200,0.4)" : "linear-gradient(90deg, #0050FF, #00C8FF)",
                boxShadow: loading ? "none" : "0 0 24px rgba(0,200,255,0.25)",
                fontSize: "14px",
                letterSpacing: "0.05em",
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  {otpSent ? "Verifying..." : "Signing in..."}
                </span>
              ) : (
                <span>{otpSent ? "Verify OTP →" : "Sign In →"}</span>
              )}
            </button>

            {/* Cold start warning */}
            {slowWarning && (
              <p style={{ fontSize: "12px", color: "rgba(0,200,255,0.6)", textAlign: "center", marginTop: 4 }}>
                ⏳ Server is waking up, please wait up to 60 seconds...
              </p>
            )}

          </form>

          {/* Signup link */}
          <div className="mt-6 text-center">
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "#00C8FF", textDecoration: "none", fontWeight: 600 }}>
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6" style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
          Protected by 256-bit SSL encryption.
        </p>
      </div>
    </div>
  );
};

export default Login;
