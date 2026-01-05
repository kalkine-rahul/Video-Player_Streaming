"use client";

import { memo } from "react";
import { ContentCard, type ContentCardProps } from "./ContentCard";

export type ContentRailProps = {
  title: string;
  items: ContentCardProps[];
};

export const ContentRail = memo<ContentRailProps>(({ title, items }) => {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item) => (
          <ContentCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
});

ContentRail.displayName = "ContentRail";

