const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("esp32");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };