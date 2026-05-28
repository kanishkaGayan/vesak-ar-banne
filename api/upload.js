const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const { readJson, writeJson } = require("./store");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 }
});
const fileName = "uploads.json";

router.post("/", upload.single("media"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No media file uploaded" });
    return;
  }

  const uploads = await readJson(fileName, { files: {} });
  const id = crypto.randomUUID().slice(0, 10);

  uploads.files[id] = {
    id,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    createdAt: new Date().toISOString()
  };

  await writeJson(fileName, uploads);
  res.status(201).json({
    id,
    note: "File metadata saved. Integrate Vercel Blob or S3 for binary storage.",
    metadataUrl: `/api/upload/${id}`
  });
});

router.get("/:id", async (req, res) => {
  const uploads = await readJson(fileName, { files: {} });
  const file = uploads.files[req.params.id];

  if (!file) {
    res.status(404).json({ error: "Upload not found" });
    return;
  }

  res.json(file);
});

module.exports = router;
