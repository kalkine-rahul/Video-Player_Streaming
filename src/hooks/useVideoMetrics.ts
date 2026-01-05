import { useCallback, useRef, useState } from "react";

export type VideoMetrics = {
  startupTimeMs: number | null;
  bufferingCount: number;
  totalBufferingMs: number;
  rebufferCount: number;
  errorCount: number;
  lastErrorMessage: string | null;
  watchDurationMs: number;
};

type InternalState = {
  playRequestedAt: number | null;
  firstFrameAt: number | null;
  isBuffering: boolean;
  bufferingStartedAt: number | null;
  hasStartedPlaying: boolean;
  lastTimeUpdateAt: number | null;
};

const initialMetrics: VideoMetrics = {
  startupTimeMs: null,
  bufferingCount: 0,
  totalBufferingMs: 0,
  rebufferCount: 0,
  errorCount: 0,
  lastErrorMessage: null,
  watchDurationMs: 0,
};

const initialInternalState: InternalState = {
  playRequestedAt: null,
  firstFrameAt: null,
  isBuffering: false,
  bufferingStartedAt: null,
  hasStartedPlaying: false,
  lastTimeUpdateAt: null,
};

export function useVideoMetrics() {
  const [metrics, setMetrics] = useState<VideoMetrics>(initialMetrics);
  const internalRef = useRef<InternalState>({ ...initialInternalState });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handlersRef = useRef<{
    onLoadStart: () => void;
    onPlaying: () => void;
    onWaiting: () => void;
    onTimeUpdate: () => void;
    onPauseOrEnded: () => void;
    onError: () => void;
  } | null>(null);

  const updateMetrics = useCallback((partial: Partial<VideoMetrics>) => {
    setMetrics((prev) => ({
      ...prev,
      ...partial,
    }));
  }, []);

  const onLoadStart = useCallback(() => {
    internalRef.current.playRequestedAt = null;
    internalRef.current.firstFrameAt = null;
    internalRef.current.hasStartedPlaying = false;
  }, []);

  const onPlaying = useCallback(() => {
    const now = performance.now();
    const internal = internalRef.current;

    // First frame
    if (!internal.firstFrameAt && internal.playRequestedAt) {
      internal.firstFrameAt = now;
      internal.hasStartedPlaying = true;
      updateMetrics({
        startupTimeMs: now - internal.playRequestedAt,
      });
    }

    // End of buffering window
    if (internal.isBuffering && internal.bufferingStartedAt) {
      const bufferingDuration = now - internal.bufferingStartedAt;
      internal.isBuffering = false;
      internal.bufferingStartedAt = null;

      setMetrics((prev) => ({
        ...prev,
        totalBufferingMs: prev.totalBufferingMs + bufferingDuration,
      }));
    }
  }, [updateMetrics]);

  const onWaiting = useCallback(() => {
    const now = performance.now();
    const internal = internalRef.current;

    if (!internal.isBuffering) {
      internal.isBuffering = true;
      internal.bufferingStartedAt = now;

      setMetrics((prev) => ({
        ...prev,
        bufferingCount: prev.bufferingCount + 1,
        rebufferCount: internal.hasStartedPlaying
          ? prev.rebufferCount + 1
          : prev.rebufferCount,
      }));
    }
  }, []);

  const onTimeUpdate = useCallback(() => {
    const now = performance.now();
    const internal = internalRef.current;

    if (internal.lastTimeUpdateAt == null) {
      internal.lastTimeUpdateAt = now;
      return;
    }

    const delta = now - internal.lastTimeUpdateAt;
    internal.lastTimeUpdateAt = now;

    // Approximate engagement as time the video is actively updating frames
    setMetrics((prev) => ({
      ...prev,
      watchDurationMs: prev.watchDurationMs + delta,
    }));
  }, []);

  const onPauseOrEnded = useCallback(() => {
    internalRef.current.lastTimeUpdateAt = null;
  }, []);

  const onError = useCallback(() => {
    const video = videoRef.current;
    const mediaError = video?.error;

    setMetrics((prev) => ({
      ...prev,
      errorCount: prev.errorCount + 1,
      lastErrorMessage: mediaError
        ? `Error ${mediaError.code}: ${mediaError.message ?? "Unknown error"}`
        : "Unknown playback error",
    }));
  }, []);

  // Store handlers in ref for cleanup
  handlersRef.current = {
    onLoadStart,
    onPlaying,
    onWaiting,
    onTimeUpdate,
    onPauseOrEnded,
    onError,
  };

  const detachCurrentVideo = useCallback(() => {
    const video = videoRef.current;
    const handlers = handlersRef.current;
    if (!video || !handlers) return;

    video.removeEventListener("loadstart", handlers.onLoadStart);
    video.removeEventListener("playing", handlers.onPlaying);
    video.removeEventListener("waiting", handlers.onWaiting);
    video.removeEventListener("stalled", handlers.onWaiting);
    video.removeEventListener("timeupdate", handlers.onTimeUpdate);
    video.removeEventListener("pause", handlers.onPauseOrEnded);
    video.removeEventListener("ended", handlers.onPauseOrEnded);
    video.removeEventListener("error", handlers.onError);

    videoRef.current = null;
  }, []);

  const attachVideoElement = useCallback(
    (video: HTMLVideoElement | null) => {
      // Detach any previous element
      detachCurrentVideo();

      if (!video) return;
      videoRef.current = video;

      // Reset metrics and internal state for new attachment
      internalRef.current = { ...initialInternalState };
      setMetrics(initialMetrics);

      const handlers = handlersRef.current;
      if (handlers) {
        video.addEventListener("loadstart", handlers.onLoadStart);
        video.addEventListener("playing", handlers.onPlaying);
        video.addEventListener("waiting", handlers.onWaiting);
        video.addEventListener("stalled", handlers.onWaiting);
        video.addEventListener("timeupdate", handlers.onTimeUpdate);
        video.addEventListener("pause", handlers.onPauseOrEnded);
        video.addEventListener("ended", handlers.onPauseOrEnded);
        video.addEventListener("error", handlers.onError);
      }
    },
    [detachCurrentVideo]
  );

  const markPlayRequest = useCallback(() => {
    if (!internalRef.current.playRequestedAt) {
      internalRef.current.playRequestedAt = performance.now();
    }
  }, []);

  return {
    metrics,
    attachVideoElement,
    markPlayRequest,
  };
}


