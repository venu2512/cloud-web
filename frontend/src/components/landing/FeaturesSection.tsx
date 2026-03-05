import { motion } from "framer-motion";
import { Server, HardDrive, Network, Shield, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Server,
    title: "Compute",
    description: "Scalable virtual machines with auto-scaling and load balancing. Deploy in seconds, scale in milliseconds.",
    accent: "#00C8FF",
  },
  {
    icon: HardDrive,
    title: "Storage",
    description: "High-performance block, object, and file storage with 11 nines of durability across all regions.",
    accent: "#0080FF",
  },
  {
    icon: Network,
    title: "Networking",
    description: "Global VPC, CDN, and DNS management. Private networks and low-latency peering across 30+ regions.",
    accent: "#00C8FF",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Enterprise-grade firewalls, DDoS protection, and identity management built in from day one.",
    accent: "#0080FF",
  },
  {
    icon: Zap,
    title: "Auto Scaling",
    description: "Automatically scale up or down based on real-time traffic. Pay only for what you use.",
    accent: "#00C8FF",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Serve content from the edge with sub-10ms latency. 200+ PoPs worldwide for maximum performance.",
    accent: "#0080FF",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-28 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #060D20 0%, #020B18 100%)" }}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="feat-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00C8FF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#feat-grid)" />
        </svg>
      </div>

      {/* Glow */}
      <div className="absolute pointer-events-none" style={{ width: 600, height: 400, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, rgba(0,80,255,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />

      <div className="container relative z-10 mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{
              background: "rgba(0,200,255,0.05)",
              border: "1px solid rgba(0,200,255,0.2)",
              fontFamily: "'Courier New', monospace",
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: "rgba(0,200,255,0.7)",
            }}
          >
            PLATFORM CAPABILITIES
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold mx-auto"
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#ffffff",
              maxWidth: "600px",
              lineHeight: 1.2,
            }}
          >
            Everything you need{" "}
            <span style={{ background: "linear-gradient(90deg, #00C8FF, #0080FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              to build
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 mx-auto"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "16px",
              color: "rgba(255,255,255,0.35)",
              maxWidth: "440px",
              lineHeight: 1.7,
            }}
          >
            A complete cloud platform designed for performance, reliability, and simplicity.
          </motion.p>
        </div>

        {/* Feature cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group relative rounded-xl p-6 transition-all duration-300 cursor-default"
              style={{
                background: "rgba(4,20,40,0.6)",
                border: "1px solid rgba(0,200,255,0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.25)";
                (e.currentTarget as HTMLElement).style.background = "rgba(4,20,40,0.9)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(0,200,255,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.08)";
                (e.currentTarget as HTMLElement).style.background = "rgba(4,20,40,0.6)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg mb-5"
                style={{
                  background: `rgba(0,200,255,0.07)`,
                  border: `1px solid rgba(0,200,255,0.15)`,
                }}
              >
                <f.icon className="h-4.5 w-4.5" style={{ color: f.accent, width: 18, height: 18 }} />
              </div>

              {/* Content */}
              <h3
                className="font-semibold mb-2"
                style={{ fontFamily: "'Courier New', monospace", fontSize: "14px", color: "#fff", letterSpacing: "0.05em" }}
              >
                {f.title}
              </h3>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "13.5px", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
                {f.description}
              </p>

              {/* Corner accent */}
              <div
                className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top right, rgba(0,200,255,0.08), transparent 70%)`,
                  borderRadius: "0 12px 0 0",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}