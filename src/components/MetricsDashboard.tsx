"use client";

import React, { memo } from "react";
import type { VideoMetrics } from "@/src/hooks/useVideoMetrics";

export type MetricsDashboardProps = {
  metrics: VideoMetrics;
};

type CardProps = {
  label: string;
  value: string | number;
  unit?: string;
};

const MetricCard: React.FC<CardProps> = memo(({ label, value, unit }) => {
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
      <div className="text-xs font-medium text-zinc-400">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-zinc-50">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-zinc-400">{unit}</span>}
      </div>
    </div>
  );
});

MetricCard.displayName = "MetricCard";

// Simple metrics dashboard focused on the core viewer experience signals.
export const MetricsDashboard: React.FC<MetricsDashboardProps> = memo(
  ({ metrics }) => {
    const startupMs =
      metrics.startupTimeMs !== null ? Math.round(metrics.startupTimeMs) : null;

    const bufferingSeconds = (metrics.totalBufferingMs / 1000).toFixed(1);
    const watchSeconds = (metrics.watchDurationMs / 1000).toFixed(1);

    return (
      <div className="w-full max-w-4xl rounded-xl bg-zinc-950/90 p-6 shadow-xl ring-1 ring-zinc-800">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Viewer Experience Metrics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            label="Startup Time"
            value={startupMs !== null ? startupMs : "—"}
            unit="ms"
          />
          <MetricCard
            label="Buffer Count"
            value={metrics.bufferingCount}
          />
          <MetricCard
            label="Buffer Duration"
            value={bufferingSeconds}
            unit="s"
          />
          <MetricCard
            label="Error Count"
            value={metrics.errorCount}
          />
          <MetricCard
            label="Watch Time"
            value={watchSeconds}
            unit="s"
          />
        </div>
      </div>
    );
  }
);

MetricsDashboard.displayName = "MetricsDashboard";
