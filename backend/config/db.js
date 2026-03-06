// ./config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables");
    }

    // No need for useNewUrlParser or useUnifiedTopology in Mongoose v7+
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1); // stop server if DB connection fails
  }
};

module.exports = connectDB;