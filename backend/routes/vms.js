const express = require("express");
const router = express.Router();
const VM = require("../models/VM");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Add this

// Helper to generate a fake IP for new VMs
const randomIP = () =>
  `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

// GET /api/vms — list all VMs (no auth required if public, else add authMiddleware)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const vms = await VM.find().sort({ createdAt: -1 });

    // Seed some demo data if empty
    if (vms.length === 0) {
      const demo = await VM.insertMany([
        { name: "web-server-01", cpu: 4, ram: 8, storage: 100, region: "us-east-1", os: "ubuntu-22", status: "running", ip: "10.0.1.42" },
        { name: "db-primary", cpu: 8, ram: 32, storage: 500, region: "us-west-2", os: "ubuntu-22", status: "running", ip: "10.0.2.15" },
        { name: "cache-node", cpu: 2, ram: 4, storage: 50, region: "eu-west-1", os: "debian-11", status: "stopped", ip: "10.0.3.88" },
      ]);
      return res.json(demo);
    }

    res.json(vms);
  } catch (error) {
    console.error("VMs list error:", error);
    res.status(500).json({ message: "Failed to fetch VMs" });
  }
});

// POST /api/vms — create a new VM (requires auth)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, cpu, ram, storage, region, os } = req.body;

    if (!name || !cpu || !ram || !storage || !region || !os) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vm = await VM.create({
      name,
      cpu: Number(cpu),
      ram: Number(ram),
      storage: Number(storage),
      region,
      os,
      status: "pending",
      ip: randomIP(),
    });

    // Simulate provisioning: flip to running after 3 seconds
    setTimeout(async () => {
      await VM.findByIdAndUpdate(vm._id, { status: "running" });
    }, 3000);

    res.status(201).json(vm);
  } catch (error) {
    console.error("VM create error:", error);
    res.status(500).json({ message: "Failed to create VM" });
  }
});

// PUT /api/vms/:id/start — start a VM (requires auth)
router.put("/:id/start", authMiddleware, async (req, res) => {
  try {
    const vm = await VM.findByIdAndUpdate(req.params.id, { status: "running" }, { new: true });
    if (!vm) return res.status(404).json({ message: "VM not found" });
    res.json(vm);
  } catch (error) {
    console.error("VM start error:", error);
    res.status(500).json({ message: "Failed to start VM" });
  }
});

// PUT /api/vms/:id/stop — stop a VM (requires auth)
router.put("/:id/stop", authMiddleware, async (req, res) => {
  try {
    const vm = await VM.findByIdAndUpdate(req.params.id, { status: "stopped" }, { new: true });
    if (!vm) return res.status(404).json({ message: "VM not found" });
    res.json(vm);
  } catch (error) {
    console.error("VM stop error:", error);
    res.status(500).json({ message: "Failed to stop VM" });
  }
});

// DELETE /api/vms/:id — delete a VM (requires auth)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const vm = await VM.findByIdAndDelete(req.params.id);
    if (!vm) return res.status(404).json({ message: "VM not found" });
    res.json({ message: "VM deleted", id: req.params.id });
  } catch (error) {
    console.error("VM delete error:", error);
    res.status(500).json({ message: "Failed to delete VM" });
  }
});

module.exports = router;