// ==============================================================
// File: app/tools/page.tsx
// Purpose: Tools Registry Table (Clairva)
// ==============================================================

"use client";

import { useState } from "react";
import { Search, Plus, Wrench, Zap, Activity, AlertTriangle } from "lucide-react";

import DataTable from "@/components/ui/data-table";
import TabMenu from "@/components/ui/tab-menu";
import MetricCard from "@/components/ui/metric-card";
import ActionMenu from "@/components/ui/action-menu";

import { TOOLS } from "../data/tools-catalogue";
import CreateToolModal from "@/components/tools/create-tool-modal";

// ================= TYPES =================
type ColumnKey =
  | "id"
  | "name"
  | "capabilities"
  | "input"
  | "output"
  | "status"
  | "lastRun"
  | "actions";

type TableRow = {
  rawId: string;
  id: React.ReactNode;
  name: React.ReactNode;
  capabilities: React.ReactNode;
  input: React.ReactNode;
  output: React.ReactNode;
  status: React.ReactNode;
  lastRun: React.ReactNode;
  actions: React.ReactNode;
};

type TabKey = "all" | "active" | "idle" | "failed";

// ================= COMPONENT =================
export default function ToolsRegistryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const [openCreateModal, setOpenCreateModal] = useState(false);

  // ================= TABS =================
  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "All Tools" },
    { key: "active", label: "Active" },
    { key: "idle", label: "Idle" },
    { key: "failed", label: "Failed" },
  ];

  // ================= FILTER =================
  const filteredTools = TOOLS.filter((tool) => {
    const matchSearch = tool.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "all" || tool.category === category;

    // 🔥 TAB CONTROLS STATUS
    const matchStatus =
      activeTab === "all" ? true : tool.status === activeTab;

    return matchSearch && matchCategory && matchStatus;
  });

  // ================= COLUMNS =================
  const columns: { key: ColumnKey; label: string }[] = [
    { key: "id", label: "Tool ID" },
    { key: "name", label: "Tool Name" },
    { key: "capabilities", label: "Capabilities" },
    { key: "input", label: "Input" },
    { key: "output", label: "Output" },
    { key: "status", label: "Status" },
    { key: "lastRun", label: "Last Run" },
    { key: "actions", label: "" },
  ];

  // ================= DATA =================
  const data: TableRow[] = filteredTools.map((tool) => ({
    rawId: tool.id,

    id: (
      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
        {tool.id}
      </span>
    ),

    name: (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {tool.name}
        </span>
        <span className="text-xs text-gray-500">
          {tool.description}
        </span>
      </div>
    ),

    capabilities: (
      <div className="flex flex-wrap gap-1">
        {(tool.capabilities || []).map((c: string) => (
          <span key={c} className="text-xs text-gray-600">
            {c}
          </span>
        ))}
      </div>
    ),

    input: (
      <div className="flex flex-wrap gap-1">
        {(tool.input || []).map((i: string) => (
          <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
            {i}
          </span>
        ))}
      </div>
    ),

    output: (
      <div className="flex flex-wrap gap-1">
        {(tool.output || []).map((o: string) => (
          <span key={o} className="text-xs bg-gray-100 px-2 py-1 rounded">
            {o}
          </span>
        ))}
      </div>
    ),

    status: (
      <span
        className={`text-xs font-medium ${
          tool.status === "active"
            ? "text-green-600"
            : tool.status === "failed"
            ? "text-red-600"
            : "text-gray-500"
        }`}
      >
        ● {tool.status || "idle"}
      </span>
    ),

    lastRun: (
      <span className="text-xs text-gray-500">
        {tool.lastRun || "—"}
      </span>
    ),

    actions: (
      <div className="flex justify-end">
        <ActionMenu
          actions={[
            { label: "View Details", onClick: () => console.log("View", tool.id) },
            { label: "Edit Tool", onClick: () => console.log("Edit", tool.id) },
            { label: "Test Tool", onClick: () => console.log("Test", tool.id) },
            { label: "Disable", onClick: () => console.log("Disable", tool.id) },
            { label: "Delete", onClick: () => console.log("Delete", tool.id), danger: true },
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
          title="Total Tools"
          value={TOOLS.length.toString()}
          change="All available tools"
          icon={Wrench}
        />

        <MetricCard
          title="Active Tools"
          value={TOOLS.filter(t => t.status === "active").length.toString()}
          change="Operational"
          icon={Activity}
        />

        <MetricCard
          title="Executions Today"
          value="2,184"
          change="+8.4%"
          icon={Zap}
        />

        <MetricCard
          title="Failures"
          value={TOOLS.filter(t => t.status === "failed").length.toString()}
          change="Needs fix"
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
            placeholder="Search tools..."
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
            <option value="integration">Integration</option>
            <option value="ai">AI</option>
            <option value="data">Data</option>
          </select>

          <button
            onClick={() => setOpenCreateModal(true)}
            className="flex items-center gap-2 bg-[#2BB8A6] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:opacity-90 transition"
          >
            <Plus size={16} />
            Create New Tool
          </button>

        </div>
      </div>

      {/* ================= TABS (MOVED BELOW SEARCH) ================= */}
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
          row.input,
          row.output,
          row.status,
          row.lastRun,
          row.actions,
        ]}
      />

      {/* ================= MODAL ================= */}
      <CreateToolModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      />

    </div>
  );
}