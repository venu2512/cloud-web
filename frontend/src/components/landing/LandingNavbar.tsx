import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#" },
];

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(2, 11, 24, 0.92)"
          : "transparent",
        borderBottom: scrolled ? "1px solid rgba(0,200,255,0.08)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
      }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="flex items-center justify-center rounded-lg transition-all duration-200 group-hover:shadow-lg"
            style={{
              width: 32, height: 32,
              background: "linear-gradient(135deg, #0a1f3d, #0d2a54)",
              border: "1px solid rgba(0,200,255,0.25)",
              boxShadow: "0 0 12px rgba(0,200,255,0.1)",
            }}
          >
            <svg width="16" height="12" viewBox="0 0 38 28" fill="none">
              <path d="M30.5 12.5C30.5 12 30.5 11.5 30.5 11.5C30.5 7.36 27.14 4 23 4C19.96 4 17.36 5.76 16.08 8.32C15.24 7.84 14.26 7.5 13.2 7.5C9.97 7.5 7.35 10.12 7.35 13.35C7.35 13.57 7.37 13.79 7.4 14H7C4.24 14 2 16.24 2 19C2 21.76 4.24 24 7 24H30.5C33.54 24 36 21.54 36 18.5C36 15.72 33.96 13.44 31.28 13.02C31.1 12.84 30.82 12.64 30.5 12.5Z" fill="url(#ng)" />
              <defs>
                <linearGradient id="ng" x1="2" y1="4" x2="36" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00C8FF" /><stop offset="1" stopColor="#0080FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span
            className="font-bold tracking-widest uppercase text-sm"
            style={{
              fontFamily: "'Courier New', monospace",
              background: "linear-gradient(90deg, #fff, #00C8FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.2em",
            }}
          >
            CloudNova
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm transition-colors duration-200"
              style={{
                fontFamily: "'Courier New', monospace",
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.08em",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#00C8FF")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm px-4 py-1.5 rounded-lg transition-all duration-200"
            style={{
              fontFamily: "'Courier New', monospace",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.05em",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="text-sm px-4 py-1.5 rounded-lg font-semibold transition-all duration-200"
            style={{
              fontFamily: "'Courier New', monospace",
              background: "linear-gradient(90deg, #0050FF, #00C8FF)",
              color: "#fff",
              letterSpacing: "0.05em",
              boxShadow: "0 0 16px rgba(0,200,255,0.2)",
            }}
          >
            Get Started →
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden transition-colors"
          style={{ color: "rgba(255,255,255,0.5)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
            style={{
              background: "rgba(2,11,24,0.97)",
              borderTop: "1px solid rgba(0,200,255,0.1)",
            }}
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm"
                  style={{ fontFamily: "'Courier New', monospace", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-sm py-2 rounded-lg"
                  style={{ border: "1px solid rgba(0,200,255,0.2)", color: "rgba(255,255,255,0.6)", fontFamily: "'Courier New', monospace" }}
                >
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-sm py-2 rounded-lg font-semibold"
                  style={{ background: "linear-gradient(90deg, #0050FF, #00C8FF)", color: "#fff", fontFamily: "'Courier New', monospace" }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}