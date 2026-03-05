const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  totalServers: {
    type: Number,
    required: true
  },
  running: {
    type: Number,
    required: true
  },
  cpu: {
    type: String,
    required: true
  },
  storage: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Stats", statsSchema);
