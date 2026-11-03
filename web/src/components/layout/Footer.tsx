import React from "react";
import Link from "next/link";
import { Shield, Lock, FileText, AlertCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-slate-900 text-slate-300 text-sm">
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Corporate Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-blue-600 text-white font-bold text-xs">
                KGS
              </div>
              <span className="font-heading font-bold text-white tracking-wide">
                KAIZENTRIX
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kaizentrix Global Solutions Private Limited. Continuous Innovation, Global Impact. Enterprise digital healthcare infrastructure delivering secure, standards-compliant teleconsultations.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-green-400 font-medium">
              <Shield className="h-4 w-4" />
              <span>DPDP Act 2023 & MoHFW 2020 Compliant</span>
            </div>
          </div>

          {/* Clinical Portals */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Clinical Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/doctors" className="hover:text-white transition-colors">
                  Doctor Directory
                </Link>
              </li>
              <li>
                <Link href="/consult/instant" className="hover:text-white transition-colors">
                  Instant Acute Teleconsult
                </Link>
              </li>
              <li>
                <Link href="/doctor/dashboard" className="hover:text-white transition-colors">
                  Doctor Practice Portal (RMP)
                </Link>
              </li>
              <li>
                <Link href="/clinic/reception" className="hover:text-white transition-colors">
                  Front Desk & Triage Reception
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="hover:text-white transition-colors">
                  Platform Surveillance & SLOs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Governance & Privacy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Privacy Notice & DPDP Rights</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>Telemedicine Consent Terms</span>
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="hover:text-white transition-colors flex items-center gap-1.5 text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Emergency Care Guidance</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Advisory */}
          <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-red-400">
              <AlertCircle className="h-4 w-4" />
              Emergency Advisory
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Teleconsultation services are designed strictly for non-emergent medical assessments and routine outpatient follow-ups. If you are experiencing acute emergencies (chest discomfort, stroke symptoms, respiratory distress), call <strong className="text-white">112</strong> immediately.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Kaizentrix Global Solutions Private Limited. All rights reserved.</p>
          <p>ISO 27001 & SOC 2 Type II Aligned Security Architecture • Hosted on Sovereign Azure Central India</p>
        </div>
      </div>
    </footer>
  );
}

