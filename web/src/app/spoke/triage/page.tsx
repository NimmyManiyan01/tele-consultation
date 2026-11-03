"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Activity, 
  Stethoscope, 
  Video, 
  Bluetooth, 
  UserPlus, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Printer, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  HeartPulse,
  Thermometer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_SPOKE_CASES } from "@/data/mock-store";
import { SpokePatientCase } from "@/types";
import { kgsApi } from "@/lib/api-client";

export default function SpokeTriagePage() {
  const [cases, setCases] = useState<SpokePatientCase[]>(MOCK_SPOKE_CASES);
  const [selectedCase, setSelectedCase] = useState<SpokePatientCase>(MOCK_SPOKE_CASES[0]);
  const [isBluetoothSyncing, setIsBluetoothSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [showReferralVoucher, setShowReferralVoucher] = useState<boolean>(false);

  React.useEffect(() => {
    kgsApi.auxiliary.getSpokeCases().then((backendCases: any[]) => {
      if (backendCases && backendCases.length > 0) {
        const mapped = backendCases.map(c => ({
          id: c.id,
          patientName: c.patient_name,
          age: c.age,
          gender: c.gender,
          villageName: c.village_name,
          choName: c.cho_name,
          bp: c.bp,
          pulse: c.pulse,
          spO2: c.spo2,
          bloodSugar: c.blood_sugar,
          chiefComplaint: c.chief_complaint,
          triagePriority: c.triage_priority,
          assignedHubDoctor: c.assigned_hub_doctor,
          status: c.status,
          registeredAt: c.registered_at
        }));
        setCases(mapped);
        setSelectedCase(mapped[0]);
      }
    }).catch(() => {});
  }, []);

  // Vitals form state for selected case
  const [currentBp, setCurrentBp] = useState<string>(selectedCase.bp);
  const [currentPulse, setCurrentPulse] = useState<number>(selectedCase.pulse);
  const [currentSpO2, setCurrentSpO2] = useState<number>(selectedCase.spO2);
  const [currentSugar, setCurrentSugar] = useState<number>(selectedCase.bloodSugar);

  const handleSelectCase = (c: SpokePatientCase) => {
    setSelectedCase(c);
    setCurrentBp(c.bp);
    setCurrentPulse(c.pulse);
    setCurrentSpO2(c.spO2);
    setCurrentSugar(c.bloodSugar);
    setShowReferralVoucher(false);
  };

  const syncBluetoothHardware = () => {
    setIsBluetoothSyncing(true);
    setTimeout(() => {
      setIsBluetoothSyncing(false);
      setCurrentBp("154/94 mmHg");
      setCurrentPulse(80);
      setCurrentSpO2(96);
      setCurrentSugar(218);
      setSyncNotice("Hardware Synced: Bluetooth Omron BP & Accu-Chek Verified");
      setTimeout(() => setSyncNotice(null), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Spoke Workstation Header */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-900/60 border border-teal-500/40 text-teal-300 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight">Ayushman Arogya Mandir • Tele-Triage Spoke</h1>
                <Badge className="bg-emerald-600 text-white text-[10px]">eSanjeevani AB-HWC</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Spoke ID: <span className="font-mono text-teal-400 font-bold">KA-BLR-SPK-014</span> • Byramangala Grama, Channapatna • Operator: CHO Kavitha R. (B.Sc Nursing)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/doctor/dashboard">
              <Button variant="outline" size="sm" className="text-xs bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800">
                Doctor Practice Portal
              </Button>
            </Link>
            <Link href="/room/tele-demo-smart-01">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold">
                <Video className="w-3.5 h-3.5 mr-1.5" /> Call District Hub Doctor
              </Button>
            </Link>
          </div>
        </div>

        {/* 2-Column Workstation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Col: Live Spoke Patient Queue */}
          <div className="space-y-4">
            <Card className="bg-slate-800/80 border-slate-700 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-400" /> Rural Spoke Queue ({cases.length})
                </h2>
                <Badge variant="outline" className="text-[10px] text-teal-400 border-teal-500/40">
                  Live OPD Token
                </Badge>
              </div>

              <div className="space-y-2">
                {cases.map((c) => {
                  const isSelected = selectedCase.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectCase(c)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-teal-950/70 border-teal-500 text-white shadow-md" 
                          : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-sm text-white">{c.patientName}</p>
                          <p className="text-[11px] text-slate-400">{c.gender}, {c.age} yrs • {c.villageName}</p>
                        </div>
                        <Badge className={`text-[10px] py-0 px-1.5 font-bold ${
                          c.triagePriority === "URGENT" ? "bg-rose-600 text-white" :
                          c.triagePriority === "ROUTINE" ? "bg-blue-600 text-white" :
                          "bg-slate-700 text-slate-200"
                        }`}>
                          {c.triagePriority}
                        </Badge>
                      </div>

                      <div className="mt-2.5 flex items-center gap-3 text-[11px] font-mono text-slate-400">
                        <span>BP: <strong className="text-amber-300">{c.bp}</strong></span>
                        <span>SpO2: <strong className="text-teal-300">{c.spO2}%</strong></span>
                        <span>Sugar: <strong className="text-rose-300">{c.bloodSugar}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="w-full py-2 bg-slate-900 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-xs text-slate-300 font-semibold flex items-center justify-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" /> Register New Spoke Walk-In
              </button>
            </Card>
          </div>

          {/* Right 2 Cols: Clinical Triage & Tele-Consultation Console */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Selected Case Triage Card */}
            <Card className="bg-slate-800/80 border-slate-700 p-5 space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedCase.patientName}</h2>
                    <Badge variant="outline" className="border-teal-500/40 text-teal-300 text-[10px]">
                      Case ID: {selectedCase.id}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedCase.age} yrs • {selectedCase.villageName} • Attending: {selectedCase.choName}
                  </p>
                </div>

                {/* Bluetooth Device Sync CTA */}
                <button
                  onClick={syncBluetoothHardware}
                  disabled={isBluetoothSyncing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-900/40 hover:bg-teal-900/70 border border-teal-500/50 text-teal-300 text-xs font-semibold transition-colors"
                >
                  <Bluetooth className={`w-3.5 h-3.5 text-teal-400 ${isBluetoothSyncing ? "animate-pulse" : ""}`} />
                  <span>{isBluetoothSyncing ? "Reading Sensors..." : "Sync Bluetooth Sensors"}</span>
                </button>
              </div>

              {syncNotice && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-700/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{syncNotice}</span>
                </div>
              )}

              {/* Vitals Live Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Frontline Vitals & Diagnostic Screening
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                      <HeartPulse className="w-3.5 h-3.5 text-amber-400" /> Blood Pressure
                    </span>
                    <input 
                      value={currentBp} 
                      onChange={(e) => setCurrentBp(e.target.value)} 
                      className="w-full bg-transparent font-mono font-bold text-sm text-amber-300 focus:outline-none"
                    />
                    <span className="text-[10px] text-amber-400/80 font-medium">Stage 2 Hypertension</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" /> Pulse (bpm)
                    </span>
                    <input 
                      type="number" 
                      value={currentPulse} 
                      onChange={(e) => setCurrentPulse(parseInt(e.target.value))} 
                      className="w-full bg-transparent font-mono font-bold text-sm text-emerald-400 focus:outline-none"
                    />
                    <span className="text-[10px] text-emerald-400/80 font-medium">Normal Sinus</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-teal-400" /> SpO2 (%)
                    </span>
                    <input 
                      type="number" 
                      value={currentSpO2} 
                      onChange={(e) => setCurrentSpO2(parseInt(e.target.value))} 
                      className="w-full bg-transparent font-mono font-bold text-sm text-teal-300 focus:outline-none"
                    />
                    <span className="text-[10px] text-teal-400/80 font-medium">Room Air Oxygen</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Random Sugar
                    </span>
                    <input 
                      type="number" 
                      value={currentSugar} 
                      onChange={(e) => setCurrentSugar(parseInt(e.target.value))} 
                      className="w-full bg-transparent font-mono font-bold text-sm text-rose-400 focus:outline-none"
                    />
                    <span className="text-[10px] text-rose-400/80 font-medium">Elevated Glycemia</span>
                  </div>
                </div>
              </div>

              {/* Chief Complaint & Clinical Notes in Regional Language */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  CHO Patient Presentation & Chief Complaint
                </label>
                <textarea 
                  rows={3}
                  value={selectedCase.chiefComplaint}
                  readOnly
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-3 focus:outline-none"
                />
              </div>

              {/* Action Buttons: Tele-Connect or Generate Voucher */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <Link href="/room/tele-demo-smart-01">
                    <Button className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold">
                      <Video className="w-3.5 h-3.5 mr-1.5" /> Start eSanjeevani Tele-Call
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReferralVoucher(!showReferralVoucher)}
                    className="text-xs bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5" /> Generate Dispensary Voucher
                  </Button>
                </div>

                <Badge variant="outline" className="text-[11px] text-slate-400 border-slate-700">
                  Assigned: {selectedCase.assignedHubDoctor || "District Hospital Hub"}
                </Badge>
              </div>

              {/* Dispensary Voucher Sub-Card */}
              {showReferralVoucher && (
                <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Govt Sub-Centre Essential Drug Dispensary Voucher
                      </h3>
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="text-xs text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Slip
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                    <p>Patient: <strong className="text-white">{selectedCase.patientName}</strong> ({selectedCase.age}y / {selectedCase.gender})</p>
                    <p>Sub-Centre: Byramangala AB-HWC (Channapatna Taluk, Ramanagara)</p>
                    <p>Vitals: BP {currentBp} • Pulse {currentPulse} • Sugar {currentSugar} mg/dL</p>
                    <p>Approved Dispensation: <strong>Tab. Telmisartan 40mg (1-0-0) x 30 Days</strong> (Free under NHM Essential Drug List)</p>
                  </div>
                </div>
              )}

            </Card>

          </div>

        </div>

      </div>
    </div>
  );
}

