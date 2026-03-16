const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');
const { WebSocketServer } = require('ws');
require('dotenv').config();

const dashboardRoutes = require('./routes/dashboard');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server, path: '/ws' });

const broadcastUpdate = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');
  ws.send(JSON.stringify({ type: 'connected', message: 'Connected to Digitory real-time feed' }));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Simulate real-time platform activity updates every 30 seconds
setInterval(() => {
  const update = {
    type: 'platform_update',
    data: {
      orders_delta: Math.floor(Math.random() * 50) + 10,
      timestamp: new Date().toISOString(),
    },
  };
  broadcastUpdate(update);
}, 30000);

server.listen(PORT, () => {
  console.log(`Digitory Founder API running on port ${PORT}`);
  console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
});

module.exports = { app, server };
