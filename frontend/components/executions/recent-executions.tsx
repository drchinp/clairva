// ==============================================================
// File: frontend/components/executions/recent-executions.tsx
// Purpose: Recent Agent Executions (Using TransactionTable)
// ==============================================================

"use client";

import TransactionTable from "@/components/ui/transaction-table";

import {
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

// ================= TYPES =================
export interface Execution {
  id: string;
  agent: string;
  agentId: string;
  task: string;
  status: "completed" | "in_progress" | "failed";
  time: string;

  [key: string]: unknown;
}

// ================= STATUS CONFIG =================
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

// ================= COMPONENT =================
export default function RecentExecutions({
  data,
}: {
  data: Execution[];
}) {
  return (
    <TransactionTable
      title="Recent Agent Executions"

      action={
        <button className="text-sm text-[#2BB8A6] hover:underline">
          View all logs
        </button>
      }

      columns={[
        { key: "agent", label: "Agent" },
        { key: "task", label: "Task Description" },
        { key: "status", label: "Status" },
        { key: "time", label: "Time" },
      ]}

      data={data.map((item) => {
        const s = STATUS[item.status];
        const Icon = s.icon;

        return {
          id: item.id,

          cells: [

            // ================= AGENT =================
            <div
              key={`${item.id}-agent`}
              className="flex items-center gap-3 min-w-[200px]"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold">
                {item.agentId}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.agent}
                </p>
                <p className="text-xs text-gray-400">
                  {item.agentId}
                </p>
              </div>
            </div>,

            // ================= TASK =================
            <div
              key={`${item.id}-task`}
              className="text-sm text-gray-600 truncate pr-6"
            >
              {item.task}
            </div>,

            // ================= STATUS =================
            <span
              key={`${item.id}-status`}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full whitespace-nowrap ${s.style}`}
            >
              <Icon size={12} />
              {s.label}
            </span>,

            // ================= TIME =================
            <div
              key={`${item.id}-time`}
              className="text-sm text-gray-500 whitespace-nowrap"
            >
              {item.time}
            </div>,
          ],

          actions: [
            {
              label: "View Logs",
              onClick: () => console.log("View logs", item.id),
            },
            {
              label: "Pause",
              onClick: () => console.log("Pause", item.id),
            },
            {
              label: "Delete",
              onClick: () => console.log("Delete", item.id),
              danger: true,
            },
          ],
        };
      })}

      onRowClick={(id) => {
        console.log("OPEN EXECUTION:", id);
      }}
    />
  );
}