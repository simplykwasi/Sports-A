import http from 'node:http';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import app from './app.js';
import liveEngine from './services/live.engine.js';

dotenv.config();

const port = process.env.PORT || 4000;
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/live-ws' });

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'welcome', message: 'Live analytics socket connected' }));

  socket.on('message', async (raw) => {
    try {
      const message = JSON.parse(raw.toString());

      if (message.type === 'subscribe' && message.fixtureId) {
        const state = liveEngine.getCurrentState(message.fixtureId);
        socket.send(JSON.stringify({ type: 'live-state', fixtureId: message.fixtureId, data: state }));
      }
    } catch (error) {
      socket.send(JSON.stringify({ type: 'error', message: 'Invalid request payload' }));
    }
  });
});

server.listen(port, () => {
  console.info(`Sports A backend started on http://localhost:${port}`);
});

// Start the internal live analytics polling loop.
liveEngine.startRealtimePolling();
