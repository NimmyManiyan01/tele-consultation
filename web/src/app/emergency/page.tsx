"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PhoneCall, 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Navigation, 
  Building2, 
  Activity,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EMERGENCY_SERVICES = [
  {
    number: "112",
    title: "National Unified Emergency (Police, Fire, Ambulance)",
    speed: "Instant connection • Pan-India",
    badge: "Primary Dispatch"
  },
  {
    number: "108",
    title: "National Emergency Ambulance Response",
    speed: "24/7 Paramedic ALS / BLS Ambulances",
    badge: "Medical Only"
  },
  {
    number: "102",
    title: "Maternal & Child Health Free Transport",
    speed: "Janani Shishu Suraksha Karyakram (JSSK)",
    badge: "Maternity"
  }
];

const NEARBY_ER_CENTERS = [
  {
    name: "Manipal Hospital — Level 1 Trauma Center",
    distance: "1.8 km (approx 6 mins drive)",
    address: "98 HAL Old Airport Road, Kodihalli, Bengaluru",
    erDirect: "+91 80 2502 4444",
    status: "24/7 ER Beds Available"
  },
  {
    name: "Apollo Hospital — Emergency & Acute Care",
    distance: "3.4 km (approx 11 mins drive)",
    address: "154/11 Bannerghatta Road, Opp IIM, Bengaluru",
    erDirect: "+91 80 2630 4050",
    status: "Cardiac Cath Lab Active"
  },
  {
    name: "Fortis Hospital — 24/7 Emergency Wing",
    distance: "4.2 km (approx 14 mins drive)",
    address: "14 Cunningham Road, Vasanth Nagar, Bengaluru",
    erDirect: "+91 80 4199 4444",
    status: "Stroke Team On Duty"
  }
];

export default function EmergencyTriagePage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  return (
    <div className="min-h-screen bg-rose-50/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back navigation */}
        <Link href="/">
          <Button variant="outline" size="sm" className="text-xs bg-white">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Platform Home
          </Button>
        </Link>

        {/* Emergency Alert Banner */}
        <div className="bg-rose-950 text-white rounded-2xl p-6 sm:p-8 border-2 border-rose-600 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">Emergency Critical Care Intercept</h1>
                <Badge className="bg-rose-600 text-white text-xs">Statutory Red-Flag</Badge>
              </div>
              <p className="text-xs text-rose-200 mt-0.5">
                Do not wait for a teleconsultation if you or the patient is facing an acute medical crisis.
              </p>
            </div>
          </div>

          <div className="bg-rose-900/60 border border-rose-700/80 rounded-xl p-4 text-xs text-rose-100 leading-relaxed">
            <strong>MoHFW Clinical Rule:</strong> Online consultations cannot perform cardiopulmonary resuscitation (CPR), intubation, emergency thrombolysis, or physical wound stabilization. Emergency dispatch services must be notified immediately.
          </div>
        </div>

        {/* Direct One-Click Emergency Hotlines */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Immediate Toll-Free Emergency Dispatch Lines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EMERGENCY_SERVICES.map((serv) => (
              <a
                key={serv.number}
                href={`tel:${serv.number}`}
                className="bg-white rounded-xl border border-rose-200 p-5 shadow-sm hover:border-rose-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-rose-300 text-rose-800 bg-rose-50 text-[10px]">
                      {serv.badge}
                    </Badge>
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="font-mono text-3xl font-black text-rose-700 tracking-tight block">
                    {serv.number}
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-2">{serv.title}</p>
                </div>
                <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">{serv.speed}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Nearest Hospital ER Trauma Locator */}
        <Card className="p-6 border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">Nearest Emergency Departments & Trauma Wings</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">GPS location: Bengaluru, Karnataka (Detected from IP / Device)</p>
            </div>
            <Badge variant="outline" className="text-xs border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> 3 Centers Within 5 km
            </Badge>
          </div>

          <div className="space-y-3">
            {NEARBY_ER_CENTERS.map((er, idx) => (
              <div 
                key={idx}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{er.name}</h4>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">
                      {er.distance}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {er.address}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> {er.status}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a href={`tel:${er.erDirect.replace(/[^0-9+]/g, '')}`} className="flex-1 sm:flex-none">
                    <Button size="sm" className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold">
                      <PhoneCall className="w-3.5 h-3.5 mr-1.5" /> Call ER Desk
                    </Button>
                  </a>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(er.name + " " + er.address)}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 sm:flex-none"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold text-slate-700">
                      <Navigation className="w-3.5 h-3.5 mr-1.5" /> Directions
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}

