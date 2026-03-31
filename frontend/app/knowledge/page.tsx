// ==============================================================
// File: app/knowledge/page.tsx
// Purpose: Knowledge Registry (Clairva - Dashboard-aligned)
// ==============================================================

"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Database, Activity, AlertTriangle } from "lucide-react";

import KnowledgeTable, {
  RagSource,
} from "@/components/ui/knowledge-table";

import TabMenu from "@/components/ui/tab-menu";
import MetricCard from "@/components/ui/metric-card";
import CreateKnowledgeModal from "@/components/knowledge/create-knowledge-modal";
import AssignKnowledgeModal from "@/components/knowledge/assign-knowledge-modal";
import SyncDatabaseModal from "@/components/knowledge/sync-database-modal";

import { RAG_SOURCES } from "@/app/data/knowledge-catalogue";

// ================= TYPES =================
type TabKey = "all" | "active" | "processing" | "failed";

// ================= COMPONENT =================
export default function KnowledgePage() {
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openSyncModal, setOpenSyncModal] = useState(false);

  const [selectedKnowledge, setSelectedKnowledge] = useState<string | null>(null);
  const [selectedKnowledgeForSync, setSelectedKnowledgeForSync] = useState<string | null>(null);

  // ================= TABS =================
  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "All Knowledge" },
    { key: "active", label: "Active" },
    { key: "processing", label: "Processing" },
    { key: "failed", label: "Failed" },
  ];

  // ================= METRICS =================
  const metrics = useMemo(() => {
    return {
      total: RAG_SOURCES.length,
      active: RAG_SOURCES.filter((s) => s.status === "active").length,
      processing: RAG_SOURCES.filter((s) => s.status === "processing").length,
      failed: RAG_SOURCES.filter((s) => s.status === "failed").length,
    };
  }, []);

  // ================= FILTER =================
  const filtered: RagSource[] = useMemo(() => {
    return RAG_SOURCES.filter((s) => {
      const matchSearch = s.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchTab =
        activeTab === "all" ? true : s.status === activeTab;

      return matchSearch && matchTab;
    });
  }, [search, activeTab]);

  // ================= ASSIGN HANDLER =================
  const handleAssign = (name: string) => {
    setSelectedKnowledge(name);
    setOpenAssignModal(true);
  };

  // ================= SYNC HANDLER (🔥 FIXED) =================
  const handleSync = (name: string) => {
    setSelectedKnowledgeForSync(name);
    setOpenSyncModal(true);
  };

  return (
    <div className="space-y-6">

      {/* ================= METRICS ================= */}
      <div className="grid grid-cols-4 gap-6">

        <MetricCard
          title="Total Knowledge"
          value={metrics.total.toString()}
          change="All sources"
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
          change="Embedding in progress"
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
            placeholder="Search knowledge..."
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
          Add Knowledge
        </button>

      </div>

      {/* ================= TABS ================= */}
      <TabMenu
        tabs={tabs}
        activeTab={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
      />

      {/* ================= TABLE ================= */}
      <KnowledgeTable
        data={filtered}
        onRowClick={(id) => console.log(id)}
        onAssign={(name: string) => handleAssign(name)}
        onSync={(name: string) => handleSync(name)} // ✅ FIXED
      />

      {/* ================= MODALS ================= */}

      <CreateKnowledgeModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      />

      <AssignKnowledgeModal
        open={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        knowledgeName={selectedKnowledge || ""}
      />

      <SyncDatabaseModal
        open={openSyncModal}
        onClose={() => setOpenSyncModal(false)}
        dbName={selectedKnowledgeForSync || ""}
      />

    </div>
  );
}