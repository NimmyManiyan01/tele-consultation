"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  Search, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  AlertCircle, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  TestTube2,
  Thermometer,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_DIAGNOSTIC_PACKAGES } from "@/data/mock-store";
import { DiagnosticTestPackage } from "@/types";

export default function DiagnosticsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedPkg, setExpandedPkg] = useState<string | null>("diag-pkg-01");
  const [activeBookingPkg, setActiveBookingPkg] = useState<DiagnosticTestPackage | null>(null);
  
  // Booking modal form state
  const [bookingDate, setBookingDate] = useState<string>("Tomorrow, 02 Nov");
  const [bookingSlot, setBookingSlot] = useState<string>("07:00 AM - 08:00 AM");
  const [bookingAddress, setBookingAddress] = useState<string>("12th Main, Indiranagar, Bengaluru, KA 560038");
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const categories = [
    { id: "ALL", label: "All Packages" },
    { id: "FULL_BODY", label: "Full Body Health Check" },
    { id: "DIABETES", label: "Diabetes Panels" },
    { id: "CARDIAC", label: "Heart & Lipid Profiles" },
    { id: "THYROID", label: "Thyroid Care" }
  ];

  const timeSlots = [
    "06:30 AM - 07:30 AM",
    "07:30 AM - 08:30 AM",
    "08:30 AM - 09:30 AM",
    "09:30 AM - 10:30 AM"
  ];

  const filteredPackages = MOCK_DIAGNOSTIC_PACKAGES.filter((pkg) => {
    const matchesCat = selectedCategory === "ALL" || pkg.category === selectedCategory;
    const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.inclusions.some(inc => inc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleConfirmBooking = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBookingSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Diagnostics Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-teal-700/80 text-teal-100 border border-teal-500/40 text-xs py-0.5">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-300" /> NABL & CAP Accredited Labs
              </Badge>
              <Badge className="bg-emerald-600/80 text-white text-xs py-0.5">
                100% Barcoded Vacutainers
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">At-Home Diagnostic Health Checkups</h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Certified phlebotomists collect blood & urine samples in temperature-regulated cold boxes right at your doorstep. Verified digital reports sync directly to your Health Vault within 24 hours.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/vault">
              <Button variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold">
                <FileText className="w-4 h-4 mr-1.5" /> View Previous Lab Reports
              </Button>
            </Link>
          </div>
        </div>

        {/* NABL Quality Commitment Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <TestTube2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Pre-Barcoded Vacutainers</p>
              <p className="text-[11px] text-slate-500">Zero sample mix-up guarantee</p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Cold-Chain Temperature Box</p>
              <p className="text-[11px] text-slate-500">Maintained strictly at 2°C – 8°C</p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800">NABL Quality Audited</p>
              <p className="text-[11px] text-slate-500">ISO 15189 verified results</p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Navigation */}
        <div className="space-y-4">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests by package name or specific biomarker (e.g. HbA1c, TSH, Lipid, CBC, Creatinine)..."
              className="pl-10 text-xs sm:text-sm h-11 border-slate-300 rounded-xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-teal-700 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPackages.map((pkg) => {
            const isExpanded = expandedPkg === pkg.id;
            const discountPercent = Math.round(((pkg.mrp - pkg.price) / pkg.mrp) * 100);
            return (
              <Card key={pkg.id} className="p-5 border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-teal-700 text-white text-[10px] py-0.5">
                        {pkg.parameterCount} Tests Included
                      </Badge>
                      {pkg.fastingRequired ? (
                        <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-300">
                          <Clock className="w-3 h-3 mr-1" /> {pkg.fastingHours} hrs Fasting Required
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300">
                          Non-Fasting
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Save {discountPercent}%
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900">{pkg.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Sample: {pkg.sampleType} • Turnaround: Reports in {pkg.turnaroundHours} hrs
                    </p>
                  </div>

                  {/* Included Tests List */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <div 
                      onClick={() => setExpandedPkg(isExpanded ? null : pkg.id)}
                      className="flex items-center justify-between cursor-pointer font-semibold text-slate-800"
                    >
                      <span>Key Biomarkers & Test Panels</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>

                    {isExpanded && (
                      <ul className="mt-2 space-y-1.5 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                        {pkg.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900">₹{pkg.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{pkg.mrp}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Free Home Sample Pickup</span>
                  </div>

                  <Button 
                    onClick={() => {
                      setActiveBookingPkg(pkg);
                      setBookingSuccess(false);
                    }}
                    className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4"
                  >
                    Book Home Collection
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

      </div>

      {/* Home Sample Collection Booking Modal */}
      {activeBookingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-700" />
                <h2 className="text-sm font-bold text-slate-900">Schedule Phlebotomist Visit</h2>
              </div>
              <button 
                onClick={() => setActiveBookingPkg(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Sample Collection Scheduled!</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Certified phlebotomist assigned for <strong className="text-slate-800">{activeBookingPkg.title}</strong> on <strong className="text-slate-800">{bookingDate}</strong> during <strong className="text-slate-800">{bookingSlot}</strong>.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 text-left space-y-1">
                  <p><strong>Fasting Notice:</strong> {activeBookingPkg.fastingRequired ? `Please maintain ${activeBookingPkg.fastingHours} hours of overnight water-only fasting.` : "No fasting required."}</p>
                  <p><strong>Vault Integration:</strong> Results will be automatically delivered to your encrypted Health Vault.</p>
                </div>

                <div className="pt-2 flex gap-2">
                  <Link href="/vault" className="flex-1">
                    <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold">
                      Open Health Vault
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setActiveBookingPkg(null)} className="text-xs font-semibold flex-1">
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4 text-xs">
                <div className="bg-teal-50 p-3 rounded-lg border border-teal-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-teal-950">{activeBookingPkg.title}</p>
                    <p className="text-[11px] text-teal-700">{activeBookingPkg.parameterCount} Tests • {activeBookingPkg.sampleType}</p>
                  </div>
                  <span className="font-mono text-base font-black text-teal-950">₹{activeBookingPkg.price}</span>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Collection Date</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Today, 01 Nov", "Tomorrow, 02 Nov", "Mon, 03 Nov"].map((date) => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => setBookingDate(date)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          bookingDate === date ? "bg-teal-700 text-white font-bold" : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Morning Time Slot Selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Morning Slot (Recommended for Fasting)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingSlot(slot)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          bookingSlot === slot ? "bg-teal-700 text-white font-bold" : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address Input */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Sample Collection Address</label>
                  <Input 
                    value={bookingAddress}
                    onChange={(e) => setBookingAddress(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Total to Pay</span>
                    <span className="text-base font-black text-slate-900">₹{activeBookingPkg.price}</span>
                  </div>
                  <Button 
                    onClick={handleConfirmBooking}
                    disabled={isBooking}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 shadow-sm"
                  >
                    {isBooking ? "Confirming Slot..." : "Confirm Phlebotomist Visit"}
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

