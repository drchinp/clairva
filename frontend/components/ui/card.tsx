
// ==============================================================
// File: frontend/components/ui/card.tsx
// Purpose: Standard Card Component (Clairva UI System - Premium)
// ==============================================================

export default function Card({
  title,
  action,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] transition hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">

      {/* HEADER */}
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          {title && (
            <h3 className="text-sm font-semibold text-gray-800 tracking-tight">
              {title}
            </h3>
          )}
          {action}
        </div>
      )}

      {/* CONTENT */}
      <div className="p-5">
        {children}
      </div>

    </div>
  );
}