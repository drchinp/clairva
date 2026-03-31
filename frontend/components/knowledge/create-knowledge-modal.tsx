// ==============================================================
// File: components/knowledge/create-knowledge-modal.tsx
// Purpose: Create Knowledge Source Modal (Clairva UI)
// ==============================================================

"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import ModalSection from "@/components/ui/modal-section";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateKnowledgeModal({ open, onClose }: Props) {

  const [type, setType] = useState("document");
  const [authType, setAuthType] = useState("none");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Knowledge Source"
      description="Connect documents, databases, or vector stores for agent retrieval and reasoning."
      width="xl"
    >

      {/* ================= 1. BASIC ================= */}
      <ModalSection title="1. Basic Information">

        <div className="grid grid-cols-2 gap-4">

          <input
            placeholder="Source Name (e.g. Company Policies)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB8A6]"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="document">Document</option>
            <option value="database">Database</option>
            <option value="vector_store">Vector Store</option>
            <option value="api">API</option>
          </select>

        </div>

        <textarea
          rows={3}
          placeholder="Description (what this knowledge source contains)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB8A6]"
        />

      </ModalSection>

      <div className="border-t border-gray-100 my-4" />

      {/* ================= 2. SOURCE CONFIG ================= */}
      <ModalSection title="2. Source Configuration">

        {type === "document" && (
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500">
            Drag & drop files or click to upload (PDF, DOCX, CSV)
          </div>
        )}

        {type === "database" && (
          <div className="space-y-3">

            <input
              placeholder="Database Connection URL"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />

            <input
              placeholder="Database Name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />

          </div>
        )}

        {type === "vector_store" && (
          <div className="space-y-3">

            <input
              placeholder="Vector DB Endpoint (e.g. Pinecone URL)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />

            <input
              placeholder="Index Name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />

          </div>
        )}

        {type === "api" && (
          <div className="space-y-3">

            <input
              placeholder="API Endpoint URL"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />

            <select
              value={authType}
              onChange={(e) => setAuthType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="none">No Authentication</option>
              <option value="bearer">Bearer Token</option>
              <option value="api_key">API Key</option>
            </select>

            {authType !== "none" && (
              <input
                placeholder="Enter API Key / Token"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            )}

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
          Create Knowledge Source
        </button>

      </div>

    </Modal>
  );
}