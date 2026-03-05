import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: ["Compute", "Storage", "Networking", "Security", "Pricing"],
  },
  {
    title: "Resources",
    links: ["Documentation", "API Reference", "Status", "Blog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Privacy"],
  },
];

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #041428 0%, #020B18 100%)",
        borderTop: "1px solid rgba(0,200,255,0.08)",
      }}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00C8FF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-6 pt-16 pb-8">

        {/* Main footer grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14"
        >
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 30, height: 30,
                  background: "linear-gradient(135deg, #0a1f3d, #0d2a54)",
                  border: "1px solid rgba(0,200,255,0.2)",
                }}
              >
                <svg width="14" height="10" viewBox="0 0 38 28" fill="none">
                  <path d="M30.5 12.5C30.5 12 30.5 11.5 30.5 11.5C30.5 7.36 27.14 4 23 4C19.96 4 17.36 5.76 16.08 8.32C15.24 7.84 14.26 7.5 13.2 7.5C9.97 7.5 7.35 10.12 7.35 13.35C7.35 13.57 7.37 13.79 7.4 14H7C4.24 14 2 16.24 2 19C2 21.76 4.24 24 7 24H30.5C33.54 24 36 21.54 36 18.5C36 15.72 33.96 13.44 31.28 13.02C31.1 12.84 30.82 12.64 30.5 12.5Z" fill="url(#fg)" />
                  <defs>
                    <linearGradient id="fg" x1="2" y1="4" x2="36" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00C8FF" /><stop offset="1" stopColor="#0080FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span
                className="font-bold"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "13px",
                  letterSpacing: "0.2em",
                  background: "linear-gradient(90deg, #fff, #00C8FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                CLOUDNOVA
              </span>
            </Link>

            <p style={{ fontFamily: "Georgia, serif", fontSize: "13.5px", color: "rgba(255,255,255,0.3)", lineHeight: 1.7, maxWidth: "200px" }}>
              Modern cloud infrastructure for every developer.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Github, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{
                    width: 32, height: 32,
                    background: "rgba(0,200,255,0.05)",
                    border: "1px solid rgba(0,200,255,0.1)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.3)";
                    (e.currentTarget as HTMLElement).style.color = "#00C8FF";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)";
                  }}
                >
                  <Icon style={{ width: 14, height: 14 }} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4
                className="mb-5"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "rgba(0,200,255,0.6)",
                }}
              >
                {section.title.toUpperCase()}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "13.5px",
                        color: "rgba(255,255,255,0.3)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(0,200,255,0.8)")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(0,200,255,0.06)" }}
        >
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
            © 2026 CloudNova. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", color: "rgba(0,200,255,0.4)", letterSpacing: "0.08em" }}>
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}