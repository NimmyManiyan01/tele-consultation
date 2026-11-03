"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  FileText, 
  Activity, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldAlert, 
  Lock, 
  ArrowLeft,
  Sparkles,
  Search,
  Calendar,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_DEPENDENTS, MOCK_CLINICIANS } from "@/data/mock-store";
import { PrescribedMedicine } from "@/types";

export default function ClinicalEMRChartingPage() {
  const params = useParams();
  const router = useRouter();
  const patient = MOCK_DEPENDENTS[0];
  const doctor = MOCK_CLINICIANS[0];

  // SOAP Documentation State
  const [subjective, setSubjective] = useState("Patient reports exertional breathlessness over past 10 days, accompanied by morning headaches. Reports home BP recordings hovering around 145/92 mmHg. No chest pain, syncope, or orthopnea.");
  const [objective, setObjective] = useState("Physical Examination: Conscious, alert, oriented. Vitals: BP 145/92 mmHg (Right arm, sitting), Pulse 76 bpm regular, SpO2 98% on room air, Chest clear, Bilateral air entry equal, S1 S2 heard normal, no murmurs. No pedal edema.");
  const [assessment, setAssessment] = useState("Essential (primary) hypertension (ICD-10: I10), Hyperlipidemia (ICD-10: E78.5)");
  const [plan, setPlan] = useState("Initiate ACE inhibitor / ARB therapy. Low sodium DASH diet. Repeat lipid profile in 4 weeks. Maintain daily home BP log.");

  // Prescribed Medicines State
  const [medicines, setMedicines] = useState<PrescribedMedicine[]>([
    {
      id: "med-01",
      drugName: "Telma 40",
      genericName: "Telmisartan",
      dosageForm: "Tablet",
      strength: "40 mg",
      dosagePattern: "1-0-0",
      timing: "BEFORE_FOOD",
      durationDays: 30,
      instructions: "Take once daily in the morning.",
      schedule: "LIST_A",
    },
    {
      id: "med-02",
      drugName: "Atorva 10",
      genericName: "Atorvastatin Calcium",
      dosageForm: "Tablet",
      strength: "10 mg",
      dosagePattern: "0-0-1",
      timing: "AFTER_FOOD",
      durationDays: 30,
      instructions: "Take at bedtime.",
      schedule: "LIST_A",
    }
  ]);

  // Drug Entry Form State
  const [newDrugName, setNewDrugName] = useState("");
  const [newDrugStrength, setNewDrugStrength] = useState("500 mg");
  const [newDrugPattern, setNewDrugPattern] = useState<"1-0-1" | "1-0-0" | "0-0-1">("1-0-1");
  const [newDrugTiming, setNewDrugTiming] = useState<"BEFORE_FOOD" | "AFTER_FOOD">("AFTER_FOOD");
  const [newDrugDays, setNewDrugDays] = useState(5);

  // Modals & Safety Triggers
  const [scheduleXModalOpen, setScheduleXModalOpen] = useState(false);
  const [prohibitedDrugName, setProhibitedDrugName] = useState("");
  const [signPinModalOpen, setSignPinModalOpen] = useState(false);
  const [signingPin, setSigningPin] = useState("");
  const [isSigning, setIsSigning] = useState(false);

  // Add drug with Schedule X check
  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrugName.trim()) return;

    // MoHFW Schedule X Narcotics Intercept Rule Engine (TRM-GAP-002)
    const scheduleXBanned = ["morphine", "clonazepam", "alprazolam", "diazepam", "fentanyl", "codeine", "ketamine", "lorazepam"];
    const isBanned = scheduleXBanned.some(banned => newDrugName.toLowerCase().includes(banned));

    if (isBanned) {
      setProhibitedDrugName(newDrugName);
      setScheduleXModalOpen(true);
      return;
    }

    const newMed: PrescribedMedicine = {
      id: `med-${Date.now()}`,
      drugName: newDrugName,
      genericName: newDrugName,
      dosageForm: "Tablet",
      strength: newDrugStrength,
      dosagePattern: newDrugPattern,
      timing: newDrugTiming,
      durationDays: newDrugDays,
      instructions: "As directed.",
      schedule: "LIST_A",
    };

    setMedicines(prev => [...prev, newMed]);
    setNewDrugName("");
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const handleApplyMacro = (type: "HTN" | "URTI" | "DM") => {
    if (type === "HTN") {
      setAssessment("Essential primary hypertension (ICD-10: I10)");
      setPlan("DASH diet guidelines, limit dietary sodium < 2g/day, brisk walking 30 mins daily, home BP charting.");
    } else if (type === "URTI") {
      setSubjective("Complaints of nasal congestion, dry cough, and mild throat irritation for 3 days. No high-grade fever.");
      setAssessment("Acute upper respiratory infection, unspecified (ICD-10: J06.9)");
      setPlan("Adequate hydration, steam inhalation twice daily, saline nasal spray as needed.");
    }
  };

  const handleFinalizeSigning = () => {
    if (signingPin.length < 4) return;
    setIsSigning(true);
    setTimeout(() => {
      // Redirect to signed prescription viewer
      router.push("/prescription/rx-98421");
    }, 800);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href="/doctor/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue-700 hover:text-brand-blue-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to OPD Queue Dashboard</span>
          </Link>
          <Badge variant="verified" className="text-xs">
            Encounter Session Active: #APPT-5412
          </Badge>
        </div>

        {/* Patient Context Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand-blue-100 text-brand-blue-800 font-bold text-lg flex items-center justify-center shrink-0">
              {patient.fullName.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">{patient.fullName}</h1>
                <span className="text-xs font-medium text-slate-500">36 Yrs • Male • Blood Group: O+</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Primary Contact: +91 98765 43210 • ABHA ID: 91-4829-1029-4412
              </p>
            </div>
          </div>

          {/* Allergy Warning Strip */}
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg text-xs text-red-900">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
            <span>
              <strong>Documented Drug Allergies:</strong> {patient.knownAllergies.join(", ") || "None Reported"}
            </span>
          </div>
        </div>

        {/* Triage Baseline Vitals Grid */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
            Triage Baseline Physical Vitals (Pre-Call Checked)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-amber-800 font-medium block">Blood Pressure</span>
              <span className="text-sm font-bold text-amber-950">145 / 92 mmHg</span>
              <span className="text-[10px] text-amber-700 block mt-0.5">Stage 1 Hypertensive</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium block">Pulse Rate</span>
              <span className="text-sm font-bold text-slate-900">76 bpm</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Regular Rhythm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium block">Oxygen Saturation</span>
              <span className="text-sm font-bold text-slate-900">98% SpO2</span>
              <span className="text-[10px] text-brand-green-700 block mt-0.5">Normal on room air</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium block">Body Temperature</span>
              <span className="text-sm font-bold text-slate-900">98.4 °F</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Afebrile</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium block">Random Blood Sugar</span>
              <span className="text-sm font-bold text-slate-900">110 mg/dL</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Post-prandial</span>
            </div>
          </div>
        </div>

        {/* Clinical Macros / Rapid Order Sets */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-brand-blue-600" />
            Quick Clinical Templates:
          </span>
          <button
            type="button"
            onClick={() => handleApplyMacro("HTN")}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium transition-colors"
          >
            + Hypertension Management
          </button>
          <button
            type="button"
            onClick={() => handleApplyMacro("URTI")}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium transition-colors"
          >
            + Acute URTI Template
          </button>
        </div>

        {/* 4-Quadrant SOAP Clinical Documentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subjective */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                S — Subjective (Patient History & HPI)
              </label>
              <span className="text-[10px] text-slate-400">Chief complaint & symptom onset</span>
            </div>
            <textarea
              rows={4}
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
            />
          </div>

          {/* Objective */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                O — Objective (Examination & Vitals)
              </label>
              <span className="text-[10px] text-slate-400">Clinical signs & physical review</span>
            </div>
            <textarea
              rows={4}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
            />
          </div>

          {/* Assessment */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                A — Assessment (Diagnosis & ICD-10)
              </label>
              <span className="text-[10px] text-slate-400">Standardized clinical coding</span>
            </div>
            <textarea
              rows={3}
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
            />
          </div>

          {/* Plan */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                P — Plan (General Advice & Orders)
              </label>
              <span className="text-[10px] text-slate-400">Lifestyle advice & investigation</span>
            </div>
            <textarea
              rows={3}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
            />
          </div>
        </div>

        {/* e-Prescription Authoring Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-blue-700" />
                <span>Digital e-Prescription Generator</span>
              </h2>
              <p className="text-xs text-slate-500">
                Author medications compliant with MoHFW Schedule restrictions and clinical dosage standards.
              </p>
            </div>
            <Badge variant="verified" className="text-xs">
              MoHFW Form 2020 Valid
            </Badge>
          </div>

          {/* Prescribed Drugs List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Medicine & Generic</th>
                  <th className="py-2.5 px-3">Strength</th>
                  <th className="py-2.5 px-3">Dosage Pattern</th>
                  <th className="py-2.5 px-3">Meal Timing</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-900">{med.drugName}</p>
                      <p className="text-[11px] text-slate-500">{med.genericName} • {med.dosageForm}</p>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{med.strength}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-800">
                        {med.dosagePattern}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {med.timing === "BEFORE_FOOD" ? "Before Food" : "After Food"}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{med.durationDays} Days</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(med.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Remove Medicine"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Medicine Form */}
          <form onSubmit={handleAddMedicine} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              + Add Prescribed Drug
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Drug Name (e.g. Paracetamol, Pantocid 40)..."
                  value={newDrugName}
                  onChange={(e) => setNewDrugName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Strength (40 mg)"
                  value={newDrugStrength}
                  onChange={(e) => setNewDrugStrength(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                />
              </div>
              <div>
                <select
                  value={newDrugPattern}
                  onChange={(e) => setNewDrugPattern(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500 cursor-pointer"
                >
                  <option value="1-0-1">1-0-1 (Twice Daily)</option>
                  <option value="1-0-0">1-0-0 (Morning)</option>
                  <option value="0-0-1">0-0-1 (Night)</option>
                </select>
              </div>
              <div>
                <Button type="submit" size="sm" variant="outline" className="w-full h-full text-xs font-semibold gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add to Rx</span>
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Note: Schedule X narcotics (e.g. Morphine, Diazepam, Clonazepam) are strictly blocked by Indian Telemedicine Practice Guidelines.
            </p>
          </form>
        </div>

        {/* Action Commit Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="h-4 w-4 text-brand-green-600" />
            <span>Digital signature uses SHA-256 hash sealing bound to Council Reg {doctor.councilRegistrationNumber}.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              onClick={() => alert("Draft saved locally!")}
              className="gap-2 text-xs w-full sm:w-auto"
            >
              <Save className="h-4 w-4" />
              <span>Save Draft</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setSignPinModalOpen(true)}
              className="gap-2 text-xs font-bold shadow-md w-full sm:w-auto"
            >
              <Lock className="h-4 w-4" />
              <span>Sign & Finalize Prescription</span>
            </Button>
          </div>
        </div>

        {/* Schedule X Narcotic Intercept Modal (OVERLAY-11 / TRM-GAP-002) */}
        {scheduleXModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-md w-full border-4 border-red-600 shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="text-center space-y-2">
                <ShieldAlert className="h-12 w-12 text-red-600 mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-red-950">
                  STATUTORY SCHEDULE X DRUG RESTRICTION
                </h3>
                <p className="text-xs text-red-700">
                  MoHFW Telemedicine Practice Guidelines (2020), Section 3.7.4
                </p>
              </div>

              <div className="bg-red-50 p-3.5 rounded-lg border border-red-200 text-xs text-red-900 space-y-1">
                <p>
                  You attempted to prescribe: <strong className="underline uppercase">{prohibitedDrugName}</strong>.
                </p>
                <p>
                  Under Indian law, Schedule X psychotropic substances, narcotics, and habit-forming drugs are strictly prohibited from remote teleconsultation issuance.
                </p>
              </div>

              <Button
                variant="destructive"
                size="md"
                onClick={() => setScheduleXModalOpen(false)}
                className="w-full font-bold"
              >
                Acknowledge & Remove Drug
              </Button>
            </div>
          </div>
        )}

        {/* Digital Signature PIN Modal (OVERLAY-13) */}
        {signPinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-center">
              <div className="h-12 w-12 bg-brand-blue-50 text-brand-blue-700 rounded-full flex items-center justify-center mx-auto">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Authorize Digital Signature</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your 4-digit RMP Signing PIN to cryptographically seal this consultation prescription.
                </p>
              </div>

              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="••••"
                value={signingPin}
                onChange={(e) => setSigningPin(e.target.value)}
                className="w-32 text-center text-2xl font-mono tracking-widest p-2 rounded-lg border border-slate-300 mx-auto block focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
              />

              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFinalizeSigning}
                  isLoading={isSigning}
                  disabled={signingPin.length < 4}
                  className="w-full font-bold"
                >
                  Seal & Issue Prescription
                </Button>
                <button
                  type="button"
                  onClick={() => setSignPinModalOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

