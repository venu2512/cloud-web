const express = require("express");
const router = express.Router();
const Stats = require("../models/Stats");

// GET /api/dashboard/metrics
router.get("/metrics", async (req, res) => {
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

    // Generate 24h chart history (simulated — replace with real data if you have it)
    const cpuHistory = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: Math.floor(30 + Math.random() * 40)
    }));

    const ramHistory = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: Math.floor(50 + Math.random() * 30)
    }));

    res.json({
      stats: {
        totalServers: stats.totalServers,
        runningServers: stats.running,
        avgCpu: parseInt(stats.cpu),
        storageUsed: stats.storage
      },
      cpuHistory,
      ramHistory
    });

  } catch (error) {
    console.error("Dashboard metrics error:", error);
    res.status(500).json({ message: "Failed to fetch metrics" });
  }
});

module.exports = router;