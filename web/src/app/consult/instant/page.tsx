"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Activity, 
  Clock, 
  ShieldCheck, 
  Video, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  User, 
  RotateCcw,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_CLINICIANS } from "@/data/mock-store";
import { formatCurrency } from "@/lib/utils";

export default function InstantConsultationPage() {
  const router = useRouter();
  const instantDoctor = MOCK_CLINICIANS[1]; // Dr. Rajesh Menon

  const [step, setStep] = useState<"INTAKE" | "MATCHING" | "MATCHED">("INTAKE");
  const [complaint, setComplaint] = useState("");
  const [symptomOnset, setSymptomOnset] = useState("Today");
  const [hasEmergencySymptoms, setHasEmergencySymptoms] = useState(false);
  const [queuePosition, setQueuePosition] = useState(3);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Matching timer
  useEffect(() => {
    let timer: any;
    if (step === "MATCHING") {
      timer = setInterval(() => {
        setSecondsElapsed(prev => {
          if (prev >= 6) {
            setStep("MATCHED");
            clearInterval(timer);
          } else if (prev === 3) {
            setQueuePosition(1);
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  const handleStartMatching = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint.trim()) return;

    if (hasEmergencySymptoms) {
      alert("Emergency symptoms indicated. Please visit an emergency room or call 112 immediately.");
      return;
    }

    setStep("MATCHING");
    setSecondsElapsed(0);
    setQueuePosition(3);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green-100 text-brand-green-800 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-brand-green-500 animate-pulse" />
            <span>Express Teleconsultation Service (&lt;15 Mins SLA)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Instant Doctor Consultation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Connect directly with an on-call verified General Physician for viral fever, headaches, sore throat, or routine acute care.
          </p>
        </div>

        {/* Step 1: Rapid Symptom Intake */}
        {step === "INTAKE" && (
          <Card className="bg-white border-slate-200 shadow-md">
            <CardContent className="p-6 sm:p-8 space-y-5">
              <form onSubmit={handleStartMatching} className="space-y-5 text-xs">
                <div className="space-y-2">
                  <label className="font-bold text-slate-800 text-sm block">
                    What primary symptom are you experiencing?
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Mild fever (100°F) since morning, body aches, sore throat and dry cough..."
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-800 block">
                    How long have you had these symptoms?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Today", "2–3 Days", "More than a week"].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setSymptomOnset(dur)}
                        className={`py-2 px-3 rounded-lg border font-medium text-center transition-colors ${
                          symptomOnset === dur
                            ? "bg-brand-blue-600 text-white border-brand-blue-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emergency Triage Self-Declaration */}
                <div className="p-3.5 rounded-lg border border-red-200 bg-red-50/60 space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasEmergencySymptoms}
                      onChange={(e) => setHasEmergencySymptoms(e.target.checked)}
                      className="h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500 mt-0.5"
                    />
                    <span className="text-[11px] text-red-900 leading-tight">
                      I confirm the patient does NOT have severe chest tightness, sudden facial weakness, difficulty breathing, or severe uncontrolled bleeding.
                    </span>
                  </label>
                </div>

                {/* Pricing Banner */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Consultation Fee</span>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(instantDoctor.videoFee)}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">100% Refund if no doctor accepts within 15 mins</span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  variant="secondary"
                  className="w-full font-bold shadow-lg py-3.5 text-base gap-2"
                >
                  <Activity className="h-5 w-5" />
                  <span>Match with Available Doctor</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Live Doctor Matching Pool */}
        {step === "MATCHING" && (
          <Card className="bg-white border-slate-200 shadow-xl text-center p-8 sm:p-12 space-y-6">
            <div className="relative h-32 w-32 mx-auto flex items-center justify-center">
              {/* Radar Rings */}
              <div className="absolute inset-0 rounded-full border-4 border-brand-green-300 animate-ping opacity-40" />
              <div className="absolute inset-2 rounded-full border-2 border-brand-green-400 animate-pulse" />
              <div className="h-20 w-20 rounded-full bg-brand-green-500 text-white flex items-center justify-center shadow-xl">
                <Activity className="h-10 w-10 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">
                Searching Available Clinicians...
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Broadcasting your consultation request across on-call general medicine practitioners.
              </p>
            </div>

            <div className="inline-flex items-center gap-6 bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Queue Position</span>
                <span className="text-lg font-black text-slate-900 font-mono">#{queuePosition} in Line</span>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Elapsed Time</span>
                <span className="text-lg font-black text-brand-green-700 font-mono">00:0{secondsElapsed}s</span>
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep("INTAKE")}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel Consultation Request
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Clinician Matched */}
        {step === "MATCHED" && (
          <Card className="bg-white border-2 border-brand-green-400 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 bg-brand-green-100 text-brand-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Doctor Matched & Ready!
              </h2>
              <p className="text-xs text-slate-500">
                Your consultation request has been accepted by an on-call physician.
              </p>
            </div>

            {/* Doctor Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-brand-blue-700 text-white font-bold text-xl flex items-center justify-center shrink-0">
                {instantDoctor.fullName.split(" ").slice(1).map(n => n[0]).join("")}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900">{instantDoctor.fullName}</h3>
                <p className="text-xs text-brand-blue-700 font-semibold">{instantDoctor.primarySpecialty}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-blue-600" />
                  <span>Reg No: {instantDoctor.councilRegistrationNumber}</span>
                  <span>•</span>
                  <span>{instantDoctor.experienceYears} Yrs Exp</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Link href={`/room/instant-${Date.now()}`} className="block">
                <Button size="lg" variant="primary" className="w-full font-bold shadow-lg py-4 text-base gap-2">
                  <Video className="h-5 w-5" />
                  <span>Enter Video Room Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

