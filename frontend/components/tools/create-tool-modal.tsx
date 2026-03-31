// ==============================================================
// File: components/tools/create-tool-modal.tsx
// Purpose: Create New Tool Modal (Clairva - API Tool Definition)
// ==============================================================

"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import ModalSection from "@/components/ui/modal-section";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateToolModal({ open, onClose }: Props) {

  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const updated = [...headers];
    updated[index][field] = value;
    setHeaders(updated);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Register New Tool"
      description="Configure a new external integration or API for your agents"
      width="xl"
    >

      {/* ================= BASIC INFO ================= */}
      <ModalSection title="Basic Information">

        <input
          placeholder="Tool Name (e.g. Custom Web Scraper)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB8A6]"
        />

        <textarea
          rows={3}
          placeholder="Briefly describe what this tool does..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB8A6]"
        />

        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option>Select Category...</option>
          <option>API</option>
          <option>AI</option>
          <option>Integration</option>
          <option>Data</option>
        </select>

      </ModalSection>

      <div className="border-t border-gray-100 my-4" />

      {/* ================= API CONFIG ================= */}
      <ModalSection title="API Configuration">

        <input
          placeholder="Endpoint URL (e.g. https://api.example.com/v1/resource)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />

        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option>Bearer Token</option>
          <option>API Key</option>
          <option>Basic Auth</option>
          <option>None</option>
        </select>

        <input
          placeholder="API Key / Token"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />

        {/* HEADERS */}
        <div className="space-y-2">

          {headers.map((h, i) => (
            <div key={i} className="flex gap-2">

              <input
                placeholder="Header Key"
                value={h.key}
                onChange={(e) => updateHeader(i, "key", e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />

              <input
                placeholder="Value"
                value={h.value}
                onChange={(e) => updateHeader(i, "value", e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />

              <button
                onClick={() => removeHeader(i)}
                className="px-3 text-gray-400 hover:text-red-500"
              >
                ✕
              </button>

            </div>
          ))}

          <button
            onClick={addHeader}
            className="text-sm text-[#2BB8A6] hover:underline"
          >
            + Add Header
          </button>

        </div>

      </ModalSection>

      <div className="border-t border-gray-100 my-4" />

      {/* ================= SCHEMA ================= */}
      <ModalSection title="Schema Definition">

        <textarea
          rows={6}
          placeholder={`Input Schema (JSON)
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string"
    }
  },
  "required": ["query"]
}`}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono"
        />

        <textarea
          rows={6}
          placeholder={`Output Schema (JSON)
{
  "type": "object",
  "properties": {}
}`}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono"
        />

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
          Register Tool
        </button>

      </div>

    </Modal>
  );
}