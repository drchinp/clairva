// ==============================================================
// File: frontend/components/ui/transaction-table.tsx
// Purpose: Transaction Table (Executions / Logs / Runs)
// ==============================================================

"use client";

import { ReactNode } from "react";
import ActionMenu from "./action-menu";

// ================= TYPES =================
export type TransactionColumn = {
  key: string;
  label: string;
};

export interface TransactionRow {
  id: string;
  cells: ReactNode[];
  actions?: {
    label: string;
    onClick: () => void;
    danger?: boolean;
  }[];
}

// ================= GRID TEMPLATE =================
// 🔥 SINGLE SOURCE OF TRUTH (fix alignment)
const GRID_TEMPLATE = "220px 1fr 180px 140px 40px";

// ================= COMPONENT =================
export default function TransactionTable({
  title,
  action,
  columns,
  data,
  onRowClick,
}: {
  title?: string;
  action?: ReactNode;
  columns: TransactionColumn[];
  data: TransactionRow[];
  onRowClick?: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">

      {/* ================= HEADER ================= */}
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {title && (
            <h3 className="text-sm font-semibold text-gray-800">
              {title}
            </h3>
          )}
          {action}
        </div>
      )}

      {/* ================= COLUMN HEADER ================= */}
      <div
        className="grid px-6 py-3 text-xs text-gray-400 border-b border-gray-100 bg-gray-50"
        style={{ gridTemplateColumns: GRID_TEMPLATE }}
      >
        {columns.map((col) => (
          <div key={col.key} className="flex items-center">
            {col.label}
          </div>
        ))}

        {/* ✅ ACTION COLUMN PLACEHOLDER (IMPORTANT) */}
        <div />
      </div>

      {/* ================= BODY ================= */}
      <div>
        {data.map((row) => (
          <div
            key={row.id}
            className="grid px-6 py-4 items-center border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
            style={{ gridTemplateColumns: GRID_TEMPLATE }}
            onClick={() => onRowClick?.(row.id)}
          >

            {/* ================= CELLS ================= */}
            {row.cells.map((cell, i) => (
              <div key={i} className="flex items-center min-w-0">
                {cell}
              </div>
            ))}

            {/* ================= ACTIONS ================= */}
            <div
              className="flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {row.actions && (
                <ActionMenu actions={row.actions} />
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}