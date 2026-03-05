const mongoose = require("mongoose");

const vmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cpu: { type: Number, required: true },       // cores
  ram: { type: Number, required: true },       // GB
  storage: { type: Number, required: true },  // GB
  region: { type: String, required: true },
  os: { type: String, required: true },
  status: {
    type: String,
    enum: ["running", "stopped", "pending"],
    default: "pending"
  },
  ip: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VM", vmSchema);