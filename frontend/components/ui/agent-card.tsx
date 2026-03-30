// ==============================================================
// File: components/agents/agent-card.tsx
// Purpose:
//   Clairva v2.0 Agent Card (AI Workforce Unit)
//   Displays agent role, capabilities, use cases, and deployment
// ==============================================================

"use client";

import { Play, Settings, Layers } from "lucide-react";

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  capabilities?: string[];
  useCases?: string[];
  runs?: number;
  lastRun?: string;
  status?: "active" | "inactive";
}

export default function AgentCard({
  id,
  name,
  description,
  category,
  capabilities = [],
  useCases = [],
  runs,
  lastRun,
  status = "active",
}: AgentCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">

      {/* 🔷 HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-xs text-gray-400">{id}</p>
        </div>

        {/* STATUS BADGE */}
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      {/* 🔷 CATEGORY */}
      <div className="mb-3">
        <span className="text-xs bg-[#E6F7F4] text-[#2BB8A6] px-2 py-1 rounded-full">
          {category}
        </span>
      </div>

      {/* 🔷 DESCRIPTION */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        {description}
      </p>

      {/* 🔷 CAPABILITIES */}
      {capabilities.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-1">Capabilities</p>
          <div className="flex flex-wrap gap-2">
            {capabilities.map((cap, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 🔷 USE CASES */}
      {useCases.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-1">Used In</p>
          <div className="flex flex-wrap gap-2">
            {useCases.map((use, index) => (
              <span
                key={index}
                className="text-xs bg-[#F1F5F9] text-gray-700 px-2 py-1 rounded"
              >
                {use}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 🔷 FOOTER INFO */}
      <div className="flex justify-between text-xs text-gray-400 mb-4">
        <span>{runs ? `${runs.toLocaleString()} runs` : "-"}</span>
        <span>{lastRun || "-"}</span>
      </div>

      {/* 🔷 ACTIONS */}
      <div className="flex gap-2">

        {/* DEPLOY IN WORKFLOW */}
        <button className="flex-1 flex items-center justify-center gap-1 bg-[#2BB8A6] text-white text-sm py-2 rounded-lg hover:opacity-90 transition">
          <Play size={14} />
          Deploy
        </button>

        {/* RUN STANDALONE */}
        <button className="flex-1 flex items-center justify-center gap-1 border border-gray-200 text-gray-700 text-sm py-2 rounded-lg hover:bg-gray-50 transition">
          <Layers size={14} />
          Run
        </button>

        {/* CONFIGURE */}
        <button className="flex items-center justify-center px-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition">
          <Settings size={14} />
        </button>

      </div>
    </div>
  );
}