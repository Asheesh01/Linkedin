// connection.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.CONNECTION_STRING;

console.log(`🔗 Connecting to MongoDB: ${connectionString}`);

mongoose.connect(connectionString)
  .then(() => console.log("✅ MongoDB connected successfully (Local - MongoDB Compass)"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
