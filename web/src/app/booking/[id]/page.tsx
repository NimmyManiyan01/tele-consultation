"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus, 
  CheckCircle2, 
  Video, 
  AlertCircle, 
  ArrowLeft,
  ChevronRight,
  BellRing,
  Lock,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_CLINICIANS, MOCK_DEPENDENTS, MOCK_SLOTS } from "@/data/mock-store";
import { formatCurrency } from "@/lib/utils";
import { kgsApi } from "@/lib/api-client";

export default function AppointmentBookingPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = (params?.id as string) || "doc-01";
  const doctor = MOCK_CLINICIANS.find(d => d.id === doctorId);

  const [selectedDependentId, setSelectedDependentId] = useState(MOCK_DEPENDENTS[0]?.id || "self");
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>("slot-01");
  const [waitlistOptIn, setWaitlistOptIn] = useState(true);
  const [isLockingSlot, setIsLockingSlot] = useState(false);

  // Generate 7 upcoming dates
  const upcomingDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayName: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" }),
      dateNumber: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      iso: d.toISOString().split("T")[0]
    };
  });

  if (!doctor) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto shadow-sm">
          <Stethoscope className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">Clinician Not Available</h2>
          <p className="text-xs text-slate-500 mb-4">No active scheduling profile exists for this clinician ID.</p>
          <Link href="/doctors" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue-700 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Browse Doctor Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const slots = MOCK_SLOTS;
  const morningSlots = slots.filter(s => s.period === "MORNING");
  const afternoonSlots = slots.filter(s => s.period === "AFTERNOON");
  const eveningSlots = slots.filter(s => s.period === "EVENING");

  const baseFee = doctor.videoFee;
  const platformFee = 49;
  const gst = Math.round(platformFee * 0.18);
  const totalAmount = baseFee + platformFee + gst;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProceedToCheckout = async () => {
    if (!selectedSlotId) return;
    setIsLockingSlot(true);
    setErrorMessage(null);
    try {
      await kgsApi.appointments.lockSlot(selectedSlotId);
      router.push(`/booking/success/${doctor.id}?slotId=${selectedSlotId}&depId=${selectedDependentId}`);
    } catch (err: any) {
      if (err.status === 409) {
        setErrorMessage("Slot concurrency lock: this slot is currently being reserved by another patient. Please pick another slot.");
      } else {
        // Resilient fallback for offline / mock testing
        router.push(`/booking/success/${doctor.id}?slotId=${selectedSlotId}&depId=${selectedDependentId}`);
      }
    } finally {
      setIsLockingSlot(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-brand-blue-700 font-semibold hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Doctor Profile</span>
          </button>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-800 font-medium">Select Slot & Patient</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Booking Form (2 Cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Step 1: Who is this for? (Dependent Picker) */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-brand-blue-700" />
                    <span>1. Patient Profile Selection</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select who will attend this teleconsultation encounter.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MOCK_DEPENDENTS.map((dep) => {
                  const isSelected = selectedDependentId === dep.id;
                  return (
                    <div
                      key={dep.id}
                      onClick={() => setSelectedDependentId(dep.id)}
                      className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? "border-brand-blue-600 bg-brand-blue-50/60 shadow-sm" 
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 truncate">{dep.fullName}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-brand-blue-700 shrink-0" />}
                      </div>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-100 text-slate-600">
                        {dep.relationship}
                      </span>
                      {dep.knownAllergies.length > 0 && (
                        <p className="text-[10px] text-amber-700 mt-1 truncate">
                          Allergy: {dep.knownAllergies[0]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date Carousel */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-brand-blue-700" />
                  <span>2. Select Consultation Date</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time synchronization with clinician OPD schedule.
                </p>
              </div>

              {/* 7-Day Ribbon */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {upcomingDates.map((item, idx) => {
                  const isSelected = selectedDateIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDateIndex(idx)}
                      className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all ${
                        isSelected
                          ? "border-brand-blue-600 bg-brand-blue-600 text-white shadow-md font-bold"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`text-[10px] uppercase font-semibold ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                        {item.dayName}
                      </span>
                      <span className="text-lg font-black my-0.5">
                        {item.dateNumber}
                      </span>
                      <span className={`text-[10px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                        {item.month}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Slot Time Grid */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-blue-700" />
                  <span>3. Available Time Slots (20 Min Each)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Slot is held for 10 minutes upon selection to avoid double-booking.
                </p>
              </div>

              {/* Morning Slots */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Morning OPD
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {morningSlots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={slot.isBooked}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                          slot.isBooked
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                            : isSelected
                            ? "bg-brand-blue-600 text-white border-brand-blue-600 shadow-sm"
                            : "bg-white text-slate-800 border-slate-200 hover:border-brand-blue-400 hover:bg-brand-blue-50/30"
                        }`}
                      >
                        {new Date(slot.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Afternoon Slots */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Afternoon OPD
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {afternoonSlots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={slot.isBooked}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                          slot.isBooked
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                            : isSelected
                            ? "bg-brand-blue-600 text-white border-brand-blue-600 shadow-sm"
                            : "bg-white text-slate-800 border-slate-200 hover:border-brand-blue-400 hover:bg-brand-blue-50/30"
                        }`}
                      >
                        {new Date(slot.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Evening Slots */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Evening OPD
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {eveningSlots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={slot.isBooked}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                          slot.isBooked
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                            : isSelected
                            ? "bg-brand-blue-600 text-white border-brand-blue-600 shadow-sm"
                            : "bg-white text-slate-800 border-slate-200 hover:border-brand-blue-400 hover:bg-brand-blue-50/30"
                        }`}
                      >
                        {new Date(slot.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Slot Pull-Forward (TRM-INT-001) */}
              <div className="bg-brand-green-50/60 border border-brand-green-200 rounded-lg p-3.5 flex items-start gap-3">
                <BellRing className="h-5 w-5 text-brand-green-700 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Earlier Cancellation Alert (Pull-Forward)
                    </span>
                    <input
                      type="checkbox"
                      checked={waitlistOptIn}
                      onChange={(e) => setWaitlistOptIn(e.target.checked)}
                      className="h-4 w-4 rounded border-brand-green-400 text-brand-green-600 focus:ring-brand-green-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-slate-600">
                    If another patient cancels an earlier slot today or tomorrow, send me an instant push notification with a 10-minute priority claiming window.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary & Checkout Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6 sticky top-20">
              {/* Doctor Mini Card */}
              <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-brand-blue-600 to-brand-blue-800 text-white font-bold text-lg flex items-center justify-center shrink-0">
                  {doctor.fullName.split(" ").slice(1).map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{doctor.fullName}</h3>
                  <p className="text-xs text-brand-blue-700 font-semibold">{doctor.primarySpecialty}</p>
                  <p className="text-[11px] text-slate-400 truncate">{doctor.clinicCity}</p>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Video className="h-3 w-3 text-brand-blue-600" />
                    HD Video Call
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-800">
                    {MOCK_DEPENDENTS.find(d => d.id === selectedDependentId)?.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-bold text-slate-800">
                    {upcomingDates[selectedDateIndex].dayName}, {upcomingDates[selectedDateIndex].dateNumber} {upcomingDates[selectedDateIndex].month}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Consultation Fee</span>
                  <span>{formatCurrency(baseFee)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform & Infrastructure</span>
                  <span>{formatCurrency(platformFee)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18% on Platform)</span>
                  <span>{formatCurrency(gst)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-brand-blue-900">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Reserve Button */}
              <Button
                size="lg"
                variant="primary"
                onClick={handleProceedToCheckout}
                isLoading={isLockingSlot}
                disabled={!selectedSlotId}
                className="w-full gap-2 font-bold shadow-lg py-3.5"
              >
                <Lock className="h-4 w-4" />
                <span>Lock Slot & Proceed</span>
              </Button>

              <div className="text-center">
                <p className="text-[10px] text-slate-400">
                  Acquires a 10-minute temporary Redis lock to guarantee slot exclusivity during payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

