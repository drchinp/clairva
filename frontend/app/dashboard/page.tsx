// ==============================================================
// File: app/dashboard/page.tsx
// Purpose: Dashboard Page (Clairva) - Fully Typed + Component Driven
// ==============================================================

import MetricCard from "@/components/ui/metric-card";
import Card from "@/components/ui/card";
import RecentExecutions from "@/components/executions/recent-executions";

import {
  Bot,
  Activity,
  TrendingUp,
  Target,
  Server,
  Database,
  Cpu,
} from "lucide-react";

// 🔥 TYPE (fixes TS error properly)
type Execution = {
  id: string;
  agent: string;
  agentId: string;
  task: string;
  status: "completed" | "in_progress" | "failed";
  time: string;
};

export default function DashboardPage() {

  // 🔥 Typed execution data
  const executions: Execution[] = [
    {
      id: "1",
      agent: "Document Verification",
      agentId: "A0001",
      task: "Process invoice INV-2025-089",
      status: "completed",
      time: "2 mins ago",
    },
    {
      id: "2",
      agent: "Claims Processing",
      agentId: "A0004",
      task: "Triage incoming claim CLM-892",
      status: "in_progress",
      time: "5 mins ago",
    },
    {
      id: "3",
      agent: "Reporting & Analysis",
      agentId: "A0002",
      task: "Generate Q3 financial summary",
      status: "completed",
      time: "18 mins ago",
    },
    {
      id: "4",
      agent: "Workflow Automation",
      agentId: "A0011",
      task: "Orchestrate HR onboarding flow",
      status: "completed",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="space-y-6">

      {/* ========================= */}
      {/* METRICS */}
      {/* ========================= */}
      <div className="grid grid-cols-4 gap-6">

        <MetricCard
          title="Active Agents"
          value="24"
          change="+3 from last week"
          icon={Bot}
        />

        <MetricCard
          title="Tasks Run Today"
          value="1,482"
          change="+12.5% vs yesterday"
          icon={Activity}
        />

        <MetricCard
          title="Token Consumption"
          value="4.2M"
          change="-2.1% optimization"
          positive={false}
          icon={TrendingUp}
        />

        <MetricCard
          title="Success Rate"
          value="98.4%"
          change="+0.2% from last week"
          icon={Target}
        />

      </div>

      {/* ========================= */}
      {/* MAIN GRID */}
      {/* ========================= */}
      <div className="grid grid-cols-3 gap-6">

        {/* LEFT: EXECUTIONS */}
        <div className="col-span-2">
          <RecentExecutions data={executions} />
        </div>

        {/* RIGHT: SIDE CARDS */}
        <div className="space-y-6">

          {/* ========================= */}
          {/* SYSTEM HEALTH */}
          {/* ========================= */}
          <Card title="System Health">

            <div className="space-y-4 text-sm">

              {/* OpenAI */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-800">OpenAI API</p>
                    <p className="text-xs text-gray-400">Latency: 45ms</p>
                  </div>
                </div>

                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                  Operational
                </span>
              </div>

              {/* Vector DB */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-800">Vector Database</p>
                    <p className="text-xs text-gray-400">Storage: 42%</p>
                  </div>
                </div>

                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                  Operational
                </span>
              </div>

              {/* Node */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-800">On-Prem Node</p>
                    <p className="text-xs text-gray-400">Load: 88%</p>
                  </div>
                </div>

                <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs">
                  High Load
                </span>
              </div>

            </div>

          </Card>

          {/* ========================= */}
          {/* HUMAN OVERSIGHT */}
          {/* ========================= */}
          <Card
            title="Human Oversight"
            action={
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                3 Pending
              </span>
            }
          >
            <p className="text-sm text-gray-500 mb-4">
              There are decisions requiring your manual approval before workflows can proceed.
            </p>

            <button className="w-full bg-gray-100 hover:bg-gray-200 transition text-sm py-2 rounded-md">
              Review Decisions →
            </button>

          </Card>

        </div>

      </div>

    </div>
  );
}