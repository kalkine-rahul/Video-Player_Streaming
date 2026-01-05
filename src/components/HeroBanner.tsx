"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export type HeroBannerProps = {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  videoId: string;
};

export const HeroBanner = ({
  title,
  description,
  imageUrl,
  videoUrl,
  videoId,
}: HeroBannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may fail, ignore silently
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <section
      className="relative mb-12 h-screen w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail Image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className={`object-cover transition-opacity ${
          isHovered ? "opacity-0" : "opacity-100"
        }`}
        priority
        sizes="100vw"
      />
      
      {/* Fullscreen Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        muted
        loop
        playsInline
        preload="metadata"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 z-10">
        <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mb-6 max-w-2xl text-sm text-zinc-200 sm:text-base">
          {description}
        </p>
        <Link
          href={`/player/${videoId}`}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
          Play Now
        </Link>
      </div>
    </section>
  );
};

