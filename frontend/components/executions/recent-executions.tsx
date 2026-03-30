// ==============================================================
// File: frontend/components/executions/recent-executions.tsx
// Purpose: Premium Recent Agent Executions Table (Clairva - Final Clean)
// ==============================================================

"use client";

import DataTable from "@/components/ui/data-table";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Pause,
  Trash,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// =========================
// TYPES
// =========================
export interface Execution {
  id: string;
  agent: string;
  agentId: string;
  task: string;
  status: "completed" | "in_progress" | "failed";
  time: string;

  // ✅ required for DataTable generic compatibility
  [key: string]: unknown;
}

// =========================
// STATUS CONFIG
// =========================
const STATUS: Record<
  Execution["status"],
  {
    label: string;
    style: string;
    icon: LucideIcon;
  }
> = {
  completed: {
    label: "Completed",
    style: "bg-green-100 text-green-600",
    icon: CheckCircle,
  },
  in_progress: {
    label: "In Progress",
    style: "bg-orange-100 text-orange-600",
    icon: Clock,
  },
  failed: {
    label: "Failed",
    style: "bg-red-100 text-red-600",
    icon: AlertCircle,
  },
};

// =========================
// COMPONENT
// =========================
export default function RecentExecutions({
  data,
}: {
  data: Execution[];
}) {
  return (
    <DataTable<Execution>
      title="Recent Agent Executions"

      action={
        <button className="text-sm text-[#2BB8A6] hover:underline">
          View all logs
        </button>
      }

      columns={[
        { key: "agent", label: "Agent", sortable: true },
        { key: "task", label: "Task Description", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "time", label: "Time", sortable: true },
      ]}

      data={data}

      getRowId={(item) => item.id}

      // =========================
      // BULK ACTIONS
      // =========================
      bulkActions={(selected) => (
        <div className="flex items-center gap-3">

          <button
            onClick={() => console.log("Pause selected:", selected)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <Pause size={14} /> Pause
          </button>

          <button
            onClick={() => console.log("Delete selected:", selected)}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
          >
            <Trash size={14} /> Delete
          </button>

        </div>
      )}

      // =========================
      // ROW CLICK
      // =========================
      onRowClick={(item) => {
        console.log("OPEN EXECUTION:", item.id);
      }}

      // =========================
      // ROW RENDERER
      // =========================
      renderRow={(item) => {
          const s = STATUS[item.status];
          const Icon = s.icon;

          return [

            // AGENT
            <div key={`${item.id}-agent`} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold">
                {item.agentId}
              </div>
              <div>
                <p className="text-sm font-medium">{item.agent}</p>
                <p className="text-xs text-gray-400">{item.agentId}</p>
              </div>
            </div>,

            // TASK
            <div key={`${item.id}-task`} className="text-sm text-gray-600">
              {item.task}
            </div>,

            // STATUS
            <span
              key={`${item.id}-status`}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${s.style}`}
            >
              <Icon size={12} />
              {s.label}
            </span>,

            // TIME
            <div key={`${item.id}-time`} className="text-sm text-gray-500">
              {item.time}
            </div>,
          ];
        }}
    />
  );
}