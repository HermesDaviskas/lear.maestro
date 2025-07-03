const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");
const cors = require("cors"); // ✅ Import cors

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let latestWarehouseData = null;

// === Middleware ===
app.use(cors()); // ✅ Enable CORS for all origins
app.use(bodyParser.json());

// === Health check endpoint ===
app.get("/backend/health", (req, res) => {
  res.status(200).send({});
});

// === Receive updates from backend ===
app.post("/update-warehouse", (req, res) => {
  latestWarehouseData = req.body;
  console.log("Received update from backend");
  // Broadcast to all connected WebSocket clients
  const msg = JSON.stringify(latestWarehouseData);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });

  res.status(200).send("Update received");
});

// === WebSocket for frontend clients ===
wss.on("connection", (ws) => {
  console.log("Frontend connected");

  if (latestWarehouseData) {
    ws.send(JSON.stringify(latestWarehouseData));
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
