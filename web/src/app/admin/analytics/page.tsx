"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  Video, 
  Users, 
  ShieldCheck, 
  Calendar, 
  Download, 
  Clock, 
  Server, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  Building2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function PlatformAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("TODAY");

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-8">
        {/* Analytics Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                National Teleconsultation Surveillance & SLOs
              </h1>
              <Badge variant="verified" className="text-xs">
                Live Telemetry
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time platform operational metrics, service level objectives (SLO), and clinical volume surveillance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs font-semibold p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 cursor-pointer"
            >
              <option value="TODAY">Today (Real-time)</option>
              <option value="7D">Past 7 Days</option>
              <option value="30D">Past 30 Days</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Exporting operational surveillance audit CSV...")}
              className="gap-1.5 text-xs font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        {/* 4 Primary SLO Health KPI Cards (BRD-BUS-02, 03, 04) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Video Join Rate</span>
                <span className="text-[10px] bg-brand-green-100 text-brand-green-800 px-1.5 py-0.5 rounded font-bold">
                  Target &ge; 98%
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900">99.2%</p>
              <p className="text-[11px] text-brand-green-700 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>SLO Compliant (LiveKit SFU)</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Booking Conversion</span>
                <span className="text-[10px] bg-brand-green-100 text-brand-green-800 px-1.5 py-0.5 rounded font-bold">
                  Target &ge; 95%
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900">96.8%</p>
              <p className="text-[11px] text-brand-green-700 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>10m Lock Zero Conflict</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Monthly Uptime</span>
                <span className="text-[10px] bg-brand-green-100 text-brand-green-800 px-1.5 py-0.5 rounded font-bold">
                  Target &ge; 99.9%
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900">99.98%</p>
              <p className="text-[11px] text-brand-green-700 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Azure Central India Active</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Avg Media Latency</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">
                  P95 &lt; 50ms
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900">32 ms</p>
              <p className="text-[11px] text-slate-500">
                Packet Loss: 0.04% (HD 1080p)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 2-Column: Funnel Analytics & Specialty Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Funnel */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-blue-600" />
              <span>Today's Teleconsultation Funnel</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">1. Doctor Search & Profile Views</span>
                  <span className="font-bold text-slate-900">1,840</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-blue-600 h-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">2. Slot Hold Acquired (10m Lock)</span>
                  <span className="font-bold text-slate-900">1,782 (96.8%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-blue-500 h-full w-[96.8%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">3. Payment Confirmed & Voucher Issued</span>
                  <span className="font-bold text-slate-900">1,724 (96.7%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-green-500 h-full w-[93.6%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">4. Video Room Joined & e-Rx Finalized</span>
                  <span className="font-bold text-slate-900">1,698 (98.5%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-green-600 h-full w-[92.2%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Specialty Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-blue-600" />
              <span>Consultations by Medical Specialty</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">General Medicine & Acute Care</span>
                <span className="font-bold text-brand-blue-700">642 Encounters (38%)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">Cardiology & Hypertension</span>
                <span className="font-bold text-brand-blue-700">388 Encounters (23%)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">Pediatrics & Neonatal Care</span>
                <span className="font-bold text-brand-blue-700">340 Encounters (20%)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">Dermatology & Skin Triage</span>
                <span className="font-bold text-brand-blue-700">328 Encounters (19%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sovereign Infrastructure & Compliance Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Server className="h-4 w-4 text-brand-blue-600" />
            <span>Sovereign Cloud Data Residency & Security Posture</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-slate-400 block uppercase font-semibold text-[10px]">Data Residency</span>
              <span className="font-bold text-slate-900 block mt-0.5">Azure Central India (Pune)</span>
              <span className="text-[11px] text-brand-green-700 font-medium">100% India DPDP Localized</span>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-slate-400 block uppercase font-semibold text-[10px]">Cryptographic Key Vault</span>
              <span className="font-bold text-slate-900 block mt-0.5">FIPS 140-2 Level 3 HSM</span>
              <span className="text-[11px] text-brand-green-700 font-medium">AES-256 Envelope Encryption</span>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-slate-400 block uppercase font-semibold text-[10px]">Audit Log Immutability</span>
              <span className="font-bold text-slate-900 block mt-0.5">WORM Compliant Append-Only</span>
              <span className="text-[11px] text-brand-green-700 font-medium">Zero Unaudited Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

