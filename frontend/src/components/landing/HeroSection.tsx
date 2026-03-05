import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";

const stats = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "30+",    label: "Regions" },
  { value: "10ms",   label: "Avg Latency" },
  { value: "50K+",   label: "Developers" },
];

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{ background: "linear-gradient(160deg, #020B18 0%, #041428 55%, #060D20 100%)" }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00C8FF" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Glow orbs */}
      <div className="absolute pointer-events-none" style={{ width: 700, height: 700, top: "10%", left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(0,120,255,0.07) 0%, transparent 65%)", borderRadius: "50%" }} />
      <div className="absolute pointer-events-none" style={{ width: 400, height: 400, bottom: 0, right: "10%", background: "radial-gradient(circle, rgba(0,200,255,0.05) 0%, transparent 65%)", borderRadius: "50%" }} />

      <div className="container relative z-10 mx-auto px-6 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-10"
          style={{
            background: "rgba(0,200,255,0.05)",
            border: "1px solid rgba(0,200,255,0.2)",
            fontFamily: "'Courier New', monospace",
            fontSize: "11px",
            letterSpacing: "0.12em",
            color: "rgba(0,200,255,0.8)",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          NOW IN GENERAL AVAILABILITY
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-bold leading-tight mx-auto"
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
            maxWidth: "820px",
            color: "#ffffff",
            letterSpacing: "-0.01em",
          }}
        >
          Deploy cloud infrastructure{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #00C8FF, #0080FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            in seconds
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 mx-auto"
          style={{
            maxWidth: "560px",
            fontSize: "17px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.4)",
            fontFamily: "Georgia, serif",
          }}
        >
          Scalable compute, storage, and networking — all in one platform.
          Built for developers who move fast.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/signup"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(90deg, #0050FF, #00C8FF)",
              boxShadow: "0 0 28px rgba(0,200,255,0.25)",
              fontFamily: "'Courier New', monospace",
              fontSize: "13px",
              letterSpacing: "0.05em",
            }}
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#pricing"
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200"
            style={{
              border: "1px solid rgba(0,200,255,0.25)",
              color: "rgba(0,200,255,0.8)",
              fontFamily: "'Courier New', monospace",
              fontSize: "13px",
              letterSpacing: "0.05em",
            }}
          >
            View Pricing
          </a>
        </motion.div>

        {/* Terminal preview */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-16 mx-auto rounded-xl overflow-hidden"
          style={{
            maxWidth: "580px",
            background: "rgba(4,20,40,0.9)",
            border: "1px solid rgba(0,200,255,0.12)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,200,255,0.05)",
          }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(0,200,255,0.08)", background: "rgba(0,0,0,0.2)" }}>
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
            <div className="flex items-center gap-1.5 ml-2" style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", color: "rgba(0,200,255,0.4)" }}>
              <Terminal className="h-3 w-3" />
              cloudnova cli
            </div>
          </div>
          {/* Terminal body */}
          <div className="px-5 py-5 text-left space-y-2" style={{ fontFamily: "'Courier New', monospace", fontSize: "12px" }}>
            <div style={{ color: "rgba(0,200,255,0.5)" }}>$ cloudnova vm create --name web-prod-01 --cpu 4 --ram 8gb</div>
            <div style={{ color: "rgba(255,255,255,0.3)" }}>  ✔ Provisioning instance in us-east-1...</div>
            <div style={{ color: "rgba(255,255,255,0.3)" }}>  ✔ Assigning IP address: 10.0.1.24</div>
            <div style={{ color: "rgba(255,255,255,0.3)" }}>  ✔ Configuring firewall rules...</div>
            <div style={{ color: "#00C8FF" }}>  ✔ Server is live in 4.2s 🚀</div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-bold"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  background: "linear-gradient(90deg, #fff, #00C8FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Courier New', monospace", letterSpacing: "0.1em" }}>
                {stat.label.toUpperCase()}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}