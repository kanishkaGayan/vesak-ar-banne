const express = require("express");
const { readJson, writeJson } = require("./store");

const router = express.Router();
const fileName = "analytics.json";

router.post("/hit", async (req, res) => {
  const body = req.body || {};
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    event: body.event || "unknown",
    meta: body.meta || {},
    clientId: body.clientId || "anonymous",
    timestamp: new Date().toISOString()
  };

  const analytics = await readJson(fileName, { events: [] });
  analytics.events.push(entry);

  if (analytics.events.length > 5000) {
    analytics.events = analytics.events.slice(-5000);
  }

  await writeJson(fileName, analytics);
  res.json({ ok: true });
});

router.get("/stats", async (_req, res) => {
  const analytics = await readJson(fileName, { events: [] });
  const now = Date.now();

  const uniqueClients = new Set(analytics.events.map((event) => event.clientId)).size;
  const eventsLast24h = analytics.events.filter((event) => {
    const ts = new Date(event.timestamp).getTime();
    return now - ts < 24 * 60 * 60 * 1000;
  }).length;

  res.json({
    totalEvents: analytics.events.length,
    uniqueClients,
    eventsLast24h
  });
});

router.get("/download", async (_req, res) => {
  const analytics = await readJson(fileName, { events: [] });
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=vesak-ar-analytics.json");
  res.send(JSON.stringify(analytics, null, 2));
});

module.exports = router;
