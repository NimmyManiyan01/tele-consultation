"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Video, 
  Clock, 
  CheckCircle2, 
  Activity, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  ArrowRight, 
  PhoneCall, 
  AlertCircle,
  Play,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_CLINICIANS } from "@/data/mock-store";

interface QueuePatient {
  token: string;
  id: string;
  name: string;
  ageGender: string;
  type: "VIDEO" | "IN_CLINIC";
  timeSlot: string;
  status: "WAITING_IN_ROOM" | "READY" | "IN_PROGRESS" | "COMPLETED";
  chiefComplaint: string;
  hasRedFlags: boolean;
}

const MOCK_QUEUE: QueuePatient[] = [
  {
    token: "T-01",
    id: "appt-5412",
    name: "Rohan Verma",
    ageGender: "36 / Male",
    type: "VIDEO",
    timeSlot: "4:30 PM (Now)",
    status: "WAITING_IN_ROOM",
    chiefComplaint: "Mild exertional breathlessness, morning BP 145/92 mmHg",
    hasRedFlags: false,
  },
  {
    token: "T-02",
    id: "appt-5413",
    name: "Aarav Verma (Child)",
    ageGender: "6 / Male",
    type: "VIDEO",
    timeSlot: "5:00 PM",
    status: "READY",
    chiefComplaint: "Dry nocturnal cough, low-grade fever for 2 days",
    hasRedFlags: false,
  },
  {
    token: "T-03",
    id: "appt-5414",
    name: "Sushila Devi",
    ageGender: "68 / Female",
    type: "IN_CLINIC",
    timeSlot: "5:30 PM",
    status: "READY",
    chiefComplaint: "Routine hypertension and diabetic HbA1c review",
    hasRedFlags: false,
  },
  {
    token: "T-04",
    id: "appt-5410",
    name: "Vikram Singhania",
    ageGender: "45 / Male",
    type: "VIDEO",
    timeSlot: "3:30 PM",
    status: "COMPLETED",
    chiefComplaint: "Post-op cardiology routine follow-up",
    hasRedFlags: false,
  }
];

export default function DoctorDashboardPage() {
  const doctor = MOCK_CLINICIANS[0];
  const [isOnline, setIsOnline] = useState(true);
  const [queue, setQueue] = useState<QueuePatient[]>(MOCK_QUEUE);

  const waitingCount = queue.filter(q => q.status === "WAITING_IN_ROOM").length;
  const completedCount = queue.filter(q => q.status === "COMPLETED").length;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-8">
        {/* Clinician Portal Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-blue-700 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow">
              {doctor.fullName.split(" ").slice(1).map(n => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {doctor.fullName}
                </h1>
                <Badge variant="verified" className="text-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-blue-600 mr-1" />
                  <span>{doctor.councilRegistrationNumber}</span>
                </Badge>
              </div>
              <p className="text-xs text-brand-blue-700 font-semibold">
                Senior Consultant — {doctor.primarySpecialty} • {doctor.clinicName}
              </p>
              <p className="text-[11px] text-slate-400">
                MoHFW Registered Medical Practitioner (RMP) Portal
              </p>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <div className="text-right text-xs">
              <span className="font-bold text-slate-900 block">
                {isOnline ? "Available for Consultations" : "Offline / In-Hospital"}
              </span>
              <span className="text-[11px] text-slate-500">
                {isOnline ? "Accepting scheduled & instant teleconsults" : "Patients cannot join waiting queue"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                isOnline ? "bg-brand-green-500 justify-end" : "bg-slate-300 justify-start"
              }`}
              aria-label="Toggle Online Availability"
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-brand-blue-50 text-brand-blue-700 flex items-center justify-center shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Today's Appointments</p>
                <p className="text-2xl font-extrabold text-slate-900">{queue.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Waiting in Room</p>
                <p className="text-2xl font-extrabold text-amber-600">{waitingCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-brand-green-50 text-brand-green-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Completed Today</p>
                <p className="text-2xl font-extrabold text-brand-green-700">{completedCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Avg Consultation</p>
                <p className="text-2xl font-extrabold text-purple-700">18 min</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live OPD Patient Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Live Daily OPD Queue
              </h2>
              <p className="text-xs text-slate-500">
                Real-time teleconsultation and clinic arrival roster with instant admittance controls.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-semibold">
                Auto-Refresh Active (WebSocket)
              </Badge>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Token #</th>
                    <th className="py-3 px-4">Patient Demographics</th>
                    <th className="py-3 px-4">Encounter Type</th>
                    <th className="py-3 px-4">Scheduled Slot</th>
                    <th className="py-3 px-4">Chief Complaint / Intake</th>
                    <th className="py-3 px-4">Queue Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {queue.map((patient) => {
                    const isWaitingNow = patient.status === "WAITING_IN_ROOM";
                    return (
                      <tr 
                        key={patient.token}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isWaitingNow ? "bg-amber-50/40" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                          {patient.token}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 text-sm">{patient.name}</p>
                          <p className="text-slate-500">{patient.ageGender}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          {patient.type === "VIDEO" ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-brand-blue-700 bg-brand-blue-50 px-2 py-0.5 rounded">
                              <Video className="h-3 w-3" />
                              Video Call
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              In-Clinic
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {patient.timeSlot}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="truncate text-slate-700" title={patient.chiefComplaint}>
                            {patient.chiefComplaint}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          {patient.status === "WAITING_IN_ROOM" && (
                            <Badge variant="warning" className="gap-1 animate-pulse">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                              Waiting in Pre-Call
                            </Badge>
                          )}
                          {patient.status === "READY" && (
                            <Badge variant="outline" className="text-slate-600">
                              Upcoming
                            </Badge>
                          )}
                          {patient.status === "COMPLETED" && (
                            <Badge variant="success" className="gap-1">
                              <CheckCircle2 className="h-3 w-3 text-brand-green-600" />
                              Completed
                            </Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isWaitingNow && (
                              <Link href={`/room/${patient.id}`}>
                                <Button size="sm" variant="primary" className="gap-1.5 font-bold shadow-sm">
                                  <Play className="h-3.5 w-3.5 fill-white" />
                                  <span>Admit to Call</span>
                                </Button>
                              </Link>
                            )}
                            <Link href={`/doctor/emr/${patient.id}`}>
                              <Button size="sm" variant="outline" className="gap-1">
                                <FileText className="h-3.5 w-3.5" />
                                <span>EMR Chart</span>
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Links Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <Link href="/doctor/dashboard" className="p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-blue-400 transition-colors shadow-sm block">
            <h3 className="font-bold text-slate-900 mb-1">Roster & Shift Configuration</h3>
            <p className="text-slate-500">Configure weekly OPD hours, slot intervals (15/20/30m), and leave blocks.</p>
          </Link>
          <Link href={`/prescription/rx-98421`} className="p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-blue-400 transition-colors shadow-sm block">
            <h3 className="font-bold text-slate-900 mb-1">Prescription Records & Signing</h3>
            <p className="text-slate-500">View past signed e-prescriptions and verify cryptographic signature audit hashes.</p>
          </Link>
          <Link href="/patient/dashboard" className="p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-blue-400 transition-colors shadow-sm block">
            <h3 className="font-bold text-slate-900 mb-1">Switch to Patient View</h3>
            <p className="text-slate-500">Preview patient self-service dashboard, booking voucher, and digital health vault.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

