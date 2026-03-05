const express = require("express");
const router = express.Router();
const VM = require("../models/VM");

// GET /api/monitoring/metrics
router.get("/metrics", async (req, res) => {
  try {
    const vms = await VM.find({ status: "running" });
    const runningCount = vms.length;

    // Simulate per-VM metrics (replace with real agent data later)
    const vmMetrics = vms.map((vm) => ({
      id: vm._id,
      name: vm.name,
      region: vm.region,
      cpu: Math.floor(20 + Math.random() * 60),    // %
      ram: Math.floor(30 + Math.random() * 50),    // %
      network: Math.floor(10 + Math.random() * 80), // Mbps
      uptime: "99.98%"
    }));

    // Aggregate 24h timeseries
    const cpuHistory = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: Math.floor(25 + Math.random() * 50)
    }));

    const networkHistory = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      inbound: Math.floor(10 + Math.random() * 80),
      outbound: Math.floor(5 + Math.random() * 40)
    }));

    res.json({
      summary: {
        runningVMs: runningCount,
        avgCpu: vmMetrics.length
          ? Math.round(vmMetrics.reduce((s, v) => s + v.cpu, 0) / vmMetrics.length)
          : 0,
        avgRam: vmMetrics.length
          ? Math.round(vmMetrics.reduce((s, v) => s + v.ram, 0) / vmMetrics.length)
          : 0,
        alerts: 0
      },
      vmMetrics,
      cpuHistory,
      networkHistory
    });

  } catch (error) {
    console.error("Monitoring metrics error:", error);
    res.status(500).json({ message: "Failed to fetch monitoring data" });
  }
});

module.exports = router;