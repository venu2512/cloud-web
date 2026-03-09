require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const Stats = require("./models/Stats");

const app = express();


// ================= SECURITY =================
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);


// ================= MIDDLEWARE =================
app.use(cors({
  origin: "https://cloud-web-two.vercel.app"
}));

app.use(express.json());


// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Nova Backend Running");
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
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.path}`
  });
});


// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});