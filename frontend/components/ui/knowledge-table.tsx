/// ==============================================================
// File: components/knowledge/knowledge-table.tsx
// Purpose: Knowledge Table (Premium Standalone - DataTable Style)
// ==============================================================

"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import ActionMenu from "@/components/ui/action-menu";

// ================= TYPES =================
export type RagSource = {
  id: string;
  name: string;

  // Optional descriptive fields
  description?: string;
  type: string; // e.g. "knowledge" | "memory"
  subtype?: string; // e.g. "pdf" | "session" | "embedding"

  // Storage / size
  size?: {
    value: number;
    unit: string; // MB, GB, etc
  };

  // Core status (STRICT typing)
  status: "active" | "processing" | "failed";

  // Optional processing state
  progress?: number;

  // Agent linkage
  assignedAgents: number;

  // ✅ ADD THIS (important for your Memory + UI)
  lastRun?: string;
};

// ================= HELPERS =================
const formatSize = (size?: { value: number; unit: string }) => {
  if (!size) return "-";
  if (size.unit === "vectors") return `${size.value}M vectors`;
  return `${size.value} ${size.unit}`;
};

// ================= STATUS =================
const renderStatus = (status: string, progress?: number) => {
  if (status === "processing") {
    return (
      <div className="w-full max-w-[160px]">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Processing</span>
          <span>{progress || 0}%</span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2BB8A6]"
            style={{ width: `${progress || 0}%` }}
          />
        </div>
      </div>
    );
  }

  const styles: Record<string, string> = {
    embedded: "bg-green-100 text-green-600",
    pending: "bg-gray-100 text-gray-500",
    connected: "bg-blue-100 text-blue-600",
    active: "bg-blue-100 text-blue-600",
    failed: "bg-red-100 text-red-600",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

// ================= COMPONENT =================
export default function KnowledgeTable({
  data,
  onRowClick,
  onAssign,
  onSync, // ✅ added
}: {
  data: RagSource[];
  onRowClick?: (id: string) => void;
  onAssign?: (name: string) => void;
  onSync?: (name: string) => void; // ✅ added
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data.map((d) => d.id));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">

      {/* BULK ACTION BAR */}
      {selected.length > 0 && (
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-sm text-gray-600">
            {selected.length} selected
          </span>

          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-[#2BB8A6] text-white rounded-md">
              Assign
            </button>
            <button className="px-3 py-1 text-sm bg-gray-100 rounded-md">
              Delete
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="grid grid-cols-[60px_120px_2fr_120px_120px_180px_140px_40px] px-6 py-3 text-xs text-gray-400 border-b border-gray-100 bg-gray-50">

        <div>
          <input
            type="checkbox"
            checked={selected.length === data.length && data.length > 0}
            onChange={toggleSelectAll}
          />
        </div>

        <div>Knowledge ID</div>
        <div>Knowledge Name</div>
        <div>Type</div>
        <div>Size</div>
        <div>Status</div>
        <div>Assigned To</div>
        <div />
      </div>

      {/* BODY */}
      <div>
        {data.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-[60px_120px_2fr_120px_120px_180px_140px_40px] px-6 py-4 items-center border-b border-gray-100 hover:bg-gray-50/60 transition cursor-pointer"
            onClick={() => onRowClick?.(s.id)}
          >

            {/* CHECKBOX */}
            <div onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selected.includes(s.id)}
                onChange={() => toggleSelect(s.id)}
              />
            </div>

            {/* ID */}
            <div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {s.id}
              </span>
            </div>

            {/* NAME */}
            <div className="flex items-start gap-3 min-w-0">
              <FileText size={16} className="text-gray-400 mt-1 shrink-0" />

              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {s.name}
                </span>

                <span className="text-xs text-gray-500 line-clamp-2">
                  {s.description || `${s.subtype || s.type}`}
                </span>
              </div>
            </div>

            {/* TYPE */}
            <div className="text-sm text-gray-600">
              {s.subtype || s.type}
            </div>

            {/* SIZE */}
            <div className="text-sm text-gray-600">
              {formatSize(s.size)}
            </div>

            {/* STATUS */}
            <div>
              {renderStatus(s.status, s.progress)}
            </div>

            {/* ASSIGNED */}
            <div className="text-sm text-gray-700">
              {s.assignedAgents} Agents
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              <ActionMenu
                actions={[
                  { label: "Assign to Agent", onClick: () => onAssign?.(s.name) },
                  { label: "Sync Database", onClick: () => onSync?.(s.name) }, // ✅ FIXED
                  { label: "View Details", onClick: () => console.log("View", s.id) },
                  { label: "Delete", onClick: () => console.log("Delete", s.id), danger: true },
                ]}
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}