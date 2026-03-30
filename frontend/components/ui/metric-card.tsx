// ==============================================================
// File: frontend/components/ui/metric-card.tsx
// Purpose: Reusable KPI Metric Card
// ==============================================================

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: LucideIcon;
}

export default function MetricCard({
  title,
  value,
  change,
  positive = true,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">

      {/* Top */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon size={18} className="text-gray-400" />
      </div>

      {/* Value */}
      <h2 className="text-3xl font-semibold text-gray-900 mb-2">
        {value}
      </h2>

      {/* Change */}
      <p
        className={`text-sm ${
          positive ? "text-green-600" : "text-red-500"
        }`}
      >
        {change}
      </p>
    </div>
  );
}