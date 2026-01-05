"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controls } from "@/src/components/Controls";
import { useVideoMetrics } from "@/src/hooks/useVideoMetrics";

export type VideoSource = {
  src: string;
  type: string;
  label?: string;
};

export type VideoPlayerProps = {
  sources: VideoSource[];
  poster?: string;
  autoPlay?: boolean;
  onMetricsChange?: (metrics: ReturnType<typeof useVideoMetrics>["metrics"]) => void;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  sources,
  poster,
  autoPlay = false,
  onMetricsChange,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { metrics, attachVideoElement, markPlayRequest } = useVideoMetrics();

  useEffect(() => {
    if (videoRef.current) {
      attachVideoElement(videoRef.current);
    }
  }, [attachVideoElement]);

  useEffect(() => {
    if (onMetricsChange) {
      onMetricsChange(metrics);
    }
  }, [metrics, onMetricsChange]);

  const onLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  }, []);

  const onTimeUpdate = useCallback(() => {
    if (!videoRef.current || !duration) return;
    const time = videoRef.current.currentTime || 0;
    setCurrentTime(time);
    setProgress((time / duration) * 100);
  }, [duration]);

  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      // Mark play request for startup time tracking
      markPlayRequest();
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [markPlayRequest]);

  const handleSeek = useCallback((value: number) => {
    if (!videoRef.current || !duration) return;
    const newTime = (value / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(value);
  }, [duration]);

  const handleVolumeChange = useCallback((value: number) => {
    if (!videoRef.current) return;
    const vol = value / 100;
    videoRef.current.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && videoRef.current.volume === 0) {
      videoRef.current.volume = 0.5;
      setVolume(0.5);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current) return;
    const container = videoRef.current.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      void container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      void document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const formattedCurrentTime = useMemo(() => {
    const mins = Math.floor(currentTime / 60);
    const secs = Math.floor(currentTime % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  }, [currentTime]);

  const formattedDuration = useMemo(() => {
    if (!duration) return "0:00";
    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  }, [duration]);

  return (
    <div className="w-full max-w-4xl rounded-xl bg-zinc-950/90 p-3 shadow-xl ring-1 ring-zinc-800">
      <div className="relative overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          className="h-full w-full bg-black"
          poster={poster}
          preload="metadata"
          playsInline
          controls={false}
          autoPlay={autoPlay}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
        >
          {sources.map((source) => (
            <source
              key={source.src}
              src={source.src}
              type={source.type}
            />
          ))}
          Your browser does not support HTML5 video.
        </video>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-3 pt-2">
          <Controls
            isPlaying={isPlaying}
            onPlayPause={togglePlay}
            progress={progress}
            onSeek={handleSeek}
            volume={Math.round(volume * 100)}
            onVolumeChange={handleVolumeChange}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            currentTimeLabel={formattedCurrentTime}
            durationLabel={formattedDuration}
            onToggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
          />
        </div>
      </div>
    </div>
  );
};

export type { VideoMetrics } from "@/src/hooks/useVideoMetrics";


