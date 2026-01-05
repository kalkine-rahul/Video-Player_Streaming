"use client";

import React, { memo } from "react";

export type ControlsProps = {
  isPlaying: boolean;
  onPlayPause: () => void;
  progress: number;
  onSeek: (value: number) => void;
  volume: number;
  onVolumeChange: (value: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentTimeLabel: string;
  durationLabel: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
};

export const Controls: React.FC<ControlsProps> = memo(
  ({
    isPlaying,
    onPlayPause,
    progress,
    onSeek,
    volume,
    onVolumeChange,
    isMuted,
    onToggleMute,
    currentTimeLabel,
    durationLabel,
    isFullscreen,
    onToggleFullscreen,
  }) => {
    return (
      <div className="flex flex-col gap-2 text-xs text-zinc-100">
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 accent-emerald-400"
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPlayPause}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-md hover:bg-zinc-200"
            >
              {isPlaying ? (
                <span className="inline-block text-[10px] font-semibold">
                  II
                </span>
              ) : (
                <span className="ml-0.5 inline-block text-[11px] font-semibold">
                  ▶
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-xs shadow hover:bg-zinc-800"
            >
              {isMuted || volume === 0 ? "🔇" : volume < 50 ? "🔉" : "🔊"}
            </button>

            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-zinc-700 accent-emerald-400"
            />

            <span className="ml-3 tabular-nums">
              {currentTimeLabel} / {durationLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleFullscreen}
            className="inline-flex h-8 items-center justify-center rounded-full border border-zinc-500 px-3 text-[11px] font-medium text-zinc-100 hover:bg-zinc-800"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>
    );
  }
);

Controls.displayName = "Controls";


