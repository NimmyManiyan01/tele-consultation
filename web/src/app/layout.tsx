import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmergencyWarningStrip } from "@/components/ui/emergency-banner";

export const metadata: Metadata = {
  title: "Kaizentrix — Enterprise Teleconsultation Platform",
  description: "Secure, standards-compliant healthcare platform providing verified doctor discovery, HD video teleconsultations, structured EMR charting, and legally valid e-prescriptions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-brand-blue-100 selection:text-brand-blue-900">
        <EmergencyWarningStrip />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

