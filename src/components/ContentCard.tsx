"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useRef, useState } from "react";

export type ContentCardProps = {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  href: string;
};

export const ContentCard = memo<ContentCardProps>(
  ({ id, title, thumbnail, videoUrl, href }) => {
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
      <Link
        href={href}
        className="group relative flex-shrink-0 w-[200px] sm:w-[240px] transition-transform hover:scale-105"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-800">
          {/* Thumbnail Image */}
          <Image
            src={thumbnail}
            alt={title}
            fill
            className={`object-cover transition-opacity ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
            sizes="(max-width: 640px) 200px, 240px"
          />
          
          {/* Video Preview */}
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
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-white line-clamp-2">
          {title}
        </h3>
      </Link>
    );
  }
);

ContentCard.displayName = "ContentCard";

