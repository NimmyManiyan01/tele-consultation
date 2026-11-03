"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Video, 
  Calendar, 
  Clock, 
  Star, 
  ChevronRight, 
  Activity, 
  Heart, 
  Baby, 
  Sparkles, 
  Eye, 
  Brain, 
  Bone, 
  Pill,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_CLINICIANS } from "@/data/mock-store";
import { EmergencyTakeoverModal } from "@/components/ui/emergency-banner";
import { formatCurrency } from "@/lib/utils";

const SPECIALTIES = [
  { name: "General Medicine", icon: Activity, count: "48 Doctors", route: "/doctors?specialty=General+Medicine" },
  { name: "Cardiology", icon: Heart, count: "24 Doctors", route: "/doctors?specialty=Cardiology" },
  { name: "Pediatrics", icon: Baby, count: "32 Doctors", route: "/doctors?specialty=Pediatrics" },
  { name: "Dermatology", icon: Sparkles, count: "29 Doctors", route: "/doctors?specialty=Dermatology" },
  { name: "Orthopedics", icon: Bone, count: "18 Doctors", route: "/doctors?specialty=Orthopedics" },
  { name: "Neurology", icon: Brain, count: "14 Doctors", route: "/doctors?specialty=Neurology" },
  { name: "Ophthalmology", icon: Eye, count: "16 Doctors", route: "/doctors?specialty=Ophthalmology" },
  { name: "Diabetology", icon: Pill, count: "22 Doctors", route: "/doctors?specialty=Diabetology" },
];

export default function GlobalLandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [emergencyKeyword, setEmergencyKeyword] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emergencyTerms = ["chest pain", "heart attack", "stroke", "severe breathing", "unconscious", "bleeding"];
    const matched = emergencyTerms.find(term => searchQuery.toLowerCase().includes(term));
    if (matched) {
      setEmergencyKeyword(matched);
      setEmergencyModalOpen(true);
      return;
    }
    // Navigate to /doctors
    window.location.href = `/doctors?query=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(selectedCity)}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-blue-50/60 via-white to-slate-50 pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue-100/80 text-brand-blue-800 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4 text-brand-blue-600" />
              <span>Certified Registered Medical Practitioners (MoHFW Telemedicine 2020)</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Enterprise-Grade Teleconsultations. <br className="hidden sm:inline" />
              <span className="text-brand-blue-700">Verified Doctors. Zero Compromise.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Connect with top medical council-registered specialists across India within 15 minutes or schedule scheduled appointments with guaranteed zero double-booking.
            </p>
          </div>

          {/* Search Box Form */}
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 sm:p-3 max-w-4xl mx-auto flex flex-col md:flex-row gap-2.5"
          >
            {/* City Selector */}
            <div className="flex items-center gap-2 px-3 py-2 border-b md:border-b-0 md:border-r border-slate-200 md:w-1/3">
              <MapPin className="h-5 w-5 text-brand-blue-600 shrink-0" />
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer"
                aria-label="Select Clinic City"
              >
                <option value="Bengaluru">Bengaluru, Karnataka</option>
                <option value="Mumbai">Mumbai, Maharashtra</option>
                <option value="Delhi-NCR">Delhi NCR</option>
                <option value="Chennai">Chennai, Tamil Nadu</option>
                <option value="Hyderabad">Hyderabad, Telangana</option>
              </select>
            </div>

            {/* Keyword Search Input */}
            <div className="flex items-center gap-2 px-3 py-2 flex-1">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <Input
                type="text"
                placeholder="Search doctors, clinical specialties, or symptoms (e.g. Cardiologist, Fever, Cough)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 p-0 text-sm font-normal text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Search Submit CTA */}
            <Button type="submit" size="lg" variant="primary" className="gap-2 shrink-0 px-6 font-semibold shadow-md">
              <Search className="h-4 w-4" />
              <span>Search Doctors</span>
            </Button>
          </form>

          {/* Quick Metrics */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-green-500" />
              450+ Verified Practitioners Online
            </span>
            <span className="flex items-center gap-1.5">
              <Video className="h-4 w-4 text-brand-blue-600" />
              HD Encrypted WebRTC Video (LiveKit SFU)
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-green-600" />
              100% Digitally Signed Prescriptions
            </span>
          </div>
        </div>
      </section>

      {/* Instant Acute Care Promo Banner */}
      <section className="bg-brand-blue-800 text-white py-6">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-brand-green-500 flex items-center justify-center shrink-0 shadow-md">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Need an immediate doctor consultation?</h3>
                <span className="bg-brand-green-400 text-brand-green-950 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                  &lt;15 Mins Wait
                </span>
              </div>
              <p className="text-xs text-brand-blue-100">
                Connect instantly with an on-call General Physician for seasonal viral, fever, stomach flu, or acute headaches.
              </p>
            </div>
          </div>
          <Link href="/consult/instant" className="shrink-0">
            <Button variant="secondary" size="lg" className="gap-2 font-bold shadow-lg">
              <span>Start Instant Consult</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Clinical Specialties Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Consult by Medical Specialty
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Explore experienced clinicians across primary healthcare and surgical subspecialties.
              </p>
            </div>
            <Link 
              href="/doctors" 
              className="text-sm font-semibold text-brand-blue-700 hover:text-brand-blue-900 flex items-center gap-1"
            >
              <span>View All Specialties</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {SPECIALTIES.map((spec) => {
              const Icon = spec.icon;
              return (
                <Link 
                  key={spec.name} 
                  href={spec.route}
                  className="group p-5 rounded-xl border border-slate-200 hover:border-brand-blue-400 bg-white hover:bg-brand-blue-50/40 transition-all duration-150 shadow-sm hover:shadow"
                >
                  <div className="h-12 w-12 rounded-lg bg-brand-blue-50 text-brand-blue-700 group-hover:bg-brand-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 group-hover:text-brand-blue-700">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {spec.count}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Verified Clinicians Feed */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Featured Verified Practitioners
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Clinicians verified with State Medical Councils and qualified for telemedicine encounters.
              </p>
            </div>
            <Link 
              href="/doctors" 
              className="text-sm font-semibold text-brand-blue-700 hover:text-brand-blue-900 flex items-center gap-1"
            >
              <span>Explore Directory</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_CLINICIANS.map((doc) => (
              <Card key={doc.id} className="overflow-hidden border border-slate-200 hover:border-brand-blue-300 transition-all hover:shadow-md bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Doctor Initials Avatar */}
                    <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-brand-blue-600 to-brand-blue-800 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-inner">
                      {doc.fullName.split(" ").slice(1).map(n => n[0]).join("")}
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-base text-slate-900 hover:text-brand-blue-700">
                            <Link href={`/doctor/${doc.id}`}>{doc.fullName}</Link>
                          </h3>
                          <p className="text-xs font-semibold text-brand-blue-700">
                            {doc.primarySpecialty} • {doc.experienceYears} Years Exp
                          </p>
                        </div>
                        <Badge variant="verified" className="gap-1 text-[11px] shrink-0">
                          <ShieldCheck className="h-3 w-3 text-brand-blue-600" />
                          <span>{doc.councilRegistrationNumber}</span>
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-500">
                        {doc.degrees.join(", ")}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          {doc.rating}
                        </span>
                        <span>({doc.reviewCount} verified reviews)</span>
                        <span>•</span>
                        <span className="text-slate-500">{doc.languages.join(", ")}</span>
                      </div>

                      <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-500 block">Consultation Fee</span>
                          <span className="text-sm font-bold text-slate-900">
                            {formatCurrency(doc.videoFee)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/doctor/${doc.id}`}>
                            <Button size="sm" variant="outline">
                              View Profile
                            </Button>
                          </Link>
                          <Link href={`/booking/${doc.id}`}>
                            <Button size="sm" variant="primary" className="gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>Book Slot</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Modal Intercept */}
      <EmergencyTakeoverModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        detectedKeyword={emergencyKeyword}
      />
    </div>
  );
}

