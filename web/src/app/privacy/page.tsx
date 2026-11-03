"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Database, ArrowLeft, Mail, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Privacy Policy & Data Protection Charter</h1>
                <Badge className="bg-emerald-600 text-white text-[10px]">DPDP Act 2023 Compliant</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Last updated: October 2026 • Kaizentrix Global Solutions Private Limited
              </p>
            </div>
          </div>
        </div>

        {/* Highlight Card: Data Residency */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold">100% Sovereign Indian Data Residency</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In compliance with the Digital Personal Data Protection (DPDP) Act 2023 and National Health Authority (NHA) ABDM guidelines, all electronic health records, video streams, audio recordings, and patient demographics are hosted exclusively within MeitY-empaneled Tier-IV data centers located in **Central India (Pune & Mumbai)**. No health data ever leaves Indian jurisdiction.
          </p>
        </div>

        {/* Main Content Sections */}
        <Card className="p-8 border-slate-200 space-y-8 text-xs text-slate-700 leading-relaxed">
          
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              1. Principles of Personal Data Processing
            </h3>
            <p>
              Kaizentrix processes personal and sensitive health data solely for providing lawful teleconsultations, issuing verifiable digital prescriptions, facilitating diagnostic bookings, and maintaining patient health vaults. We do not sell, license, or monetize patient health data or personal identifiers under any circumstances.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              2. Data Principal Statutory Rights (DPDP Act 2023)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Right to Access & Summary
                </span>
                <span className="text-[11px] text-slate-600">You may inspect and export all your medical consultations and uploaded documents in standard PDF/JSON format at any time.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Right to Correction & Erasure
                </span>
                <span className="text-[11px] text-slate-600">You may request rectification of inaccurate profile data or permanent erasure of non-statutory medical records.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Right to Grievance Redressal
                </span>
                <span className="text-[11px] text-slate-600">Our designated Data Protection Officer resolves privacy concerns within a statutory 72-hour turnaround window.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Right to Nominate
                </span>
                <span className="text-[11px] text-slate-600">In the event of medical incapacitation or death, you can designate a legal nominee to manage your health vault.</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              3. Teleconsultation Audio & Video Recording
            </h3>
            <p>
              In accordance with MoHFW Telemedicine Practice Guidelines (2020), video encounters are encrypted end-to-end using WebRTC DTLS/SRTP (AES-256). Consultation recordings are only stored when explicit dual-consent is recorded from both the consulting doctor and the patient prior to starting the call.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              4. Data Protection Officer (DPO) Contact
            </h3>
            <p>For any inquiries regarding personal health data handling or DPDP rights exercise, reach our office at:</p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
              <p><strong>Grievance Officer:</strong> Anand Deshmukh, Chief Privacy Officer</p>
              <p><strong>Email:</strong> privacy@kaizentrix.com</p>
              <p><strong>Postal Address:</strong> Kaizentrix Global Solutions Pvt Ltd, Level 6, Tech Park, Indiranagar, Bengaluru, KA 560038</p>
              <p><strong>Response SLA:</strong> Within 72 statutory hours</p>
            </div>
          </section>

        </Card>

      </div>
    </div>
  );
}

