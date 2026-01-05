## OTT Video Player – Viewer Experience Demo

This is a **beginner-friendly OTT video player** built with **React + TypeScript** (via Next.js) that focuses on **Viewer Experience (VX)** metrics you’d see in real streaming platforms like **Hotstar** or **Netflix**.

It uses the HTML5 `<video>` element with **custom controls** and a small **on-screen metrics dashboard**.

### What this project does

- Renders a **custom HTML5 video player** (no native browser controls)
- Plays a **public MP4 asset** (Big Buck Bunny)
- Tracks **core viewer-experience metrics** in real time:
  - Startup time (ms)
  - Buffering count
  - Total buffering duration (seconds)
  - Playback error count
  - Watch time (seconds)
- Displays these metrics in a simple **Metrics Dashboard** next to the player

### Metrics and video events

All metrics are computed using standard HTML5 video events:

- **Startup time (play click → first frame)**  
  - On play button click we store a timestamp  
  - When the video fires `playing` for the first time, we compute:  
    \[
    \text{startupTimeMs} = \text{playingTime} - \text{playClickTime}
    \]
  - Events used: `playing` (plus a timestamp set on play click)

- **Buffering count & total buffering duration**
  - Each time the video fires `waiting`, we treat it as **buffering start**
  - When playback resumes with `playing`, we treat that as **buffering end**
  - We increment:
    - `bufferingCount` on each new buffering episode
    - `totalBufferingMs` by the time spent between `waiting` and `playing`
  - Events used: `waiting`, `playing`

- **Playback errors**
  - On `error`, we increment `errorCount`
  - We also capture a simple `lastErrorMessage` from the media error if available
  - Event used: `error`

- **Watch duration (time video actually plays)**
  - We listen to `timeupdate` while the video is playing
  - We accumulate the wall-clock time between `timeupdate` ticks
  - When playback pauses or ends, we stop counting
  - Events used: `timeupdate`, `pause`, `ended`

All of this logic lives in a small custom hook: `src/hooks/useVideoMetrics.ts`.

### How this maps to real OTT platforms (Hotstar / Netflix)

Real OTT platforms track very similar QoE / QoS metrics:

- **Startup time** → “Time To First Frame” / “Video Start Time” in production dashboards  
- **Buffering count & duration** → Rebuffer frequency and ratio, which strongly affect perceived quality  
- **Errors** → Playback failure rate, often a core KPI (e.g., “plays that fail to start”)  
- **Watch time** → Session duration / engagement, used for product and performance analysis

This project is intentionally **simplified**:

- No backend
- No DRM
- No ABR or bitrate selection logic
- No analytics pipeline or dashboards like Grafana/Datadog

Instead, it gives you a **small, readable codebase** that shows how these metrics are wired from **video events → React state → UI**, which is exactly the kind of work Viewer Experience / Video Playback engineers do, just at a much larger scale.

### Project structure

```text
src/
 ├─ components/
 │  ├─ VideoPlayer.tsx        // HTML5 player + custom controls wrapper
 │  ├─ Controls.tsx           // Play/Pause, seek, volume, fullscreen
 │  ├─ MetricsDashboard.tsx   // Simple VX metrics dashboard
 ├─ hooks/
 │  ├─ useVideoMetrics.ts     // Tracks startup, buffering, errors, watch time
 ├─ pages/
 │  ├─ Home.tsx               // Main demo page (used by app/page.tsx)
app/
 ├─ page.tsx                  // Next.js entry that renders Home
```

### Running the demo

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in **Chrome**, **Firefox**, or **Edge**.

### Cross-browser notes

- The player uses a basic **MP4** source, which is supported across modern browsers.
- The `<video>` element uses `playsInline` to behave better on mobile Safari; desktop browsers simply ignore it.
- Fullscreen behavior is handled via the standardized `requestFullscreen` API, which is supported in current Chrome/Firefox/Edge.

If you want to extend this to **HLS**:

- Safari can play `application/x-mpegURL` sources natively
- Other browsers typically use **hls.js** attached to the same `<video>` element  
  (this project keeps it simple and sticks to MP4).

