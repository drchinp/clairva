// ==============================================================
// File: components/ui/tab-menu.tsx
// Purpose: Reusable Tab Menu (Clairva Design System - Typed)
// ==============================================================

"use client";

type Tab<T extends string> = {
  key: T;
  label: string;
};

interface Props<T extends string> {
  tabs: Tab<T>[];
  activeTab: T;
  onChange: (key: T) => void;
}

export default function TabMenu<T extends string>({
  tabs,
  activeTab,
  onChange,
}: Props<T>) {
  return (
    <div className="flex items-center gap-6 border-b border-gray-200 text-sm">

      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`pb-3 transition ${
            activeTab === tab.key
              ? "text-[#2BB8A6] border-b-2 border-[#2BB8A6] font-medium"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {tab.label}
        </button>
      ))}

    </div>
  );
}