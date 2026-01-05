"use client";

import { ContentRail } from "@/src/components/ContentRail";
import { HeroBanner } from "@/src/components/HeroBanner";
import { heroContent, moviesContent, sportsContent, trendingContent } from "@/src/data/content";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Banner - Fullscreen with hover autoplay */}
      <HeroBanner {...heroContent} />

      {/* Content Rails */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <ContentRail
          title="Trending Now"
          items={trendingContent.map((item) => ({
            id: item.id,
            title: item.title,
            thumbnail: item.thumbnail,
            videoUrl: item.videoUrl,
            href: `/player/${item.id}`,
          }))}
        />

        <ContentRail
          title="Movies"
          items={moviesContent.map((item) => ({
            id: item.id,
            title: item.title,
            thumbnail: item.thumbnail,
            videoUrl: item.videoUrl,
            href: `/player/${item.id}`,
          }))}
        />

        <ContentRail
          title="Sports"
          items={sportsContent.map((item) => ({
            id: item.id,
            title: item.title,
            thumbnail: item.thumbnail,
            videoUrl: item.videoUrl,
            href: `/player/${item.id}`,
          }))}
        />
      </div>
    </div>
  );
}

