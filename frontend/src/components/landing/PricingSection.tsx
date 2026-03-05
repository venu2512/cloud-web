import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "12",
    description: "Perfect for side projects and early-stage startups.",
    features: [
      "2 vCPU / 4 GB RAM",
      "50 GB SSD Storage",
      "1 TB Bandwidth",
      "1 Region",
      "Community Support",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "49",
    description: "For growing teams that need more power and reliability.",
    features: [
      "8 vCPU / 16 GB RAM",
      "200 GB SSD Storage",
      "5 TB Bandwidth",
      "5 Regions",
      "Priority Support",
      "Auto Scaling",
      "DDoS Protection",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "199",
    description: "Custom infrastructure for large-scale production workloads.",
    features: [
      "32 vCPU / 128 GB RAM",
      "2 TB SSD Storage",
      "Unlimited Bandwidth",
      "All 30+ Regions",
      "24/7 Dedicated Support",
      "SLA Guarantee",
      "Custom Networking",
      "Compliance Ready",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative py-28 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020B18 0%, #041428 100%)" }}
    >
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="price-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00C8FF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#price-grid)" />
        </svg>
      </div>

      {/* Glow behind Pro card */}
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, top: "30%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(0,80,255,0.07) 0%, transparent 70%)", borderRadius: "50%" }} />

      <div className="container relative z-10 mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
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
            SIMPLE PRICING
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#ffffff",
              fontWeight: "bold",
              lineHeight: 1.2,
            }}
          >
            Pay only for what{" "}
            <span style={{ background: "linear-gradient(90deg, #00C8FF, #0080FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              you use
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 mx-auto"
            style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "rgba(255,255,255,0.35)", maxWidth: "400px", lineHeight: 1.7 }}
          >
            No hidden fees. No surprises. Cancel any time.
          </motion.p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl p-7 flex flex-col"
              style={{
                background: plan.highlight
                  ? "linear-gradient(160deg, rgba(0,80,255,0.12), rgba(0,200,255,0.05))"
                  : "rgba(4,20,40,0.6)",
                border: plan.highlight
                  ? "1px solid rgba(0,200,255,0.3)"
                  : "1px solid rgba(0,200,255,0.08)",
                boxShadow: plan.highlight
                  ? "0 0 60px rgba(0,200,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
                  : "none",
                marginTop: plan.highlight ? "-8px" : "0",
              }}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "linear-gradient(90deg, #0050FF, #00C8FF)",
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: "0.1em",
                    color: "#fff",
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              {/* Plan name */}
              <p
                className="text-xs font-semibold mb-4"
                style={{
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: "0.2em",
                  color: plan.highlight ? "#00C8FF" : "rgba(0,200,255,0.5)",
                }}
              >
                {plan.name.toUpperCase()}
              </p>

              {/* Price */}
              <div className="flex items-end gap-1 mb-2">
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>$</span>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(2.5rem, 5vw, 3.2rem)", fontWeight: "bold", color: "#fff", lineHeight: 1 }}>
                  {plan.price}
                </span>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>/mo</span>
              </div>

              <p style={{ fontFamily: "Georgia, serif", fontSize: "13.5px", color: "rgba(255,255,255,0.35)", lineHeight: 1.6, marginBottom: "24px" }}>
                {plan.description}
              </p>

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(0,200,255,0.08)", marginBottom: "20px" }} />

              {/* Features */}
              <ul className="flex flex-col gap-3 flex-1 mb-7">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5">
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{ width: 18, height: 18, background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.2)" }}
                    >
                      <Check style={{ width: 10, height: 10, color: "#00C8FF" }} />
                    </div>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: "13.5px", color: "rgba(255,255,255,0.5)" }}>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/signup"
                className="block text-center py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: "0.05em",
                  background: plan.highlight
                    ? "linear-gradient(90deg, #0050FF, #00C8FF)"
                    : "transparent",
                  border: plan.highlight
                    ? "none"
                    : "1px solid rgba(0,200,255,0.2)",
                  color: plan.highlight ? "#fff" : "rgba(0,200,255,0.7)",
                  boxShadow: plan.highlight ? "0 0 24px rgba(0,200,255,0.2)" : "none",
                }}
              >
                {plan.cta} →
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
          style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "rgba(255,255,255,0.25)" }}
        >
          All plans include free SSL, automated backups, and 24/7 infrastructure monitoring.
        </motion.p>
      </div>
    </section>
  );
}