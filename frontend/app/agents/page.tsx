// ==============================================================
// File: app/agents/page.tsx
// Purpose: Agent Marketplace Page (Clairva - Using Central Catalogue)
// ==============================================================

"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List, Search } from "lucide-react";
import TabMenu from "@/components/ui/tab-menu";
import { AGENTS } from "../data/agent-catalogue";

// ✅ NEW IMPORT
import CreateAgentModal from "@/components/agents/create-agent-modal";

type Agent = {
  id: string;
  name: string;
  description: string;
  category: "core" | "capability" | "solution" | "advisory";
};

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  // ✅ NEW STATE (modal)
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // ✅ NEW STATE (search)
  const [search, setSearch] = useState("");

  const tabs = [
    { key: "all", label: "All Modules" },
    { key: "core", label: "Core Brain" },
    { key: "capability", label: "Capabilities" },
    { key: "solution", label: "Solutions" },
    { key: "advisory", label: "Advisory" },
  ];

  const agents: Agent[] = AGENTS;

  // ✅ UPDATED FILTER (tab + search)
  const filteredAgents = agents.filter((agent) => {
    const matchesTab =
      activeTab === "all" || agent.category === activeTab;

    const matchesSearch =
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.description.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between gap-4">

        {/* LEFT: TAB MENU */}
        <TabMenu
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* 🔥 MIDDLE: SEARCH BAR */}
        <div className="flex-1 max-w-xl relative">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents, workflows..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB8A6]"
          />

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

        </div>

        {/* RIGHT: VIEW + CTA */}
        <div className="flex items-center gap-3">

          {/* VIEW TOGGLE */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">

            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-md transition ${
                view === "grid"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LayoutGrid size={16} />
            </button>

            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-md transition ${
                view === "list"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List size={16} />
            </button>

          </div>

          {/* CTA */}
          <button
            onClick={() => setOpenCreateModal(true)}
            className="flex items-center gap-2 bg-[#2BB8A6] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:opacity-90 transition"
          >
            <Plus size={16} />
            Create New Agent
          </button>

        </div>

      </div>

      {/* ================= GRID / LIST ================= */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }
      >

        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >

            {/* HEADER */}
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-gray-900">
                {agent.name}
              </h3>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {agent.id}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-500 mt-1 mb-4 line-clamp-2 min-h-[40px]">
              {agent.description}
            </p>

            {/* DIVIDER */}
            <div className="border-t border-gray-100 my-3" />

            {/* FOOTER */}
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span>1,240 runs</span>
              <span>2h ago</span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <button className="flex-1 bg-[#2BB8A6] text-white text-xs py-2 rounded-lg font-medium hover:opacity-90">
                Deploy
              </button>
              <button className="flex-1 border border-gray-200 text-xs py-2 rounded-lg font-medium hover:bg-gray-50">
                Configure
              </button>
            </div>

          </div>
        ))}

      </div>

      {/* ================= MODAL ================= */}
      <CreateAgentModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      />

    </div>
  );
}