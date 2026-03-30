// ==============================================================
// File: components/ui/modal-section.tsx
// Purpose: Section layout inside modal (Clairva UI)
// ==============================================================

import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function ModalSection({ title, children }: Props) {
  return (
    <div className="mb-6">

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        {title}
      </h3>

      {/* Content */}
      <div className="space-y-3">
        {children}
      </div>

    </div>
  );
}