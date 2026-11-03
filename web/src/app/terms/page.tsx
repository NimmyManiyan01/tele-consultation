"use client";

import React from "react";
import Link from "next/link";
import { FileText, ShieldAlert, ArrowLeft, CheckCircle2, AlertTriangle, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TermsOfServicePage() {
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
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Terms of Service & Telemedicine Consent</h1>
                <Badge className="bg-teal-700 text-white text-[10px]">MoHFW 2020 Guidelines</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Effective date: October 2026 • Governing Telemedicine Encounters in India
              </p>
            </div>
          </div>
        </div>

        {/* Highlight Card: Emergency Exclusion */}
        <div className="bg-rose-950 text-white p-6 rounded-2xl shadow-md space-y-3 border border-rose-800">
          <div className="flex items-center gap-2 text-rose-300">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold text-white">Emergency Medical Care Exclusion</h2>
          </div>
          <p className="text-xs text-rose-200 leading-relaxed">
            Kaizentrix teleconsultation services are explicitly not designed or equipped for acute, life-threatening medical emergencies. If you or someone you are assisting is experiencing severe chest pain, loss of consciousness, uncontrolled bleeding, or breathing difficulty, immediately dial **112** or transport the patient to the nearest hospital emergency department.
          </p>
        </div>

        {/* Content Body */}
        <Card className="p-8 border-slate-200 space-y-8 text-xs text-slate-700 leading-relaxed">
          
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              1. Platform Nature & Practitioner Relationship
            </h3>
            <p>
              Kaizentrix operates as an enterprise digital technology intermediary connecting patients with independent, licensed Registered Medical Practitioners (RMPs) registered with State Medical Councils or the National Medical Commission (NMC). The medical advice, diagnosis, and prescription provided during an encounter are the sole professional responsibility of the attending practitioner.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              2. MoHFW Telemedicine Drug Schedules
            </h3>
            <p>
              In accordance with the Telemedicine Practice Guidelines issued by the Ministry of Health and Family Welfare (MoHFW) and NITI Aayog:
            </p>
            <div className="space-y-2 pt-1">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-emerald-800 block">List O (Over-The-Counter Drugs)</span>
                <span className="text-[11px] text-slate-600">Paracetamol, ORS packets, antacids, and cough drops may be prescribed via any teleconsultation mode.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-teal-800 block">List A (First Consult Video Allowed)</span>
                <span className="text-[11px] text-slate-600">Standard antibiotics, antihypertensives, and anti-diabetic agents may be prescribed strictly via video consultation.</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                <span className="font-bold text-rose-900 block flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Schedule X Prohibition (Narcotics & Psychotropics)
                </span>
                <span className="text-[11px] text-rose-800 font-medium">Under no circumstances may Schedule X drugs (including Morphine, Ketamine, Clonazepam, and Buprenorphine) be prescribed via teleconsultation. The platform strictly enforces software locks against these medications.</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              3. Patient Accuracy Undertaking
            </h3>
            <p>
              The patient undertakes that all information provided during clinical intake, including medical history, existing prescriptions, drug allergies, and symptoms, is accurate to the best of their knowledge. Deliberately withholding medical facts may compromise clinical judgment and void the consultation warranty.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              4. Digital Signature & Prescription Validity
            </h3>
            <p>
              Prescriptions issued through Kaizentrix are digitally signed with cryptographic SHA-256 hashes and QR verification codes compliant with the Information Technology Act (2000) and the Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations. They are legally valid across all licensed retail and online pharmacies throughout India.
            </p>
          </section>

        </Card>

      </div>
    </div>
  );
}

