"use client";

import { useState, use } from "react";
import { VideoPlayer, type VideoSource } from "@/src/components/VideoPlayer";
import { MetricsDashboard } from "@/src/components/MetricsDashboard";
import type { VideoMetrics } from "@/src/hooks/useVideoMetrics";
import {
  trendingContent,
  moviesContent,
  sportsContent,
} from "@/src/data/content";
import Link from "next/link";

export default function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [metrics, setMetrics] = useState<VideoMetrics>({
    startupTimeMs: null,
    bufferingCount: 0,
    totalBufferingMs: 0,
    rebufferCount: 0,
    errorCount: 0,
    lastErrorMessage: null,
    watchDurationMs: 0,
  });

  // Find video in content arrays
  const allContent = [...trendingContent, ...moviesContent, ...sportsContent];
  const content = allContent.find((item) => item.id === id);

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Video Not Found</h1>
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-400 underline"
          >
            Go back to Home
          </Link>
        </div>
      </div>
    );
  }

  const videoSources: VideoSource[] = [
    {
      src: content.videoUrl,
      type: "video/mp4",
      label: content.title,
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        {/* Video Title */}
        <h1 className="mb-6 text-2xl font-bold text-white sm:text-3xl">
          {content.title}
        </h1>

        {/* Video Player */}
        <div className="mb-8">
          <VideoPlayer
            sources={videoSources}
            poster={content.thumbnail}
            autoPlay={false}
            onMetricsChange={setMetrics}
          />
        </div>

        {/* QoS Metrics Dashboard */}
        <MetricsDashboard metrics={metrics} />
      </div>
    </div>
  );
}

