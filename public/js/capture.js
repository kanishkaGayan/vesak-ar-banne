function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function dataUrlToBlob(dataUrl) {
  const [meta, data] = dataUrl.split(",");
  const mime = /data:(.*?);base64/.exec(meta)?.[1] || "image/png";
  const binary = atob(data);
  const length = binary.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

export function captureScreenshot(sceneEl) {
  const screenshotComponent = sceneEl.components.screenshot;
  if (!screenshotComponent) {
    throw new Error("Screenshot component unavailable");
  }

  const dataUrl = screenshotComponent.capture("perspective");
  const blob = dataUrlToBlob(dataUrl);
  const filename = `vesak-ar-${Date.now()}.png`;
  downloadBlob(blob, filename);
  return { blob, filename, dataUrl };
}

export function startVideoRecording({ sceneEl, durationSeconds = 15, onTick, onComplete }) {
  const canvas = sceneEl.canvas;
  if (!canvas || !canvas.captureStream) {
    throw new Error("Video recording is not supported on this device");
  }

  const stream = canvas.captureStream(30);
  const chunks = [];
  const preferredTypes = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm"
  ];

  const mimeType = preferredTypes.find((type) => window.MediaRecorder && MediaRecorder.isTypeSupported(type)) || "video/webm";
  const recorder = new MediaRecorder(stream, { mimeType });

  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: mimeType });
    const filename = `vesak-ar-${Date.now()}.webm`;
    downloadBlob(blob, filename);
    if (onComplete) {
      await onComplete({ blob, filename });
    }
    stream.getTracks().forEach((track) => track.stop());
  };

  recorder.start();
  let remaining = durationSeconds;
  if (onTick) {
    onTick(remaining);
  }

  const timer = setInterval(() => {
    remaining -= 1;
    if (onTick) {
      onTick(Math.max(remaining, 0));
    }
    if (remaining <= 0) {
      clearInterval(timer);
      recorder.stop();
    }
  }, 1000);

  return {
    stop: () => {
      clearInterval(timer);
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    }
  };
}

export async function shareCapturedMedia({ blob, filename, text }) {
  if (!navigator.share) {
    throw new Error("Sharing is not supported on this browser");
  }

  const file = new File([blob], filename, { type: blob.type || "application/octet-stream" });
  const payload = {
    title: "Vesak AR Scene",
    text: text || "Check my Vesak AR creation",
    files: [file]
  };

  if (navigator.canShare && !navigator.canShare({ files: payload.files })) {
    throw new Error("This browser cannot share files");
  }

  await navigator.share(payload);
}
