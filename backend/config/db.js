// ./config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use MONGO_URI from Render environment variables
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1); // exit if DB connection fails
  }
};

module.exports = connectDB;