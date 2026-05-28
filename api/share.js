const express = require("express");
const crypto = require("crypto");
const { readJson, writeJson } = require("./store");

const router = express.Router();
const fileName = "shares.json";

router.post("/create", async (req, res) => {
  const payload = req.body || {};
  const shareId = crypto.randomUUID().slice(0, 8);

  const shares = await readJson(fileName, { links: {} });
  shares.links[shareId] = {
    id: shareId,
    createdAt: new Date().toISOString(),
    payload
  };

  await writeJson(fileName, shares);
  res.status(201).json({ shareId, url: `/api/share/${shareId}` });
});

router.get("/:id", async (req, res) => {
  const shares = await readJson(fileName, { links: {} });
  const link = shares.links[req.params.id];

  if (!link) {
    res.status(404).json({ error: "Share not found" });
    return;
  }

  res.json(link);
});

module.exports = router;
