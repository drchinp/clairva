// ==============================================================
// File: components/ui/modal.tsx
// Purpose: Standard Premium Modal (Clairva Design System - FIXED SCROLL)
// ==============================================================

"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  width?: "md" | "lg" | "xl";
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  width = "lg",
}: ModalProps) {
  if (!open) return null;

  const widthClass = {
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[width];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* 🔥 Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 🔥 Modal Card */}
      <div
        className={`relative w-full ${widthClass} mx-4 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[85vh]`}
      >

        {/* ================= HEADER (STICKY) ================= */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">

          <div>
            {title && (
              <h2 className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-gray-500 mt-1">
                {description}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>

        </div>

        {/* ================= SCROLLABLE BODY ================= */}
        <div className="px-6 py-4 overflow-y-auto flex-1 space-y-4">
          {children}
        </div>

      </div>
    </div>
  );
}