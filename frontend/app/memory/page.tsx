// ==============================================================
// File: app/memory/page.tsx
// Purpose: Memory Registry (Clairva - SAME as Knowledge Page)
// ==============================================================

"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Database, Activity, AlertTriangle } from "lucide-react";

// ✅ IMPORTANT: only import RagSource (no duplicate type)
import KnowledgeTable, { RagSource } from "@/components/ui/knowledge-table";

import TabMenu from "@/components/ui/tab-menu";
import MetricCard from "@/components/ui/metric-card";

// ✅ Use Memory modal (NOT knowledge)
import CreateMemoryModal from "@/components/memory/create-memory-modal";

// Reuse for now (OK)
import AssignKnowledgeModal from "@/components/knowledge/assign-knowledge-modal";
import SyncDatabaseModal from "@/components/knowledge/sync-database-modal";

// ==============================================================
// TYPES
// ==============================================================

type MemoryStatus = "active" | "processing" | "failed";

// ✅ Align fully with KnowledgeTable
type MemorySource = RagSource;

// ==============================================================
// DATA
// ==============================================================

const MEMORY_SOURCES: MemorySource[] = [
  {
    id: "M001",
    name: "User Memory Store",
    status: "active",
    type: "memory",
    assignedAgents: 2,
  },
  {
    id: "M002",
    name: "Session Buffer",
    status: "processing",
    type: "memory",
    assignedAgents: 1,
  },
  {
    id: "M003",
    name: "Claims Embeddings",
    status: "failed",
    type: "memory",
    assignedAgents: 0,
  },
];

// ==============================================================
// COMPONENT
// ==============================================================

export default function MemoryPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<MemoryStatus | "all">("all");

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openSyncModal, setOpenSyncModal] = useState(false);

  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);
  const [selectedMemoryForSync, setSelectedMemoryForSync] = useState<string | null>(null);

  // ================= TABS =================
  const tabs = [
    { key: "all", label: "All Memory" },
    { key: "active", label: "Active" },
    { key: "processing", label: "Processing" },
    { key: "failed", label: "Failed" },
  ];

  // ================= METRICS =================
  const metrics = useMemo(() => {
    return {
      total: MEMORY_SOURCES.length,
      active: MEMORY_SOURCES.filter((s) => s.status === "active").length,
      processing: MEMORY_SOURCES.filter((s) => s.status === "processing").length,
      failed: MEMORY_SOURCES.filter((s) => s.status === "failed").length,
    };
  }, []);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    return MEMORY_SOURCES.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());

      const matchTab =
        activeTab === "all" ? true : s.status === activeTab;

      return matchSearch && matchTab;
    });
  }, [search, activeTab]);

  // ================= HANDLERS =================
  const handleAssign = (name: string) => {
    setSelectedMemory(name);
    setOpenAssignModal(true);
  };

  const handleSync = (name: string) => {
    setSelectedMemoryForSync(name);
    setOpenSyncModal(true);
  };

  return (
    <div className="space-y-6">

      {/* ================= METRICS ================= */}
      <div className="grid grid-cols-4 gap-6">

        <MetricCard
          title="Total Memory"
          value={metrics.total.toString()}
          change="All memory stores"
          icon={Database}
        />

        <MetricCard
          title="Active"
          value={metrics.active.toString()}
          change="Ready for retrieval"
          icon={Activity}
        />

        <MetricCard
          title="Processing"
          value={metrics.processing.toString()}
          change="Updating / embedding"
          icon={Activity}
        />

        <MetricCard
          title="Failed"
          value={metrics.failed.toString()}
          change="Requires attention"
          positive={false}
          icon={AlertTriangle}
        />

      </div>

      {/* ================= SEARCH + ACTION ================= */}
      <div className="flex justify-between items-center gap-4">

        <div className="relative w-full max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memory..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-[#2BB8A6] outline-none"
          />

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <button
          onClick={() => setOpenCreateModal(true)}
          className="flex items-center gap-2 bg-[#2BB8A6] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:opacity-90 transition"
        >
          <Plus size={16} />
          Add Memory
        </button>

      </div>

      {/* ================= TABS ================= */}
      <TabMenu
        tabs={tabs}
        activeTab={activeTab}
        onChange={(key) => setActiveTab(key as MemoryStatus | "all")}
      />

      {/* ================= TABLE ================= */}
      <KnowledgeTable
        data={filtered}
        onRowClick={(id) => console.log(id)}
        onAssign={(name: string) => handleAssign(name)}
        onSync={(name: string) => handleSync(name)}
      />

      {/* ================= MODALS ================= */}

      {/* ✅ Memory modal */}
      <CreateMemoryModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      />

      {/* reuse for now */}
      <AssignKnowledgeModal
        open={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        knowledgeName={selectedMemory || ""}
      />

      <SyncDatabaseModal
        open={openSyncModal}
        onClose={() => setOpenSyncModal(false)}
        dbName={selectedMemoryForSync || ""}
      />

    </div>
  );
}