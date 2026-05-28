const fs = require("fs/promises");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

function getFilePath(filename) {
  return path.join(dataDir, filename);
}

async function readJson(filename, fallback) {
  await ensureDataDir();
  const filePath = getFilePath(filename);

  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

async function writeJson(filename, value) {
  await ensureDataDir();
  const filePath = getFilePath(filename);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
  return value;
}

module.exports = {
  readJson,
  writeJson
};
