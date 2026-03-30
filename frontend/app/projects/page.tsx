// ==============================================================
// File: app/projects/page.tsx
// Purpose: Projects Page with TabMenu (Clairva Unified UI)
// ==============================================================

"use client";

import { useState } from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import ProjectCard from "@/components/projects/project-card";
import CreateProjectModal from "@/components/projects/create-project-modal";
import TabMenu from "@/components/ui/tab-menu";

// ✅ NEW: Strict type
type ProjectFilter = "all" | "active" | "paused" | "archived";

type Project = {
  id: string;
  title: string;
  description: string;
  status: "active" | "paused" | "attention";
  runs: number;
  lastRun: string;
};

export default function ProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<ProjectFilter>("all");

  const [openModal, setOpenModal] = useState(false);

  const projects: Project[] = [
    {
      id: "p1",
      title: "Q3 Financial Audit",
      description:
        "Automated gathering of reports using OCR and validation workflows.",
      status: "active",
      runs: 1240,
      lastRun: "2h ago",
    },
    {
      id: "p2",
      title: "Customer Onboarding Flow",
      description:
        "Orchestration of welcome emails and data extraction for sign-ups.",
      status: "active",
      runs: 8432,
      lastRun: "10m ago",
    },
    {
      id: "p3",
      title: "Vendor Risk Assessment",
      description:
        "Continuous monitoring of vendor compliance and risk frameworks.",
      status: "active",
      runs: 450,
      lastRun: "1d ago",
    },
    {
      id: "p4",
      title: "Internal Knowledge Base RAG",
      description:
        "Synchronization of internal documents for AI query assistance.",
      status: "paused",
      runs: 0,
      lastRun: "5d ago",
    },
    {
      id: "p5",
      title: "Claims Processing Pipeline",
      description:
        "End-to-end triage and verification of insurance claims.",
      status: "attention",
      runs: 3120,
      lastRun: "1h ago",
    },
  ];

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">

      {/* ========================= */}
      {/* FILTER + ACTION BAR */}
      {/* ========================= */}
      <div className="flex items-center justify-between">

        {/* ✅ LEFT: FULLY TYPED TAB MENU */}
        <TabMenu<ProjectFilter>
          tabs={[
            { key: "all", label: "All Projects" },
            { key: "active", label: "Active" },
            { key: "paused", label: "Paused" },
            { key: "archived", label: "Archived" },
          ]}
          activeTab={filter}
          onChange={setFilter} // ✅ NO CASTING NEEDED
        />

        {/* RIGHT: TOGGLE + BUTTON */}
        <div className="flex items-center gap-3">

          {/* VIEW TOGGLE */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">

            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-md transition ${
                view === "grid"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LayoutGrid size={16} />
            </button>

            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-md transition ${
                view === "list"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List size={16} />
            </button>

          </div>

          {/* CTA */}
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-[#2BB8A6] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:opacity-90 transition"
          >
            <Plus size={16} />
            Create New Project
          </button>

        </div>

      </div>

      {/* ========================= */}
      {/* PROJECT GRID / LIST */}
      {/* ========================= */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            status={project.status}
            runs={project.runs}
            lastRun={project.lastRun}

            onEdit={() => console.log("Edit", project.id)}
            onDuplicate={() => console.log("Duplicate", project.id)}
            onPause={() => console.log("Pause", project.id)}
            onDelete={() => console.log("Delete", project.id)}
          />
        ))}
      </div>

      {/* MODAL */}
      <CreateProjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />

    </div>
  );
}