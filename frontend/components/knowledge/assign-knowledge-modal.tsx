// ==============================================================
// File: components/knowledge/assign-knowledge-modal.tsx
// Purpose: Assign Knowledge to Agents Modal (Clairva UI)
// ==============================================================

"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import Modal from "@/components/ui/modal";
import ModalSection from "@/components/ui/modal-section";

// 🔥 MOCK (replace later with real agent data)
const AGENTS = [
  { id: "A0001", name: "Document Verification Agent" },
  { id: "A0018", name: "Compliance Review Agent" },
  { id: "A0003", name: "Consulting Recommendation Agent" },
  { id: "A0007", name: "Onboarding Agent" },
  { id: "A0009", name: "Customer Service Agent" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  knowledgeName?: string;
}

export default function AssignKnowledgeModal({
  open,
  onClose,
  knowledgeName = "Knowledge Source",
}: Props) {

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  // ================= FILTER =================
  const filtered = AGENTS.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  // ================= TOGGLE =================
  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign to Agents"
      description={`Select agents to grant access to ${knowledgeName}.`}
      width="md"
    >

      <div className="space-y-4">

        {/* SEARCH */}
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents by name or ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB8A6]"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* AGENT LIST */}
        <div className="space-y-2 max-h-[320px] overflow-y-auto">

          {filtered.map((agent) => {
            const isSelected = selected.includes(agent.id);

            return (
              <div
                key={agent.id}
                onClick={() => toggle(agent.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition
                  ${
                    isSelected
                      ? "border-[#2BB8A6] bg-[#2BB8A6]/10"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
              >

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {agent.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {agent.id}
                  </span>
                </div>

                {/* CHECKBOX */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onClick={(e) => e.stopPropagation()}   // ✅ prevents parent click
                  onChange={() => toggle(agent.id)}
                  className="accent-[#2BB8A6]"
                />

              </div>
            );
          })}

        </div>

      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
        >
          Cancel
        </button>

        <button className="px-4 py-2 rounded-lg bg-[#2BB8A6] text-white text-sm font-medium shadow-sm hover:opacity-90">
          Save Assignments
        </button>

      </div>

    </Modal>
  );
}