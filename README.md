# Video Saver - Client 🎬

A modern, responsive, installable Progressive Web App (PWA) built with **React**, **Vite**, and **Tailwind CSS** for downloading videos and extracting MP3 audio from any link.

---

## Features

- **PWA Ready**: Installable as a native standalone app on iOS, Android, macOS, Windows, and Linux.
- **Fast Media Fetching**: Instant preview card with thumbnails, duration, title, and creator.
- **Format & Resolution Selector**: Choose between MP4 video (with quality dropdown: 1080p, 720p, 480p, 360p) or high-quality MP3 audio.
- **Live Stream Progress**: Real-time server prep timer, byte counter, and progress bar during downloads.
- **Dark Minimal Design**: Emerald accents, Space Grotesk / Inter typography, and fully responsive mobile-first UI.

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend API (Optional in Dev)
By default, the Vite dev server proxies `/api` requests to `http://localhost:5000`.

To point to an external or production backend, create `.env.local`:
```ini
VITE_API_URL=https://your-videosaver-backend.onrender.com
```

### 3. Run Development Server
```bash
npm run dev
```

Visit **http://localhost:5173**.

---

## Deployment on Vercel

This repository is pre-configured for **1-click deployment on Vercel**:

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import this repository: `oyeniyiisaac/videosaver-client`.
3. Add an Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your hosted backend URL (e.g. `https://your-videosaver-backend.onrender.com` or `https://your-backend.up.railway.app`)
4. Click **Deploy**.
