// ==============================================================
// File: app/layout.tsx
// Purpose: Layout with fixed sidebar + header + footer
// ==============================================================

import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT AREA */}
        <div className="ml-[240px] min-h-screen flex flex-col">

          {/* HEADER */}
          <Header />

          {/* PAGE CONTENT */}
          <main className="flex-1 p-6 bg-gray-50">
            {children}
          </main>

          {/* FOOTER */}
          <Footer />

        </div>

      </body>
    </html>
  );
}