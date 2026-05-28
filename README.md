# Vesak AR App

Production-style AR web app for Vesak celebrations built with A-Frame, AR.js, and Express.

## Features

- Real-time AR scene with animated lotus, lantern, flame, buddha-glow, and sparkles.
- Touch interactions: tap to spawn, swipe to rotate scene, pinch to scale selected object.
- Theme customization: gold, saffron, ruby.
- Screenshot capture and 15-second video recording.
- Web Share API integration for mobile sharing.
- FPS counter, battery indicator, and debug mode.
- Backend APIs for analytics, sharing metadata, upload metadata, and user settings persistence.

## Project Structure

```
.
├── api/
│   ├── analytics.js
│   ├── settings.js
│   ├── share.js
│   ├── store.js
│   └── upload.js
├── data/
├── models/
├── public/
│   ├── css/
│   │   ├── mobile.css
│   │   └── styles.css
│   └── js/
│       ├── animations.js
│       ├── ar-scene.js
│       ├── capture.js
│       └── ui.js
├── index.html
├── package.json
├── server.js
└── vercel.json
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` on mobile for camera-based AR.

## Build and Deploy

```bash
npm run build
npm run deploy
```

## API Endpoints

- `POST /api/analytics/hit` - record analytics event.
- `GET /api/analytics/stats` - get usage summary.
- `GET /api/analytics/download` - download analytics JSON.
- `POST /api/settings/:clientId` - persist UI settings.
- `GET /api/settings/:clientId` - fetch user settings.
- `POST /api/share/create` - create share metadata link.
- `GET /api/share/:id` - resolve share metadata.
- `POST /api/upload` - save upload metadata (storage integration point).
- `GET /api/upload/:id` - fetch upload metadata.

## Notes

- Camera AR requires secure context (`https`) in production.
- Video and file-sharing capabilities depend on browser support.
- Upload endpoint currently stores metadata only; integrate Vercel Blob/S3 for binary files.
