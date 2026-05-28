import { initArScene } from "/public/js/ar-scene.js";
import { captureScreenshot, startVideoRecording, shareCapturedMedia } from "/public/js/capture.js";

const sceneEl = document.getElementById("scene");
const worldRootEl = document.getElementById("worldRoot");
const toastEl = document.getElementById("toast");
const fpsChip = document.getElementById("fpsChip");
const batteryChip = document.getElementById("batteryChip");
const recordingChip = document.getElementById("recordingChip");

const decorationTypeEl = document.getElementById("decorationType");
const themeSelectEl = document.getElementById("themeSelect");
const debugToggleEl = document.getElementById("debugToggle");

const spawnBtn = document.getElementById("spawnBtn");
const resetBtn = document.getElementById("resetBtn");
const captureBtn = document.getElementById("captureBtn");
const recordBtn = document.getElementById("recordBtn");
const shareBtn = document.getElementById("shareBtn");

const infoBtn = document.getElementById("infoBtn");
const infoDialog = document.getElementById("infoDialog");
const closeInfoBtn = document.getElementById("closeInfoBtn");

const clientStorageKey = "vesakArClientId";
const settingsStorageKey = "vesakArSettings";
const latestCaptureKey = "vesakArLatestCapture";

let lastCaptured = null;
let recorderControl = null;
let debugMode = false;

function getClientId() {
  let id = localStorage.getItem(clientStorageKey);
  if (!id) {
    id = `client-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    localStorage.setItem(clientStorageKey, id);
  }
  return id;
}

const clientId = getClientId();

function showToast(message, timeoutMs = 1800) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  window.setTimeout(() => {
    toastEl.classList.add("hidden");
  }, timeoutMs);
}

async function sendAnalytics(event, meta = {}) {
  try {
    await fetch("/api/analytics/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, meta, clientId })
    });
  } catch (error) {
    if (debugMode) {
      console.warn("analytics failed", error);
    }
  }
}

async function saveSettingsRemotely(settings) {
  try {
    await fetch(`/api/settings/${encodeURIComponent(clientId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
  } catch (error) {
    if (debugMode) {
      console.warn("settings sync failed", error);
    }
  }
}

async function loadRemoteSettings() {
  try {
    const response = await fetch(`/api/settings/${encodeURIComponent(clientId)}`);
    if (!response.ok) {
      return null;
    }
    const payload = await response.json();
    return payload.settings || null;
  } catch {
    return null;
  }
}

function saveLocalSettings(settings) {
  localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
}

function loadLocalSettings() {
  try {
    return JSON.parse(localStorage.getItem(settingsStorageKey) || "null");
  } catch {
    return null;
  }
}

const ar = initArScene({
  sceneEl,
  worldRootEl,
  onToast: showToast,
  initialTheme: "gold"
});

function persistSettings() {
  const settings = {
    decorationType: decorationTypeEl.value,
    theme: themeSelectEl.value,
    debugMode
  };
  saveLocalSettings(settings);
  saveSettingsRemotely(settings);
}

async function hydrateSettings() {
  const localSettings = loadLocalSettings();
  const remoteSettings = await loadRemoteSettings();
  const settings = remoteSettings || localSettings;

  if (!settings) {
    return;
  }

  if (settings.decorationType) {
    decorationTypeEl.value = settings.decorationType;
    ar.setSelectedType(settings.decorationType);
  }

  if (settings.theme) {
    themeSelectEl.value = settings.theme;
    ar.setTheme(settings.theme);
  }

  debugMode = Boolean(settings.debugMode);
  debugToggleEl.checked = debugMode;
}

decorationTypeEl.addEventListener("change", () => {
  ar.setSelectedType(decorationTypeEl.value);
  persistSettings();
  sendAnalytics("decoration_changed", { type: decorationTypeEl.value });
});

themeSelectEl.addEventListener("change", () => {
  ar.setTheme(themeSelectEl.value);
  persistSettings();
  sendAnalytics("theme_changed", { theme: themeSelectEl.value });
});

debugToggleEl.addEventListener("change", () => {
  debugMode = debugToggleEl.checked;
  persistSettings();
  sendAnalytics("debug_toggled", { enabled: debugMode });
  showToast(debugMode ? "Debug mode on" : "Debug mode off");
});

spawnBtn.addEventListener("click", () => {
  ar.spawnDecoration(decorationTypeEl.value);
  sendAnalytics("spawn_button", { type: decorationTypeEl.value });
});

resetBtn.addEventListener("click", () => {
  ar.resetScene();
  sendAnalytics("scene_reset");
  showToast("Scene reset");
});

captureBtn.addEventListener("click", async () => {
  try {
    const capture = captureScreenshot(sceneEl);
    lastCaptured = capture;
    localStorage.setItem(latestCaptureKey, JSON.stringify({ filename: capture.filename, type: capture.blob.type }));

    await sendAnalytics("screenshot_taken", { filename: capture.filename });
    showToast("Screenshot saved");
  } catch (error) {
    showToast(error.message || "Could not capture screenshot");
  }
});

recordBtn.addEventListener("click", async () => {
  if (recorderControl) {
    recorderControl.stop();
    recorderControl = null;
    showToast("Recording stopped");
    return;
  }

  try {
    recordingChip.classList.remove("hidden");
    recordBtn.textContent = "Stop";

    recorderControl = startVideoRecording({
      sceneEl,
      durationSeconds: 15,
      onTick: (remaining) => {
        recordingChip.textContent = `REC ${String(remaining).padStart(2, "0")}`;
      },
      onComplete: async ({ blob, filename }) => {
        lastCaptured = { blob, filename };
        localStorage.setItem(latestCaptureKey, JSON.stringify({ filename, type: blob.type }));
        recordingChip.classList.add("hidden");
        recordBtn.textContent = "Record 15s";
        recorderControl = null;
        await sendAnalytics("video_recorded", { filename, size: blob.size });
        showToast("Video saved");
      }
    });
  } catch (error) {
    recordingChip.classList.add("hidden");
    recordBtn.textContent = "Record 15s";
    recorderControl = null;
    showToast(error.message || "Recording not supported");
  }
});

shareBtn.addEventListener("click", async () => {
  if (!lastCaptured) {
    showToast("Capture screenshot or video first");
    return;
  }

  try {
    await shareCapturedMedia({
      blob: lastCaptured.blob,
      filename: lastCaptured.filename,
      text: "I made this Vesak AR scene"
    });

    await fetch("/api/share/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        type: lastCaptured.filename.endsWith(".webm") ? "video" : "image",
        filename: lastCaptured.filename
      })
    });

    sendAnalytics("shared_media", { filename: lastCaptured.filename });
  } catch (error) {
    showToast(error.message || "Share failed");
  }
});

infoBtn.addEventListener("click", () => infoDialog.showModal());
closeInfoBtn.addEventListener("click", () => infoDialog.close());

function setupBatteryStatus() {
  if (!navigator.getBattery) {
    batteryChip.textContent = "Battery n/a";
    return;
  }

  navigator.getBattery().then((battery) => {
    const updateBattery = () => {
      batteryChip.textContent = `Battery ${Math.round(battery.level * 100)}%`;
    };

    updateBattery();
    battery.addEventListener("levelchange", updateBattery);
  }).catch(() => {
    batteryChip.textContent = "Battery n/a";
  });
}

function setupFpsCounter() {
  let frames = 0;
  let lastSample = performance.now();

  const tick = (now) => {
    frames += 1;
    if (now - lastSample >= 1000) {
      const fps = Math.round((frames * 1000) / (now - lastSample));
      fpsChip.textContent = `FPS ${fps}`;
      if (debugMode) {
        const state = ar.getSceneState();
        fpsChip.textContent = `FPS ${fps} | ${state.count} objs`;
      }
      frames = 0;
      lastSample = now;
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "r") {
    ar.resetScene();
  }
  if (event.key.toLowerCase() === "s") {
    try {
      const capture = captureScreenshot(sceneEl);
      lastCaptured = capture;
      showToast("Screenshot saved");
    } catch {
      showToast("Screenshot failed");
    }
  }
});

hydrateSettings().finally(() => {
  setupBatteryStatus();
  setupFpsCounter();
  sendAnalytics("session_started", { userAgent: navigator.userAgent });
  showToast("Tap to place decorations");
});
