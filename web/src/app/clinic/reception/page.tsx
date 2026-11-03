"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  Activity, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Search, 
  Printer, 
  AlertCircle, 
  HeartPulse, 
  X,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ReceptionPatient {
  token: string;
  name: string;
  ageGender: string;
  doctorAssigned: string;
  status: "WAITING" | "TRIAGE_PENDING" | "IN_CONSULTATION" | "COMPLETED";
  vitalsRecorded: boolean;
  paymentStatus: "PAID" | "PENDING";
  fee: number;
}

const INITIAL_QUEUE: ReceptionPatient[] = [
  {
    token: "A-101",
    name: "Rohan Verma",
    ageGender: "36 / Male",
    doctorAssigned: "Dr. Priya Sharma (Cardiology)",
    status: "WAITING",
    vitalsRecorded: true,
    paymentStatus: "PAID",
    fee: 850
  },
  {
    token: "A-102",
    name: "Meenakshi Sundaram",
    ageGender: "52 / Female",
    doctorAssigned: "Dr. Rajesh Menon (General)",
    status: "TRIAGE_PENDING",
    vitalsRecorded: false,
    paymentStatus: "PAID",
    fee: 500
  },
  {
    token: "A-103",
    name: "Anand Kulkarni",
    ageGender: "44 / Male",
    doctorAssigned: "Dr. Priya Sharma (Cardiology)",
    status: "IN_CONSULTATION",
    vitalsRecorded: true,
    paymentStatus: "PAID",
    fee: 850
  },
  {
    token: "A-104",
    name: "Kavita Rao",
    ageGender: "29 / Female",
    doctorAssigned: "Dr. Vikram Rao (Dermatology)",
    status: "WAITING",
    vitalsRecorded: false,
    paymentStatus: "PENDING",
    fee: 700
  }
];

export default function ClinicReceptionPage() {
  const [queue, setQueue] = useState<ReceptionPatient[]>(INITIAL_QUEUE);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [triageModalOpen, setTriageModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<ReceptionPatient | null>(null);

  // Vitals form
  const [bpSystolic, setBpSystolic] = useState("120");
  const [bpDiastolic, setBpDiastolic] = useState("80");
  const [pulse, setPulse] = useState("72");
  const [spO2, setSpO2] = useState("98");
  const [temp, setTemp] = useState("98.6");

  const filtered = queue.filter(p => {
    if (selectedFilter === "ALL") return true;
    if (selectedFilter === "TRIAGE_PENDING") return !p.vitalsRecorded;
    return p.status === selectedFilter;
  });

  const handleOpenTriage = (p: ReceptionPatient) => {
    setSelectedPatient(p);
    setTriageModalOpen(true);
  };

  const handleSaveTriage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setQueue(prev => prev.map(p => {
      if (p.token === selectedPatient.token) {
        return { ...p, vitalsRecorded: true, status: "WAITING" };
      }
      return p;
    }));
    setTriageModalOpen(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-6">
        {/* Reception Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-brand-blue-700 text-white font-bold text-xl flex items-center justify-center shrink-0">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Clinic Front Desk & Triage Reception
                </h1>
                <Badge variant="verified" className="text-xs">
                  OPD Live Desk
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kaizentrix Health Hub (Indiranagar) • Managing walk-in patient arrivals and nurse triage vitals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Walk-in registration modal initialized!")}
              className="gap-1.5 text-xs font-semibold"
            >
              <Plus className="h-4 w-4 text-brand-blue-600" />
              <span>Register Walk-In Patient</span>
            </Button>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-brand-blue-50 text-brand-blue-700 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Arrived Today</span>
              <span className="text-xl font-bold text-slate-900">{queue.length} Patients</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Triage Pending</span>
              <span className="text-xl font-bold text-amber-600">
                {queue.filter(p => !p.vitalsRecorded).length}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-slate-400 block font-medium">In Consultation</span>
              <span className="text-xl font-bold text-purple-700">
                {queue.filter(p => p.status === "IN_CONSULTATION").length}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-brand-green-50 text-brand-green-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Doctors on Duty</span>
              <span className="text-xl font-bold text-brand-green-700">3 Available</span>
            </div>
          </div>
        </div>

        {/* Live Reception Queue Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedFilter === "ALL" 
                    ? "bg-brand-blue-600 text-white shadow-sm" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Arrivals ({queue.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("TRIAGE_PENDING")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedFilter === "TRIAGE_PENDING" 
                    ? "bg-brand-blue-600 text-white shadow-sm" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Triage Pending
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("WAITING")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedFilter === "WAITING" 
                    ? "bg-brand-blue-600 text-white shadow-sm" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Waiting for Doctor
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("IN_CONSULTATION")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedFilter === "IN_CONSULTATION" 
                    ? "bg-brand-blue-600 text-white shadow-sm" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                In Consultation
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Token</th>
                  <th className="py-2.5 px-3">Patient Details</th>
                  <th className="py-2.5 px-3">Assigned Clinician</th>
                  <th className="py-2.5 px-3">Triage Vitals Status</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3 text-right">Desk Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.token} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 text-sm">
                      {p.token}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                      <p className="text-slate-500">{p.ageGender}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {p.doctorAssigned}
                    </td>
                    <td className="py-3 px-3">
                      {p.vitalsRecorded ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-brand-green-700 bg-brand-green-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="h-3 w-3" />
                          Vitals Captured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded animate-pulse">
                          <AlertCircle className="h-3 w-3 text-amber-600" />
                          Needs Triage
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={p.paymentStatus === "PAID" ? "success" : "warning"}>
                        {p.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!p.vitalsRecorded && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleOpenTriage(p)}
                            className="gap-1 text-xs"
                          >
                            <HeartPulse className="h-3.5 w-3.5" />
                            <span>Capture Vitals</span>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => alert(`Printing OPD token receipt for ${p.token}...`)}
                          className="h-8 w-8 p-0 text-slate-500"
                          aria-label="Print Token"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Triage Modal (OVERLAY-19) */}
        {triageModalOpen && selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-brand-blue-700" />
                    <span>Record Physical Vitals: {selectedPatient.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500">Token: {selectedPatient.token} • {selectedPatient.ageGender}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTriageModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTriage} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">BP Systolic (mmHg)</label>
                    <Input
                      type="number"
                      required
                      value={bpSystolic}
                      onChange={(e) => setBpSystolic(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">BP Diastolic (mmHg)</label>
                    <Input
                      type="number"
                      required
                      value={bpDiastolic}
                      onChange={(e) => setBpDiastolic(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Pulse (bpm)</label>
                    <Input
                      type="number"
                      required
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">SpO2 (%)</label>
                    <Input
                      type="number"
                      required
                      value={spO2}
                      onChange={(e) => setSpO2(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Temp (°F)</label>
                    <Input
                      type="number"
                      step="0.1"
                      required
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTriageModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="font-bold shadow-md"
                  >
                    Save & Advance to Queue
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

