const express = require("express");
const { readJson, writeJson } = require("./store");

const router = express.Router();
const fileName = "settings.json";

router.get("/:clientId", async (req, res) => {
  const settings = await readJson(fileName, { users: {} });
  res.json({
    clientId: req.params.clientId,
    settings: settings.users[req.params.clientId] || null
  });
});

router.post("/:clientId", async (req, res) => {
  const payload = req.body || {};
  const settings = await readJson(fileName, { users: {} });

  settings.users[req.params.clientId] = {
    ...payload,
    updatedAt: new Date().toISOString()
  };

  await writeJson(fileName, settings);
  res.status(201).json({ ok: true });
});

module.exports = router;
