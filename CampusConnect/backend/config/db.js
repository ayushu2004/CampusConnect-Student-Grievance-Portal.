const mongoose = require("mongoose");

module.exports = async function connectDB() {
  mongoose.set("strictQuery", true);
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI missing in env");
  const conn = await mongoose.connect(uri);
  console.log(`🗄️  MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};
