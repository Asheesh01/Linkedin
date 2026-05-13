// connection.js
const mongoose = require("mongoose");
require("dotenv").config();

// Support both MONGODB_URI (Atlas/Render) and CONNECTION_STRING (local dev)
const connectionString = process.env.MONGODB_URI || process.env.CONNECTION_STRING;

console.log(`🔗 Connecting to MongoDB...`);

mongoose.connect(connectionString)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
