"use client";

import { useState } from "react";
import { VideoPlayer, type VideoSource } from "@/src/components/VideoPlayer";
import { MetricsDashboard } from "@/src/components/MetricsDashboard";
import type { VideoMetrics } from "@/src/hooks/useVideoMetrics";

// Simple MP4 stream suitable for most desktop browsers (Chrome/Firefox/Edge).
// Note: For HLS streams, Safari has native support; other browsers typically
// need hls.js attached to the <video> element.
const sampleVideoSources: VideoSource[] = [
  {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "video/mp4",
    label: "Big Buck Bunny (MP4)",
  },
];

export default function Home() {
  const [metrics, setMetrics] = useState<VideoMetrics>({
    startupTimeMs: null,
    bufferingCount: 0,
    totalBufferingMs: 0,
    rebufferCount: 0,
    errorCount: 0,
    lastErrorMessage: null,
    watchDurationMs: 0,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            OTT Video Player
          </h1>
          <p className="mt-2 text-lg text-zinc-400">
            Beginner-friendly Viewer Experience demo
          </p>
        </header>

        <div className="flex flex-col items-center gap-8">
          <VideoPlayer
            sources={sampleVideoSources}
            autoPlay={false}
            onMetricsChange={setMetrics}
          />

          <MetricsDashboard metrics={metrics} />
        </div>
      </div>
    </div>
  );
}


