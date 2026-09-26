'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createApp } = require('./app');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });
const { server } = createApp({ dbFile: path.join(dataDir, 'souqna.db'), uploadDir: path.join(dataDir, 'uploads') });
const port = Number(process.env.PORT) || 3000;
server.listen(port, () => console.log(`Souqna running → open http://localhost:${port} in your browser (Ctrl+C to stop)`));
server.on('error', (e) => {
  console.error(e.code === 'EADDRINUSE' ? `Port ${port} is busy. Try: PORT=3001 npm start` : e.message);
  process.exit(1);
});
