// ==============================================================
// File: frontend/components/layout/header.tsx
// Purpose: Clairva Header with Sticky + Scroll Shadow
// ==============================================================

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Search, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();

  // 🔥 Scroll detection
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 Convert path → readable label
  const formatLabel = (segment: string) => {
    return segment
      .replace("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // 🔥 Build breadcrumb array
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = [
    { label: "Clairva", href: "/dashboard" },
    ...pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      return {
        label: formatLabel(segment),
        href,
      };
    }),
  ];

  // 🔥 Title = last breadcrumb
  const title = breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard";

  // 🔥 Subtitle logic
  const getSubtitle = () => {
    if (pathname.startsWith("/agents"))
      return "Manage and orchestrate AI agents";
    if (pathname.startsWith("/projects"))
      return "Track and manage your AI projects";
    if (pathname.startsWith("/workflows"))
      return "Design and automate workflows";
    if (pathname.startsWith("/analytics"))
      return "Insights and performance metrics";
    if (pathname.startsWith("/settings"))
      return "System configuration and preferences";
    return "Overview of your workspace";
  };

  const subtitle = getSubtitle();

  return (
    <header
      className={`sticky top-0 z-30 px-6 py-5 flex items-center justify-between transition-all duration-200
      ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          : "bg-white"
      }`}
    >

      {/* ========================= */}
      {/* LEFT: TITLE + SUBTITLE + BREADCRUMB */}
      {/* ========================= */}
      <div className="flex flex-col justify-center gap-1.5 py-1">

        {/* 🔹 Title */}
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
          {title}
        </h1>

        {/* 🔹 Subtitle */}
        <p className="text-sm text-gray-500 leading-snug">
          {subtitle}
        </p>

        {/* 🔹 Breadcrumb */}
        <div className="flex items-center text-xs text-gray-400">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <div key={`${crumb.href}-${index}`} className="flex items-center">

                {!isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-[#2BB8A6] transition"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-500">
                    {crumb.label}
                  </span>
                )}

                {!isLast && (
                  <ChevronRight size={12} className="mx-2 text-gray-300" />
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* ========================= */}
      {/* RIGHT: SEARCH + ACTIONS */}
      {/* ========================= */}
      <div className="flex items-center gap-4">

        {/* 🔥 PREMIUM SEARCH */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-gray-100/80 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-sm border border-transparent hover:bg-gray-100 transition-all focus-within:ring-2 focus-within:ring-[#2BB8A6]/30 focus-within:bg-white">

            <Search size={16} className="text-gray-400" />

            <input
              type="text"
              placeholder="Search agents, workflows..."
              className="bg-transparent outline-none text-sm w-[240px] placeholder-gray-400"
            />

          </div>
        </div>

        {/* 🔔 NOTIFICATIONS */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* 👤 PROFILE */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md transition">
          <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold">
            P
          </div>
          <span className="text-sm text-gray-700 hidden md:block">
            Patrick
          </span>
        </div>

      </div>
    </header>
  );
}