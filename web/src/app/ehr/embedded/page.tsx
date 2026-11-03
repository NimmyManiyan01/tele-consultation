"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Video, 
  ShieldCheck, 
  RefreshCw, 
  Database, 
  Cpu, 
  ArrowRight,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_FHIR_CONTEXT } from "@/data/mock-store";

export default function EmbeddedEHRPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [smartTokenVerified, setSmartTokenVerified] = useState(true);

  const triggerFHIRSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Hospital EHR Simulated Top Bar */}
      <header className="h-12 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-xs tracking-wide text-slate-200">
              Apollo Hospitals Indraprastha • SmartEHR™ Clinical Workstation (R4)
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] bg-slate-900 text-slate-400 border-slate-700">
            SMART-on-FHIR Container v24.2
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">Practitioner: <strong className="text-slate-200">Dr. Priya Sharma (KMC-48291)</strong></span>
          <div className="h-3 w-px bg-slate-800" />
          <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> FHIR R4 Bridge Connected
          </span>
        </div>
      </header>

      {/* FHIR Patient Context Banner */}
      <div className="bg-slate-800/80 border-b border-slate-700/80 px-4 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-teal-900/60 border border-teal-500/40 text-teal-300 flex items-center justify-center font-bold text-sm">
              RV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white">{MOCK_FHIR_CONTEXT.fullName}</span>
                <span className="text-slate-400 font-mono">MRN: {MOCK_FHIR_CONTEXT.mrn}</span>
                <Badge className="bg-slate-700 text-slate-300 text-[10px]">{MOCK_FHIR_CONTEXT.gender}</Badge>
              </div>
              <p className="text-[11px] text-slate-400">{MOCK_FHIR_CONTEXT.birthDate}</p>
            </div>
          </div>

          {/* Vitals Ribbon */}
          <div className="flex items-center gap-4 bg-slate-900/70 px-3 py-1.5 rounded-lg border border-slate-700/60 text-[11px]">
            <div>
              <span className="text-slate-500 block">BP:</span>
              <span className="font-mono font-bold text-amber-300">{MOCK_FHIR_CONTEXT.recentVitals.bp}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block">Pulse:</span>
              <span className="font-mono font-bold text-emerald-400">{MOCK_FHIR_CONTEXT.recentVitals.pulse}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block">SpO2:</span>
              <span className="font-mono font-bold text-teal-300">{MOCK_FHIR_CONTEXT.recentVitals.spO2}</span>
            </div>
          </div>

          {/* Allergies Warning */}
          <div className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-800/60 px-3 py-1.5 rounded-lg text-rose-300 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold">Allergies:</span>
            <span>{MOCK_FHIR_CONTEXT.allergies.join(", ")}</span>
          </div>
        </div>
      </div>

      {/* Main Container: Embedded Kaizentrix SMART App */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
        
        {/* CDS Hooks Advisory Card */}
        <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-900 border border-teal-500/40 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-teal-600 text-white text-[10px]">CDS Hooks v1.0 Triggered</Badge>
                <span className="text-xs font-mono text-teal-400">patient-view hook</span>
              </div>
              <h2 className="text-sm font-bold text-white mt-1">
                Clinical Teleconsultation Follow-up Recommended
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Patient has recorded elevated BP (138/88 mmHg) across 2 consecutive readings. Eligible for scheduled or instant tele-cardiology review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/room/tele-demo-smart-01">
              <Button className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold">
                <Video className="w-3.5 h-3.5 mr-1.5" /> Launch Kaizentrix Tele-Room
              </Button>
            </Link>
          </div>
        </div>

        {/* Embedded Teleconsultation Bridge Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Live Telehealth Console */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-slate-800/80 border-slate-700 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Kaizentrix Embedded Telehealth Session</h3>
                </div>
                <Badge variant="outline" className="text-[10px] text-teal-400 border-teal-500/40">
                  SMART OAuth2 Handshake Active
                </Badge>
              </div>

              {/* Video Preview Frame */}
              <div className="aspect-video bg-slate-950 rounded-xl border border-slate-700 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 mx-auto flex items-center justify-center">
                    <Video className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Teleconsultation Standby</p>
                    <p className="text-xs text-slate-400 mt-0.5">Patient Rahul Varma is checked in and waiting in the virtual room.</p>
                  </div>
                  <Link href="/room/tele-demo-smart-01">
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-500 text-xs">
                      Enter Consultation Room <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md">
                  <span>Camera: HD Pro Webcam</span> • <span>Mic: Built-in Array</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={triggerFHIRSync}
                    disabled={isSyncing}
                    className="text-xs bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? "animate-spin text-teal-400" : ""}`} />
                    {isSyncing ? "Syncing with EHR..." : "Commit SOAP Note to Hospital EHR"}
                  </Button>
                  {syncSuccess && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> FHIR R4 Bundle Committed!
                    </span>
                  )}
                </div>

                <Link href="/doctor/emr/pat-01">
                  <Button variant="outline" size="sm" className="text-xs bg-slate-900 border-slate-700 text-teal-400 hover:bg-slate-800">
                    <FileText className="w-3.5 h-3.5 mr-1.5" /> Full EMR Console
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Right Col: FHIR Launch Context & Security Ledger */}
          <div className="space-y-4">
            <Card className="bg-slate-800/80 border-slate-700 p-5 space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
                <Database className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-white">SMART-on-FHIR Launch Context</h3>
              </div>

              <div className="space-y-2.5 font-mono text-[11px]">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">FHIR Service Base URL:</span>
                  <span className="text-teal-300 break-all">https://fhir.apollohospitals.com/r4</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">Launch Context Patient ID:</span>
                  <span className="text-amber-300 font-bold">{MOCK_FHIR_CONTEXT.id}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">Granted OAuth Scopes:</span>
                  <span className="text-slate-300">patient/Patient.read patient/Encounter.write patient/Condition.read</span>
                </div>
              </div>

              <div className="bg-teal-950/40 border border-teal-800/50 rounded-lg p-3 text-teal-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Interoperability Standard
                </p>
                <p className="text-[10px] text-teal-300/80 leading-relaxed">
                  Conforms with HL7® FHIR® Release 4 and US Core / ABDM Indian Core data standards for bidirectional encounter exchange.
                </p>
              </div>
            </Card>
          </div>

        </div>

      </main>

    </div>
  );
}

