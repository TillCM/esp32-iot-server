const express = require("express");
const { connectDB, getDB } = require("./db.js");

const app = express();
app.use(express.json());

let latestData = {};
let currentCommand = "AUTO";

// 🔌 Connect to MongoDB
connectDB();

// ==========================
// 📡 RECEIVE SENSOR DATA
// ==========================
app.post("/data", async (req, res) => {
  latestData = req.body;

  const temp = req.body.temperature;
  const db = getDB();

  console.log("Sensor:", latestData);

  try {
    if (db) {
      await db.collection("readings").insertOne({
        temperature: temp,
        timestamp: new Date()
      });

      console.log("✅ Saved to DB:", temp);
    } else {
      console.log("⚠️ DB not ready yet");
    }
  } catch (err) {
    console.error("DB error:", err);
  }

  res.send("OK");
});

// ==========================
// 📊 GET LATEST DATA
// ==========================
app.get("/data", (req, res) => {
  res.json(latestData);
});

// ==========================
// 📜 GET HISTORY
// ==========================
app.get("/history", async (req, res) => {
  const db = getDB();

  try {
    if (!db) {
      return res.status(500).send("DB not connected");
    }

    const data = await db
      .collection("readings")
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching history");
  }
});

// ==========================
// 🎮 SET COMMAND
// ==========================
app.post("/command", (req, res) => {
  currentCommand = req.body.command;
  res.send("Command updated");
});

// ==========================
// 🤖 GET COMMAND (one-time)
// ==========================
app.get("/command", (req, res) => {
  res.send(currentCommand);

  // reset after sending (prevents sticky commands)
  currentCommand = "AUTO";
});

// ==========================
// 🧪 TEST ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("ESP32 server with MongoDB is running 🚀");
});

// ==========================
// 🚀 START SERVER
// ==========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});