// ==============================================================
// File: components/ui/action-menu.tsx
// Purpose: Reusable Action Dropdown (⋮ menu)
// ==============================================================

"use client";

import { useState, useRef, useEffect } from "react";

interface Action {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface Props {
  actions: Action[];
}

export default function ActionMenu({ actions }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onClick={(e) => e.stopPropagation()} // prevent row click
    >
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
      >
        ⋮
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-50">

          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                action.danger ? "text-red-600" : "text-gray-700"
              }`}
            >
              {action.label}
            </button>
          ))}

        </div>
      )}
    </div>
  );
}