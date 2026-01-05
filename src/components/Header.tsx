"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">OTTStar</span>
          
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              TV
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Movies
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sports
            </Link>
          </nav>

          {/* Search Icon */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 hover:text-white transition-colors"
            aria-label="Search"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

