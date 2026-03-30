// ==============================================================
// File: frontend/components/layout/sidebar.tsx
// Purpose: Clairva Sidebar (Figma-aligned, production-ready)
// ==============================================================

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Folder,
  Bot,
  Database,
  Wrench,
  Brain,
  Workflow,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

// 🎨 Tiffany Blue
const ACTIVE_COLOR = "bg-[#2BB8A6] text-white";

// Navigation structure
const NAV_ITEMS = [
  {
    section: "MAIN",
    items: [
      { name: "Home", href: "/dashboard", icon: Home },
      { name: "Projects", href: "/projects", icon: Folder },
      { name: "Agents", href: "/agents", icon: Bot },
    ],
  },
  {
    section: "BUILD",
    items: [
      { name: "Agent Registry", href: "/agents/registry", icon: Database },
      { name: "Tools Registry", href: "/tools", icon: Wrench },
      { name: "Knowledge / RAG", href: "/knowledge", icon: Brain },
      { name: "Memory", href: "/memory", icon: Brain },
    ],
  },
  {
    section: "WORKFLOW",
    items: [
      { name: "Workflows", href: "/workflows", icon: Workflow },
      { name: "Labeling Workflow", href: "/labeling", icon: Workflow },
    ],
  },
  {
    section: "INSIGHTS",
    items: [
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  // 🔥 Determine most specific active route
  const isItemActive = (href: string) => {
    // exact match
    if (pathname === href) return true;

    // match nested routes BUT ensure no deeper route overrides it
    const isParentMatch = pathname.startsWith(href + "/");

    const isOverridden = NAV_ITEMS.some(section =>
      section.items.some(
        item =>
          item.href !== href &&
          pathname.startsWith(item.href) &&
          item.href.length > href.length
      )
    );

    return isParentMatch && !isOverridden;
  };

  return (
    <aside className="fixed left-0 top-0 w-[240px] h-screen bg-[#FAFAFA] shadow-[2px_0_6px_rgba(0,0,0,0.04)] flex flex-col justify-between z-40">

      {/* ========================= */}
      {/* TOP SECTION */}
      {/* ========================= */}
      <div className="px-5 py-1">

        {/* LOGO */}
        <div className="mb-8">
          <Image
              src="/ClairVA.png"
              alt="ClairVA"
              width={200}
              height={80}
              style={{ width: "auto", height: "auto" }}
            />
        </div>

        {/* NAVIGATION */}
        <div className="space-y-1">
          {NAV_ITEMS.map((section) => (
            <div key={section.section}>

              {/* SECTION LABEL */}
              <p className="text-[10px] font-medium text-gray-400 tracking-wide mb-2">
                {section.section}
              </p>

              {/* ITEMS */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = isItemActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                      ${
                        isActive
                          ? "bg-[#2BB8A6] text-white font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon
                        size={18}
                        className={isActive ? "text-white" : "text-gray-500"}
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ========================= */}
      {/* BOTTOM PROFILE */}
      {/* ========================= */}
      <div className="px-2 py-4 mt-2 bg-white/50 backdrop-blur-sm rounded-xl mx-3">

        <div className="flex items-center gap-3">

          {/* AVATAR */}
          <div className="w-10 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold">
            P
          </div>

          {/* USER INFO */}
          <div className="flex-1">
            <p className="text-sm font-medium leading-tight">
              Dr. Patrick Chin
            </p>
            <p className="text-xs text-gray-500">
              patrick@clairvoyantlab.com
            </p>
          </div>
        </div>

        {/* LOGOUT */}
        <button className="mt-4 w-full flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition">
          <LogOut size={16} />
          Logout
        </button>

      </div>

    </aside>
  );
}