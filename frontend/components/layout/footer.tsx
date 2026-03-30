// ==============================================================
// File: frontend/components/layout/footer.tsx
// Purpose: Global Footer (Clairva)
// ==============================================================

export default function Footer() {
  return (
    <footer className="mt-12 px-6 py-6 text-xs text-gray-400 flex items-center justify-between border-t border-gray-100 bg-white/70 backdrop-blur-sm">

      {/* LEFT */}
      <div>
        CLAIRVA © 2026 Clairvoyant Lab
      </div>

      {/* RIGHT */}
      <div className="text-right">
         ClairVA is fully owned by Gen-AI Bot Pte. Ltd.
      </div>

    </footer>
  );
}