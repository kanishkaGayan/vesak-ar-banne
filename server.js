const express = require('express');
const path = require('path');
const analyticsRouter = require('./api/analytics');
const shareRouter = require('./api/share');
const uploadRouter = require('./api/upload');
const settingsRouter = require('./api/settings');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '16mb' }));

// Serve static files (HTML, CSS, JS, etc)
app.use(express.static(path.join(__dirname, '.')));

// API routes
app.use('/api/analytics', analyticsRouter);
app.use('/api/share', shareRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/settings', settingsRouter);

// Main route - serve the AR app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime())
  });
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Vesak AR app running on http://localhost:${PORT}`);
  });
}

module.exports = app;
