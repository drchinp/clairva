// ==============================================================
// File: components/projects/create-project-modal.tsx
// Purpose: Premium Create Project Modal (Clairva UI)
// ==============================================================

"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import ModalSection from "@/components/ui/modal-section";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ open, onClose }: Props) {
  const [visibility, setVisibility] = useState("organization");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New Project"
      description="Set up a new workspace..."
      width="xl"   // must be literal, not dynamic string
    >

      {/* ================= Project Details ================= */}
      <ModalSection title="Project Details">

        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB8A6]"
          placeholder="Project ID (e.g. PRJ-2025-001)"
        />

        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB8A6]"
          placeholder="Project Name"
        />

        <textarea
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB8A6]"
          placeholder="Description"
        />

      </ModalSection>

      {/* ================= Divider ================= */}
      <div className="border-t border-gray-100 my-4" />

      {/* ================= Configuration ================= */}
      <ModalSection title="Configuration">

        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB8A6]">
          <option>Supervisor Review Workflow</option>
        </select>

        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB8A6]">
          <option>GPT-4o (OpenAI)</option>
        </select>

        {/* Visibility Toggle */}
        <div className="flex gap-3 pt-1">

          <button
            onClick={() => setVisibility("organization")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              visibility === "organization"
                ? "bg-[#2BB8A6] text-white shadow-sm"
                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Organization
          </button>

          <button
            onClick={() => setVisibility("private")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              visibility === "private"
                ? "bg-[#2BB8A6] text-white shadow-sm"
                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Private
          </button>

        </div>

      </ModalSection>

      {/* ================= Divider ================= */}
      <div className="border-t border-gray-100 my-4" />

      {/* ================= Knowledge ================= */}
      <ModalSection title="Knowledge Sources">

        <div className="grid grid-cols-2 gap-3">

          {[
            "Policy & Guidelines Library",
            "Customer Interaction Vector Store",
            "Operational SQL Warehouse",
            "Project Uploads Workspace",
          ].map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 transition"
            >
              <input
                type="checkbox"
                className="accent-[#2BB8A6]"
              />
              {item}
            </label>
          ))}

        </div>

      </ModalSection>

      {/* ================= Footer ================= */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <button className="px-4 py-2 rounded-lg bg-[#2BB8A6] text-white text-sm font-medium shadow-sm hover:opacity-90 transition">
          Create Project
        </button>

      </div>

    </Modal>
  );
}