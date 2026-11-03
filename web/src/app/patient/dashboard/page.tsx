"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Video, 
  FileText, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Plus, 
  Activity, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_CLINICIANS, MOCK_DEPENDENTS, MOCK_PRESCRIPTIONS } from "@/data/mock-store";

export default function PatientDashboardPage() {
  const doctor = MOCK_CLINICIANS[0];
  const dependents = MOCK_DEPENDENTS;
  const [selectedDependent, setSelectedDependent] = useState(dependents[0]);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-8">
        {/* Patient Dashboard Greeting */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-blue-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow">
              {selectedDependent.fullName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Welcome back, {selectedDependent.fullName}!
                </h1>
                <Badge variant="verified" className="text-xs">
                  ABHA Linked
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your consultations, digital health vault, and family dependents.
              </p>
            </div>
          </div>

          {/* Dependent Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Profile:</span>
            <select
              value={selectedDependent.id}
              onChange={(e) => {
                const found = dependents.find(d => d.id === e.target.value);
                if (found) setSelectedDependent(found);
              }}
              className="text-xs font-semibold p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 cursor-pointer"
            >
              {dependents.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.fullName} ({dep.relationship})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Next Upcoming Appointment Action Card */}
        <div className="bg-gradient-to-r from-brand-blue-700 to-brand-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-green-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-green-300">
                Next Confirmed Consultation
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Teleconsultation with {doctor.fullName}
            </h2>
            <p className="text-xs text-brand-blue-100 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Today, 4:30 PM (20 Mins)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Video className="h-3.5 w-3.5" />
                HD Video Room
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link href="/room/appt-5412">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto font-bold gap-2 shadow-lg">
                <Video className="h-5 w-5" />
                <span>Join Pre-Call Room</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 2-Column: Recent Prescriptions & Family Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Prescriptions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-blue-600" />
                <span>Recent e-Prescriptions</span>
              </h3>
              <Link href="/vault" className="text-xs text-brand-blue-700 font-semibold hover:underline">
                View Health Vault
              </Link>
            </div>

            <div className="space-y-3">
              {MOCK_PRESCRIPTIONS.map((rx) => (
                <div key={rx.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{rx.doctorName}</h4>
                    <p className="text-[11px] text-slate-500">{rx.encounterDate} • {rx.clinicName}</p>
                    <p className="text-[10px] text-brand-blue-700 font-medium mt-0.5">
                      {rx.medicines.map(m => m.drugName).join(", ")}
                    </p>
                  </div>
                  <Link href={`/prescription/${rx.id}`}>
                    <Button size="sm" variant="outline" className="text-xs gap-1">
                      <span>View</span>
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                Book a New Consultation
              </h3>
              <p className="text-xs text-slate-500">
                Search over 450 verified practitioners across 24 specialties or join instant acute care.
              </p>
              <div className="flex gap-3 pt-1">
                <Link href="/doctors" className="flex-1">
                  <Button variant="primary" size="sm" className="w-full justify-center">
                    Search Doctors
                  </Button>
                </Link>
                <Link href="/consult/instant" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full justify-center">
                    Instant Consult
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                Family & Dependent Caregivers
              </h3>
              <p className="text-xs text-slate-500">
                You have {dependents.length} profiles linked. Manage medical history and book visits on their behalf.
              </p>
              <Link href="/account/family" className="inline-block">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <User className="h-3.5 w-3.5" />
                  <span>Manage Family Profiles</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

