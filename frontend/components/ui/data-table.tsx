// ==============================================================
// File: frontend/components/ui/data-table.tsx
// Purpose: Enterprise DataTable (Clairva - Final Production)
// ==============================================================

"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type Column<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
};

interface DataTableProps<T> {
  title?: string;
  action?: React.ReactNode;

  columns: Column<T>[];
  data: T[];

  getRowId: (row: T) => string;

  renderRow: (row: T) => React.ReactNode[];

  onRowClick?: (row: T) => void;

  bulkActions?: (selected: string[]) => React.ReactNode;

  pageSize?: number;
}

export default function DataTable<T>({
  title,
  action,
  columns,
  data,
  getRowId,
  renderRow,
  onRowClick,
  bulkActions,
  pageSize = 8,
}: DataTableProps<T>) {

  // =========================
  // STATE
  // =========================
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  // =========================
  // SORT
  // =========================
  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey] as string | number;
      const bVal = b[sortKey] as string | number;

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(sortedData.length / pageSize);

  const paginatedData = sortedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // =========================
  // SELECTION
  // =========================
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === paginatedData.length) {
      setSelected([]);
    } else {
      setSelected(paginatedData.map(getRowId));
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">

      {/* HEADER */}
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          {title && (
            <h3 className="text-sm font-semibold text-gray-800">
              {title}
            </h3>
          )}
          {action}
        </div>
      )}

      {/* BULK ACTION BAR */}
      {selected.length > 0 && bulkActions && (
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-sm text-gray-600">
            {selected.length} selected
          </span>
          {bulkActions(selected)}
        </div>
      )}

      {/* TABLE HEADER */}
      <div className="grid grid-cols-[40px_repeat(auto-fit,minmax(0,1fr))] px-6 py-3 text-xs text-gray-400 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">

        {/* SELECT ALL */}
        <div>
          <input
            type="checkbox"
            checked={selected.length === paginatedData.length && paginatedData.length > 0}
            onChange={toggleSelectAll}
          />
        </div>

        {columns.map((col) => (
          <div
            key={String(col.key)}
            className={`flex items-center gap-1 ${
              col.sortable ? "cursor-pointer select-none" : ""
            }`}
            onClick={() => col.sortable && handleSort(col.key)}
          >
            {col.label}

            {col.sortable && sortKey === col.key && (
              sortOrder === "asc"
                ? <ChevronUp size={12} />
                : <ChevronDown size={12} />
            )}
          </div>
        ))}
      </div>

      {/* TABLE BODY */}
      <div>

        {paginatedData.map((row) => {
          const rowId = getRowId(row);

          return (
            <div
              key={rowId}
              className="grid grid-cols-[40px_repeat(auto-fit,minmax(0,1fr))] px-6 py-4 items-center border-b border-gray-100 hover:bg-gray-50/60 transition cursor-pointer"
              onClick={() => onRowClick?.(row)}
            >

              {/* CHECKBOX */}
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selected.includes(rowId)}
                  onChange={() => toggleSelect(rowId)}
                />
              </div>

              {/* CELLS */}
              {renderRow(row).map((cell, i) => (
                <div key={`${rowId}-${i}`}>
                  {cell}
                </div>
              ))}

            </div>
          );
        })}

      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-6 py-4 bg-white">

        <span className="text-sm text-gray-500">
          Page {page} of {totalPages || 1}
        </span>

        <div className="flex gap-2">

          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
          >
            Next
          </button>

        </div>
      </div>

    </div>
  );
}