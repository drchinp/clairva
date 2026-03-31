// ==============================================================
// File: components/memory/create-memory-modal.tsx
// Purpose: Create Memory Modal (Clairva UI - aligned with Knowledge Modal)
// ==============================================================

"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import ModalSection from "@/components/ui/modal-section";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateMemoryModal({ open, onClose }: Props) {
  const [memoryType, setMemoryType] = useState("long_term");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Memory Source"
      description="Configure memory layers for agents including session, persistent, and embedding memory."
      width="xl"
    >

      {/* ================= 1. BASIC ================= */}
      <ModalSection title="1. Basic Information">

        <div className="grid grid-cols-2 gap-4">

          <input
            placeholder="Memory Name (e.g. User Profile Memory)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB8A6]"
          />

          <select
            value={memoryType}
            onChange={(e) => setMemoryType(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="short_term">Short-Term (Session)</option>
            <option value="long_term">Long-Term (Persistent)</option>
            <option value="embedding">Embedding Memory</option>
            <option value="agent">Agent Memory</option>
          </select>

        </div>

        <textarea
          rows={3}
          placeholder="Description (what this memory stores)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB8A6]"
        />

      </ModalSection>

      <div className="border-t border-gray-100 my-4" />

      {/* ================= 2. MEMORY CONFIG ================= */}
      <ModalSection title="2. Memory Configuration">

        {memoryType === "short_term" && (
          <input
            placeholder="Session TTL (e.g. 30 minutes)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        )}

        {memoryType === "long_term" && (
          <input
            placeholder="Storage Key (e.g. user_id)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        )}

        {memoryType === "embedding" && (
          <div className="space-y-3">
            <input
              placeholder="Vector DB Index Name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Namespace / Collection"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        )}

      </ModalSection>

      <div className="border-t border-gray-100 my-4" />

      {/* ================= 3. EMBEDDING ================= */}
      <ModalSection title="3. Embedding Configuration">

        <div className="grid grid-cols-2 gap-4">

          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>OpenAI</option>
            <option>Local Embeddings</option>
            <option>Cohere</option>
          </select>

          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>text-embedding-3-small</option>
            <option>text-embedding-3-large</option>
          </select>

        </div>

        <input
          placeholder="Chunk Size (e.g. 500 tokens)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />

        <input
          placeholder="Overlap (e.g. 50 tokens)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />

      </ModalSection>

      <div className="border-t border-gray-100 my-4" />

      {/* ================= 4. ACCESS ================= */}
      <ModalSection title="4. Agent Access">

        <div className="flex flex-wrap gap-2">

          {["Supervisor", "Claims Agent", "Reporting Agent", "Audit Agent"].map((agent) => (
            <label
              key={agent}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
            >
              <input type="checkbox" className="accent-[#2BB8A6]" />
              {agent}
            </label>
          ))}

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
          Create Memory
        </button>

      </div>

    </Modal>
  );
}