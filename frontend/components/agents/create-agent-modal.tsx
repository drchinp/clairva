// ==============================================================
// File: components/agents/create-agent-modal.tsx
// Purpose: Create New Agent Modal (Clairva UI - Agent Config)
// ==============================================================

"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import ModalSection from "@/components/ui/modal-section";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateAgentModal({ open, onClose }: Props) {

  const [temperature, setTemperature] = useState(0.3);
  const [humanApproval, setHumanApproval] = useState(false);
  const [auditLogging, setAuditLogging] = useState(true);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Register New Agent"
      description="Configure identity, behavior, and capabilities for a new AI agent deployment."
      width="xl"
    >

      {/* ================= 1. BASIC INFORMATION ================= */}
      <ModalSection title="1. Basic Information">

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Agent Name"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB8A6]"
          />

          <input
            placeholder="Agent ID (e.g. A0009)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        <input
          placeholder="Primary Capabilities (e.g. OCR, Validation, Data Synthesis)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB8A6]"
        />

        <textarea
          rows={3}
          placeholder="Description"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB8A6]"
        />

      </ModalSection>

      <div className="border-t border-gray-100 my-4" />

      {/* ================= 2. MODEL CONFIG ================= */}
      <ModalSection title="2. Model Configuration">

        <div className="grid grid-cols-2 gap-4">

          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>OpenAI</option>
            <option>Anthropic</option>
            <option>Google</option>
            <option>Local LLaMA</option>
          </select>

          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>GPT-4o</option>
            <option>GPT-4.1-mini</option>
            <option>Claude</option>
          </select>

        </div>

        {/* Temperature */}
        <div className="pt-3">
          <label className="text-xs text-gray-500 mb-1 block">
            Temperature: {temperature}
          </label>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-[#2BB8A6]"
          />
        </div>

        <textarea
          rows={4}
          placeholder="System Prompt / Instructions"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB8A6]"
        />

      </ModalSection>

      <div className="border-t border-gray-100 my-4" />

      {/* ================= 3. TOOLS ================= */}
      <ModalSection title="3. Tools & Knowledge Access">

        <div className="flex flex-wrap gap-2">

          {["Web Search", "OCR Tool", "Database Query", "RAG Search"].map((tool) => (
            <label
              key={tool}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
            >
              <input type="checkbox" className="accent-[#2BB8A6]" />
              {tool}
            </label>
          ))}

        </div>

        <button className="mt-3 text-sm text-[#2BB8A6] hover:underline">
          + Link Knowledge Source
        </button>

      </ModalSection>

      <div className="border-t border-gray-100 my-4" />

      {/* ================= 4. ADVANCED ================= */}
      <ModalSection title="4. Advanced Settings">

        {/* Human Approval */}
        <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">

          <div>
            <p className="text-sm font-medium">Require Human Approval</p>
            <p className="text-xs text-gray-500">
              Suspend execution until manually approved.
            </p>
          </div>

          <input
            type="checkbox"
            checked={humanApproval}
            onChange={() => setHumanApproval(!humanApproval)}
            className="accent-[#2BB8A6]"
          />

        </div>

        {/* Audit Logging */}
        <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">

          <div>
            <p className="text-sm font-medium">Enable Audit Logging</p>
            <p className="text-xs text-gray-500">
              Track inputs, outputs, and reasoning steps.
            </p>
          </div>

          <input
            type="checkbox"
            checked={auditLogging}
            onChange={() => setAuditLogging(!auditLogging)}
            className="accent-[#2BB8A6]"
          />

        </div>

      </ModalSection>

      {/* ================= FOOTER ================= */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
        >
          Cancel
        </button>

        <button className="px-4 py-2 rounded-lg bg-[#2BB8A6] text-white text-sm font-medium shadow-sm hover:opacity-90">
          Deploy Agent
        </button>

      </div>

    </Modal>
  );
}
