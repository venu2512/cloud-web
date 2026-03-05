import { useEffect, useState } from "react";

const LoadingScreen = ({ onComplete }: { onComplete?: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done">("loading");
  const [activeNode, setActiveNode] = useState(0);

  const steps = [
    "Initializing cloud nodes...",
    "Establishing secure connection...",
    "Syncing infrastructure...",
    "Mounting storage clusters...",
    "Ready",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 4 + 1;
        if (next >= 100) {
          clearInterval(interval);
          setPhase("done");
          setTimeout(() => onComplete?.(), 800);
          return 100;
        }
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * (steps.length - 1));
    setActiveNode(Math.min(stepIndex, steps.length - 1));
  }, [progress]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        phase === "done" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(135deg, #020B18 0%, #041428 50%, #060D20 100%)",
      }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00C8FF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Glowing orbs */}
        <div
          className="absolute rounded-full"
          style={{
            width: "600px",
            height: "600px",
            top: "-200px",
            right: "-100px",
            background: "radial-gradient(circle, rgba(0,120,255,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "500px",
            height: "500px",
            bottom: "-150px",
            left: "-100px",
            background: "radial-gradient(circle, rgba(0,200,255,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-8" style={{ maxWidth: "480px", width: "100%" }}>

        {/* Logo / Icon */}
        <div className="relative flex items-center justify-center">
          {/* Rotating outer ring */}
          <svg
            className="absolute"
            width="140"
            height="140"
            viewBox="0 0 140 140"
            style={{ animation: "spin 4s linear infinite" }}
          >
            <circle
              cx="70" cy="70" r="65"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="1.5"
              strokeDasharray="8 6"
            />
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00C8FF" stopOpacity="1" />
                <stop offset="100%" stopColor="#0050FF" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Pulsing inner ring */}
          <svg
            className="absolute"
            width="110"
            height="110"
            viewBox="0 0 110 110"
            style={{ animation: "pulse 2s ease-in-out infinite" }}
          >
            <circle
              cx="55" cy="55" r="50"
              fill="none"
              stroke="#00C8FF"
              strokeWidth="0.8"
              strokeOpacity="0.3"
            />
          </svg>

          {/* Center cloud icon */}
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #0a1f3d 0%, #0d2a54 100%)",
              boxShadow: "0 0 40px rgba(0,200,255,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
              border: "1px solid rgba(0,200,255,0.2)",
            }}
          >
            <svg width="38" height="28" viewBox="0 0 38 28" fill="none">
              <path
                d="M30.5 12.5C30.5 12.5 30.5 12 30.5 11.5C30.5 7.36 27.14 4 23 4C19.96 4 17.36 5.76 16.08 8.32C15.24 7.84 14.26 7.5 13.2 7.5C9.97 7.5 7.35 10.12 7.35 13.35C7.35 13.57 7.37 13.79 7.4 14H7C4.24 14 2 16.24 2 19C2 21.76 4.24 24 7 24H30.5C33.54 24 36 21.54 36 18.5C36 15.72 33.96 13.44 31.28 13.02C31.1 12.84 30.82 12.64 30.5 12.5Z"
                fill="url(#cloudGrad)"
              />
              <defs>
                <linearGradient id="cloudGrad" x1="2" y1="4" x2="36" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00C8FF" />
                  <stop offset="1" stopColor="#0080FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1
            className="font-bold tracking-widest uppercase mb-1"
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "22px",
              background: "linear-gradient(90deg, #ffffff 0%, #00C8FF 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.3em",
            }}
          >
            NimbuCloud
          </h1>
          <p style={{ color: "rgba(0,200,255,0.5)", fontSize: "11px", letterSpacing: "0.2em" }}>
            INFRASTRUCTURE AS A SERVICE
          </p>
        </div>

        {/* Step indicator */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center gap-2" style={{ minHeight: "20px" }}>
            <span
              className="inline-block rounded-full"
              style={{
                width: "6px",
                height: "6px",
                background: "#00C8FF",
                boxShadow: "0 0 8px #00C8FF",
                animation: phase === "done" ? "none" : "blink 1s ease-in-out infinite",
              }}
            />
            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "12px",
                color: "rgba(0,200,255,0.8)",
                letterSpacing: "0.05em",
              }}
            >
              {steps[activeNode]}
            </p>
          </div>

          {/* Progress bar */}
          <div
            className="w-full rounded-full overflow-hidden"
            style={{
              height: "3px",
              background: "rgba(0,200,255,0.1)",
              border: "1px solid rgba(0,200,255,0.1)",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #0050FF, #00C8FF)",
                boxShadow: "0 0 10px rgba(0,200,255,0.6)",
              }}
            />
          </div>

          {/* Percentage */}
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i <= activeNode ? "16px" : "4px",
                    height: "4px",
                    background: i <= activeNode ? "#00C8FF" : "rgba(0,200,255,0.2)",
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "11px",
                color: "rgba(0,200,255,0.6)",
                letterSpacing: "0.1em",
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Node grid decoration */}
        <div className="flex gap-3 opacity-40">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                width: "8px",
                height: "8px",
                background: i <= activeNode ? "#00C8FF" : "rgba(0,200,255,0.2)",
                boxShadow: i <= activeNode ? "0 0 6px #00C8FF" : "none",
                transition: "all 0.4s ease",
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.6; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
