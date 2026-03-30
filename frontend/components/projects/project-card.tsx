// ==============================================================
// File: frontend/components/projects/project-card.tsx
// Purpose: Project Card with Working Dropdown + Actions (Clairva)
// ==============================================================

"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Activity,
  Clock,
  Pencil,
  Copy,
  Pause,
  Trash,
} from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  status: "active" | "paused" | "attention";
  runs: number;
  lastRun: string;

  // 🔥 ACTION HANDLERS (READY FOR BACKEND)
  onEdit?: () => void;
  onDuplicate?: () => void;
  onPause?: () => void;
  onDelete?: () => void;
}

export default function ProjectCard({
  title,
  description,
  status,
  runs,
  lastRun,
  onEdit,
  onDuplicate,
  onPause,
  onDelete,
}: ProjectCardProps) {

  const [open, setOpen] = useState(false);

  // ✅ WRAP BOTH BUTTON + DROPDOWN
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // ✅ CLICK OUTSIDE (FIXED)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;

      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusStyle = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-600";
      case "paused":
        return "bg-gray-100 text-gray-500";
      case "attention":
        return "bg-orange-100 text-orange-600";
      default:
        return "";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "active":
        return "Active";
      case "paused":
        return "Paused";
      case "attention":
        return "Needs Attention";
      default:
        return "";
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition cursor-pointer p-5">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}
      <div className="flex items-start justify-between mb-3">

        <div>
          <h3 className="text-base font-semibold text-gray-900 leading-tight">
            {title}
          </h3>

          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {description}
          </p>
        </div>

        {/* 🔥 WRAPPER (IMPORTANT FIX) */}
        <div ref={wrapperRef} className="relative">

          {/* 3 DOT BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
            className="p-1 rounded-md hover:bg-gray-100 transition"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 z-20">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  onEdit?.();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
              >
                <Pencil size={14} /> Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  onDuplicate?.();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
              >
                <Copy size={14} /> Duplicate
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  onPause?.();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
              >
                <Pause size={14} /> Pause
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  onDelete?.();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash size={14} /> Delete
              </button>

            </div>
          )}

        </div>

      </div>

      {/* ========================= */}
      {/* STATUS */}
      {/* ========================= */}
      <div className="mb-4">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* ========================= */}
      {/* DIVIDER */}
      {/* ========================= */}
      <div className="border-t border-gray-100 my-4"></div>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}
      <div className="flex items-center justify-between text-xs text-gray-500">

        <div className="flex items-center gap-2">
          <Activity size={14} className="text-gray-400" />
          {runs.toLocaleString()} runs
        </div>

        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-400" />
          {lastRun}
        </div>

      </div>

    </div>
  );
}