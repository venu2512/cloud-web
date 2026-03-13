require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const Stats = require("./models/Stats");

// ================= DEBUG =================
console.log("JWT SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");

// ================= APP INIT =================
const app = express();
app.set("trust proxy", 1);

// ================= SECURITY =================
app.use(helmet());

// ================= RATE LIMIT =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: {
    message: "Too many requests, please try again later."
  }
});

// Apply rate limit only to API
app.use("/api", limiter);

// ================= MIDDLEWARE =================

<<<<<<< HEAD
 const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
=======
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
>>>>>>> 8079725 (backend/.envbackenfrontend/src/pages/Dashboard.tsxd/sbackend/config/mail.jserver.jsffrontend/src/pages/Monitoring.tsxrontenfrontend/src/pages/VirtualMachines.tsxd/src/pages/Login.tsxfrfrfrontend/src/config/api.tsontend/src/main.tsxonfrontend/src/pages/Signup.tsxtend/README.md)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

<<<<<<< HEAD
const isOriginAllowed = (origin) => {
  if (!origin || allowedOrigins.length === 0) {
    return true;
  }

  return allowedOrigins.some((pattern) => {
    if (pattern === origin) {
      return true;
    }

    if (!pattern.includes("*")) {
      return false;
    }

    const regexPattern = `^${pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*")}$`;

    return new RegExp(regexPattern).test(origin);
  });
};

app.use(cors({
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
=======
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
>>>>>>> 8079725 (backend/.envbackenfrontend/src/pages/Dashboard.tsxd/sbackend/config/mail.jserver.jsffrontend/src/pages/Monitoring.tsxrontenfrontend/src/pages/VirtualMachines.tsxd/src/pages/Login.tsxfrfrfrontend/src/config/api.tsontend/src/main.tsxonfrontend/src/pages/Signup.tsxtend/README.md)
      return callback(null, true);
    }

    return callback(new Error("CORS not allowed"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).send("Nova Backend Running 🚀");
});

// ================= ROUTES =================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/vms", require("./routes/vms"));
app.use("/api/monitoring", require("./routes/monitoring"));

// ================= LEGACY STATS =================
app.get("/api/stats", async (req, res) => {
  try {

    let stats = await Stats.findOne();

    if (!stats) {
      stats = await Stats.create({
        totalServers: 12,
        running: 8,
        cpu: "42%",
        storage: "1.2 TB"
      });
    }

    res.json(stats);

  } catch (error) {

    console.error("Stats Error:", error);

    res.status(500).json({
      message: "Server Error"
    });

  }
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.path}`
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

const startServer = async () => {

  try {

    console.log("Connecting to MongoDB...");

    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (err) {

    console.error("❌ MongoDB failed to connect:", err.message);

    process.exit(1);

  }

};

startServer();