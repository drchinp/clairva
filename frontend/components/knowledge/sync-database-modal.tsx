// ==============================================================
// File: components/knowledge/sync-database-modal.tsx
// Purpose: Sync Database Modal (Clairva)
// ==============================================================

"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

import Modal from "@/components/ui/modal";

// ================= MOCK DATA =================
const TABLES = [
  { name: "tickets", rows: "~452K rows" },
  { name: "users", rows: "~12K rows" },
  { name: "audit_logs", rows: "~2.4M rows" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  dbName?: string;
}

export default function SyncDatabaseModal({
  open,
  onClose,
  dbName = "Customer_Support_Logs (PostgreSQL)",
}: Props) {

  const [strategy, setStrategy] = useState<"incremental" | "full">("incremental");
  const [selectedTables, setSelectedTables] = useState<string[]>(["tickets", "users"]);
  const [autoEmbed, setAutoEmbed] = useState(true);

  // ================= TOGGLE TABLE =================
  const toggleTable = (name: string) => {
    setSelectedTables((prev) =>
      prev.includes(name)
        ? prev.filter((t) => t !== name)
        : [...prev, name]
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Sync Database"
      description={dbName}
      width="lg"
    >

      <div className="space-y-6">

        {/* ================= STRATEGY ================= */}
        <div>
          <p className="text-sm font-medium text-gray-900 mb-3">
            Sync Strategy
          </p>

          <div className="space-y-3">

            {/* INCREMENTAL */}
            <div
              onClick={() => setStrategy("incremental")}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                strategy === "incremental"
                  ? "border-[#2BB8A6] bg-[#2BB8A6]/10"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={strategy === "incremental"}
                  onChange={() => setStrategy("incremental")}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 accent-[#2BB8A6]"
                />

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Incremental Sync
                  </p>
                  <p className="text-xs text-gray-500">
                    Only fetch new or updated records since last sync. Faster execution.
                  </p>
                </div>
              </div>
            </div>

            {/* FULL */}
            <div
              onClick={() => setStrategy("full")}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                strategy === "full"
                  ? "border-[#2BB8A6] bg-[#2BB8A6]/10"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={strategy === "full"}
                  onChange={() => setStrategy("full")}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 accent-[#2BB8A6]"
                />

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Full Resync
                  </p>
                  <p className="text-xs text-gray-500">
                    Clear existing embeddings and re-fetch all records. Slower execution.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= TABLES ================= */}
        <div>
          <p className="text-sm font-medium text-gray-900 mb-3">
            Tables to Sync
          </p>

          <div className="border border-gray-200 rounded-xl overflow-hidden">

            {TABLES.map((table) => {
              const isSelected = selectedTables.includes(table.name);

              return (
                <div
                  key={table.name}
                  onClick={() => toggleTable(table.name)}
                  className="flex items-center justify-between px-4 py-3 border-b last:border-none cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleTable(table.name)}
                      className="accent-[#2BB8A6]"
                    />

                    <span className="text-sm text-gray-900">
                      {table.name}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400">
                    {table.rows}
                  </span>
                </div>
              );
            })}

          </div>
        </div>

        {/* ================= POST ACTION ================= */}
        <div>
          <p className="text-sm font-medium text-gray-900 mb-3">
            Post-Sync Actions
          </p>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">

            <div>
              <p className="text-sm font-medium text-gray-900">
                Auto-Generate Embeddings
              </p>
              <p className="text-xs text-gray-500">
                Create vector embeddings for new records immediately
              </p>
            </div>

            <button
              onClick={() => setAutoEmbed(!autoEmbed)}
              className={`w-10 h-6 flex items-center rounded-full transition ${
                autoEmbed ? "bg-[#2BB8A6]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
                  autoEmbed ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>

          </div>
        </div>

      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
        >
          Cancel
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2BB8A6] text-white text-sm font-medium shadow-sm hover:opacity-90">
          <RefreshCw size={16} />
          Start Sync
        </button>

      </div>

    </Modal>
  );
}