"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Building2, 
  ArrowLeft, 
  Pill, 
  Calendar,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_PRESCRIPTIONS } from "@/data/mock-store";

export default function DigitalPrescriptionViewerPage() {
  const params = useParams();
  const router = useRouter();
  const prescriptionId = (params?.id as string) || "rx-98421";
  const prescription = MOCK_PRESCRIPTIONS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-100 min-h-screen py-8 print:bg-white print:py-0">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-6">
        {/* Top Action Bar (Hidden during print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <Link 
            href="/patient/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue-700 hover:text-brand-blue-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 text-xs">
              <Printer className="h-3.5 w-3.5" />
              <span>Print Prescription</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => alert("Downloading tamper-proof PDF with embedded cryptographic certificate...")}
              className="gap-1.5 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => alert("Pharmacy fulfillment cart initialized with prescribed medicines!")}
              className="gap-1.5 text-xs font-bold shadow-sm"
            >
              <Pill className="h-3.5 w-3.5" />
              <span>Order Medicines (1-Tap)</span>
            </Button>
          </div>
        </div>

        {/* Prescription Paper Canvas (Pure White, Sterile Layout) */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-xl p-8 sm:p-12 print:border-0 print:shadow-none print:p-0 space-y-8">
          {/* Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-blue-700 text-white font-bold text-xs">
                  KGS
                </div>
                <span className="font-heading font-black text-xl text-slate-900 tracking-tight">
                  KAIZENTRIX TELEHEALTH
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-800">
                {prescription.clinicName}
              </h1>
              <p className="text-xs text-slate-500">
                {prescription.clinicAddress} • Telemedicine Clinical OPD
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <h2 className="text-base font-bold text-brand-blue-800">
                {prescription.doctorName}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                {prescription.doctorDegrees.join(", ")}
              </p>
              <div className="inline-flex items-center gap-1 bg-brand-blue-50 text-brand-blue-800 border border-brand-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                <ShieldCheck className="h-3 w-3 text-brand-blue-600" />
                <span>Reg No: {prescription.doctorRegistrationNumber} ({prescription.doctorCouncil})</span>
              </div>
            </div>
          </div>

          {/* Patient Details & Encounter Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{prescription.patientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Age / Gender</span>
              <span className="font-bold text-slate-900 text-sm">{prescription.patientAge} Yrs / {prescription.patientGender}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Date of Consultation</span>
              <span className="font-bold text-slate-900 text-sm">{prescription.encounterDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Prescription ID</span>
              <span className="font-mono font-bold text-brand-blue-800 text-sm">{prescription.id.toUpperCase()}</span>
            </div>
          </div>

          {/* Clinical Findings & Diagnosis */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Chief Complaint & Clinical Summary
              </h3>
              <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                {prescription.chiefComplaint}
              </p>
              <p className="text-xs text-slate-600 mt-1 italic">
                "{prescription.clinicalNotes}"
              </p>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Clinical Diagnosis (ICD-10)
              </h3>
              <div className="flex flex-wrap gap-2">
                {prescription.diagnosisCodes.map((d, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-green-600" />
                    <span>{d.display} ({d.code})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rx Symbol & Medication Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
              <span className="font-serif font-black text-2xl text-slate-900 italic">℞</span>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Prescribed Medicines
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Medicine Name & Generic</th>
                    <th className="py-2.5 px-3">Strength</th>
                    <th className="py-2.5 px-3">Dosage</th>
                    <th className="py-2.5 px-3">Timing</th>
                    <th className="py-2.5 px-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prescription.medicines.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-sm text-slate-900">{m.drugName}</p>
                        <p className="text-[11px] text-slate-500">{m.genericName} ({m.dosageForm})</p>
                        {m.instructions && (
                          <p className="text-[10px] text-brand-blue-700 italic mt-0.5">{m.instructions}</p>
                        )}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{m.strength}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-800">
                          {m.dosagePattern}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {m.timing === "BEFORE_FOOD" ? "Before Meals" : "After Meals"}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">{m.durationDays} Days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* General Advice & Next Follow-Up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px] mb-1">Dietary & Lifestyle Advice</span>
              <p className="text-slate-800 leading-relaxed">{prescription.generalAdvice}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px] mb-1">Recommended Follow-up</span>
              <p className="text-sm font-bold text-brand-blue-800 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-brand-blue-600" />
                {prescription.followUpDate}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Complimentary asynchronous query window active for 7 days in your portal.
              </p>
            </div>
          </div>

          {/* Digital Signature Seal & QR Code Footer */}
          <div className="border-t-2 border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* QR Code */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 p-1.5 border-2 border-slate-800 rounded-lg bg-white flex flex-col items-center justify-center shrink-0">
                <QrCode className="h-16 w-16 text-slate-900" />
              </div>
              <div className="space-y-0.5 text-xs text-slate-500">
                <p className="font-bold text-slate-900">Scan to Verify Authenticity</p>
                <p className="text-[10px]">Tamper-Proof National Health Audit Record</p>
                <p className="font-mono text-[9px] text-slate-400 truncate max-w-xs">{prescription.digitalSignatureHash}</p>
              </div>
            </div>

            {/* Signature Block */}
            <div className="text-center sm:text-right space-y-1">
              <div className="h-10 flex items-center justify-center sm:justify-end">
                <span className="font-serif italic font-bold text-brand-blue-800 text-lg">
                  {prescription.doctorName}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 border-t border-slate-300 pt-1">
                Digitally Signed & Certified
              </p>
              <p className="text-[10px] text-slate-500">
                {prescription.doctorRegistrationNumber} ({prescription.doctorCouncil})
              </p>
              <p className="text-[9px] text-brand-green-700 font-semibold flex items-center justify-center sm:justify-end gap-1">
                <ShieldCheck className="h-3 w-3" />
                Valid under MoHFW Telemedicine Guidelines 2020
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

