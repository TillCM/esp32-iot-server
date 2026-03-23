const express = require("express");
const app = express();

app.use(express.json());

let latestData = {};
let currentCommand = "AUTO";

// Receive sensor data
app.post("/data", (req, res) => {
  latestData = req.body;
  console.log("Sensor:", latestData);
  res.send("OK");
});

//test server

app.get("/", (req, res) => {
  res.send("ESP32 Render server is running 🚀");
});

// Send latest data to app
app.get("/data", (req, res) => {
  res.json(latestData);
});

// Set command from Flutter
app.post("/command", (req, res) => {
  currentCommand = req.body.command;
  res.send("Command updated");
});

// ESP32 fetches command
app.get("/command", (req, res) => {
  res.send(currentCommand);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});