// ==============================================================
// File: app/agents/registry/page.tsx
// Purpose: Agent Registry Table (Clairva)
// ==============================================================

"use client";

import { useState } from "react";
import { Search, Plus, Bot, Activity, CheckCircle, AlertTriangle } from "lucide-react";

import DataTable from "@/components/ui/data-table";
import TabMenu from "@/components/ui/tab-menu";
import MetricCard from "@/components/ui/metric-card";
import ActionMenu from "@/components/ui/action-menu";

import { AGENTS } from "../../data/agent-catalogue";
import CreateAgentModal from "@/components/agents/create-agent-modal";

// ================= TYPES =================
type ColumnKey =
  | "id"
  | "name"
  | "capabilities"
  | "tools"
  | "knowledge"
  | "status"
  | "lastRun"
  | "actions";

type TableRow = {
  rawId: string;
  id: React.ReactNode;
  name: React.ReactNode;
  capabilities: React.ReactNode;
  tools: React.ReactNode;
  knowledge: React.ReactNode;
  status: React.ReactNode;
  lastRun: React.ReactNode;
  actions: React.ReactNode;
};

type TabKey = "all" | "active" | "idle" | "failed";

// ================= COMPONENT =================
export default function AgentRegistryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const [openCreateModal, setOpenCreateModal] = useState(false);

  // ================= TABS =================
  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "All Agents" },
    { key: "active", label: "Active" },
    { key: "idle", label: "Idle" },
    { key: "failed", label: "Failed" },
  ];

  // ================= FILTER =================
  const filteredAgents = AGENTS.filter((agent) => {
    const matchSearch = agent.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "all" || agent.category === category;

    // 🔥 TAB CONTROLS STATUS
    const matchStatus =
      activeTab === "all" ? true : agent.status === activeTab;

    return matchSearch && matchCategory && matchStatus;
  });

  // ================= TABLE COLUMNS =================
  const columns: { key: ColumnKey; label: string }[] = [
    { key: "id", label: "Agent ID" },
    { key: "name", label: "Agent Name" },
    { key: "capabilities", label: "Capabilities" },
    { key: "tools", label: "Required Tools" },
    { key: "knowledge", label: "Knowledge Sources" },
    { key: "status", label: "Status" },
    { key: "lastRun", label: "Last Run" },
    { key: "actions", label: "" },
  ];

  // ================= TABLE DATA =================
  const data: TableRow[] = filteredAgents.map((agent) => ({
    rawId: agent.id,

    id: (
      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
        {agent.id}
      </span>
    ),

    name: (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {agent.name}
        </span>
        <span className="text-xs text-gray-500">
          {agent.description}
        </span>
      </div>
    ),

    capabilities: (
      <div className="flex flex-wrap gap-1">
        {(agent.capabilities || []).map((c: string) => (
          <span key={c} className="text-xs text-gray-600">
            {c}
          </span>
        ))}
      </div>
    ),

    tools: (
      <div className="flex flex-wrap gap-1">
        {(agent.tools || []).map((t: string) => (
          <span
            key={t}
            className="text-xs bg-gray-100 px-2 py-1 rounded"
          >
            {t}
          </span>
        ))}
      </div>
    ),

    knowledge: (
      <div className="flex flex-wrap gap-1">
        {(agent.knowledge || []).map((k: string) => (
          <span
            key={k}
            className="text-xs bg-gray-100 px-2 py-1 rounded"
          >
            {k}
          </span>
        ))}
      </div>
    ),

    status: (
      <span
        className={`text-xs font-medium ${
          agent.status === "active"
            ? "text-green-600"
            : agent.status === "failed"
            ? "text-red-600"
            : "text-gray-500"
        }`}
      >
        ● {agent.status || "idle"}
      </span>
    ),

    lastRun: (
      <span className="text-xs text-gray-500">
        {agent.lastRun || "—"}
      </span>
    ),

    actions: (
      <div className="flex justify-end">
        <ActionMenu
          actions={[
            { label: "View Details", onClick: () => console.log("View", agent.id) },
            { label: "Configure", onClick: () => console.log("Configure", agent.id) },
            { label: "Run Agent", onClick: () => console.log("Run", agent.id) },
            { label: "Disable", onClick: () => console.log("Disable", agent.id) },
            { label: "Delete", onClick: () => console.log("Delete", agent.id), danger: true },
          ]}
        />
      </div>
    ),
  }));

  return (
    <div className="space-y-6">

      {/* ================= METRICS ================= */}
      <div className="grid grid-cols-4 gap-6">

        <MetricCard
          title="Total Agents"
          value={AGENTS.length.toString()}
          change="All registered agents"
          icon={Bot}
        />

        <MetricCard
          title="Active Agents"
          value={AGENTS.filter(a => a.status === "active").length.toString()}
          change="Running normally"
          icon={Activity}
        />

        <MetricCard
          title="Successful Runs"
          value="98.2%"
          change="+1.2% improvement"
          icon={CheckCircle}
        />

        <MetricCard
          title="Errors"
          value={AGENTS.filter(a => a.status === "failed").length.toString()}
          change="Requires attention"
          positive={false}
          icon={AlertTriangle}
        />

      </div>

      {/* ================= SEARCH + FILTER ================= */}
      <div className="flex justify-between items-center gap-4">

        <div className="relative w-full max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB8A6]"
          />

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2">

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-100 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="core">Core</option>
            <option value="capability">Capability</option>
            <option value="solution">Solution</option>
            <option value="advisory">Advisory</option>
          </select>

          <button
            onClick={() => setOpenCreateModal(true)}
            className="flex items-center gap-2 bg-[#2BB8A6] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:opacity-90 transition"
          >
            <Plus size={16} />
            Create New Agent
          </button>

        </div>
      </div>

      {/* ================= TABS (MOVED HERE) ================= */}
      <TabMenu
        tabs={tabs}
        activeTab={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
      />

      {/* ================= TABLE ================= */}
      <DataTable<TableRow>
        columns={columns}
        data={data}
        getRowId={(row) => row.rawId}
        renderRow={(row) => [
          row.id,
          row.name,
          row.capabilities,
          row.tools,
          row.knowledge,
          row.status,
          row.lastRun,
          row.actions,
        ]}
        onRowClick={(row) => {
          console.log("Agent clicked:", row.rawId);
        }}
      />

      {/* ================= MODAL ================= */}
      <CreateAgentModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      />

    </div>
  );
}