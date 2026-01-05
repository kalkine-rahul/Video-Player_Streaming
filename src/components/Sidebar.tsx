"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const Sidebar = () => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { id: "home", label: "Home", icon: HomeIcon, href: "/" },
    { id: "search", label: "Search", icon: SearchIcon, href: "/" },
    { id: "tv", label: "TV", icon: TVIcon, href: "/" },
    {
      id: "movies",
      label: "Movies",
      icon: MovieIcon,
      href: "/",
      submenu: [
        "Action",
        "Comedy",
        "Drama",
        "Thriller",
        "Romance",
        "Horror",
      ],
    },
    {
      id: "sports",
      label: "Sports",
      icon: SportsIcon,
      href: "/",
      submenu: [
        "Cricket",
        "Football",
        "Tennis",
        "Basketball",
        "Hockey",
        "Live Matches",
      ],
    },
  ];

  return (
    <aside className="group fixed left-0 top-0 z-50 h-screen w-16 bg-black/95 backdrop-blur-sm border-r border-zinc-800 transition-all duration-300 hover:w-64 hidden md:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded text-white">
              <StarIcon />
            </div>
            <span className="hidden text-lg font-bold text-white group-hover:block whitespace-nowrap">
              OTTstar
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isHovered = hoveredItem === item.id;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => hasSubmenu && setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white ${
                    isActive ? "bg-zinc-900 text-white" : ""
                  }`}
                >
                  <Icon className="h-6 w-6 flex-shrink-0" />
                  <span className="hidden text-sm font-medium group-hover:block whitespace-nowrap">
                    {item.label}
                  </span>
                  {hasSubmenu && (
                    <svg
                      className={`ml-auto hidden h-4 w-4 transition-transform group-hover:block ${
                        isHovered ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </Link>

                {/* Submenu */}
                {hasSubmenu && isHovered && (
                  <div className="absolute left-full top-0 ml-1 w-48 rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-left-2 duration-200">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem}
                        href="/"
                        className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                        onClick={(e) => e.preventDefault()}
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

// Icon Components
const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const TVIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const MovieIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
    />
  </svg>
);

const SportsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    className="h-6 w-6"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

