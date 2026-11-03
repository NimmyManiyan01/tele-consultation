"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Calendar, 
  Video, 
  Building2, 
  Clock, 
  Award, 
  GraduationCap, 
  Languages, 
  CheckCircle2, 
  ArrowLeft,
  Share2,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_CLINICIANS, MOCK_REVIEWS } from "@/data/mock-store";
import { formatCurrency } from "@/lib/utils";

export default function DoctorProfilePage() {
  const params = useParams();
  const doctorId = (params?.id as string) || "doc-01";
  const doctor = MOCK_CLINICIANS.find(d => d.id === doctorId);
  const reviews = doctor ? MOCK_REVIEWS.filter(r => r.doctorId === doctor.id) : [];

  const [activeTab, setActiveTab] = useState<"overview" | "clinics" | "reviews">("overview");

  if (!doctor) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto shadow-sm">
          <Stethoscope className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">Clinician Not Found</h2>
          <p className="text-xs text-slate-500 mb-4">No clinician profile exists with identifier &ldquo;{doctorId}&rdquo;.</p>
          <Link href="/doctors" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue-700 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Doctor Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/doctors" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue-700 hover:text-brand-blue-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Doctor Directory</span>
          </Link>
        </div>

        {/* Doctor Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 text-white font-bold text-3xl sm:text-4xl flex items-center justify-center shrink-0 shadow-md">
              {doctor.fullName.split(" ").slice(1).map(n => n[0]).join("")}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {doctor.fullName}
                </h1>
                <Badge variant="verified" className="gap-1.5 py-1 px-3 text-xs">
                  <ShieldCheck className="h-4 w-4 text-brand-blue-600" />
                  <span>Verified Practitioner • {doctor.councilRegistrationNumber}</span>
                </Badge>
              </div>

              <p className="text-sm font-bold text-brand-blue-700">
                {doctor.primarySpecialty} • {doctor.subSpecialties.join(", ")}
              </p>

              <p className="text-xs text-slate-600">
                {doctor.degrees.join(", ")} — Registered with <span className="font-semibold text-slate-800">{doctor.stateMedicalCouncil}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1.5 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-md font-bold">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  {doctor.rating} / 5.0
                </span>
                <span>({doctor.reviewCount} verified patient ratings)</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-brand-green-600" />
                  {doctor.experienceYears} Years Overall Experience
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Languages className="h-4 w-4 text-slate-400" />
                  {doctor.languages.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column: Tabs Content on Left, Booking Box on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tabs & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Buttons */}
            <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 transition-colors relative ${
                  activeTab === "overview" 
                    ? "text-brand-blue-700 border-b-2 border-brand-blue-700" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Overview & Biography
              </button>
              <button
                onClick={() => setActiveTab("clinics")}
                className={`pb-3 transition-colors relative ${
                  activeTab === "clinics" 
                    ? "text-brand-blue-700 border-b-2 border-brand-blue-700" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Clinics & Hospital
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 transition-colors relative ${
                  activeTab === "reviews" 
                    ? "text-brand-blue-700 border-b-2 border-brand-blue-700" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Patient Reviews ({reviews.length})
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">About the Clinician</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {doctor.bio}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h3 className="text-base font-bold text-slate-900 mb-3">Clinical Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.subSpecialties.concat([doctor.primarySpecialty, "Preventive Telehealth", "Outpatient Care"]).map((spec, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-green-600" />
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h3 className="text-base font-bold text-slate-900 mb-3">Education & Fellowships</h3>
                  <div className="space-y-3">
                    {doctor.degrees.map((deg, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs text-slate-700">
                        <GraduationCap className="h-4 w-4 text-brand-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900">{deg}</p>
                          <p className="text-slate-500">Government Medical College & Allied Health University</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Clinics */}
            {activeTab === "clinics" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-2">Primary Consultation Location</h3>
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-brand-blue-600 shrink-0 mt-1" />
                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold text-sm text-slate-900">{doctor.clinicName}</h4>
                    <p className="text-slate-600">{doctor.clinicAddress}</p>
                    <p className="text-slate-500">Consultation Timings: Monday – Saturday (10:00 AM – 7:00 PM)</p>
                    <div className="pt-2">
                      <span className="font-semibold text-slate-800">In-Clinic Consultation Fee: </span>
                      <span className="font-bold text-brand-blue-800">{formatCurrency(doctor.inClinicFee)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-brand-blue-100 text-brand-blue-800 font-bold text-xs flex items-center justify-center">
                          {rev.patientDisplayName[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{rev.patientDisplayName}</p>
                          <p className="text-[10px] text-slate-400">{rev.createdAt}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-xs font-bold">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {rev.rating}.0
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Bedside Manner: <strong>{rev.bedsideMannerRating}/5</strong></span>
                      <span>Punctuality: <strong>{rev.punctualityRating}/5</strong></span>
                      <span className="text-brand-green-700 font-semibold flex items-center gap-1 ml-auto">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified Consultation Encounter
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Booking Action Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6 sticky top-20">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Select Consultation Mode
                </span>
                <div className="mt-2 p-3 rounded-lg border-2 border-brand-blue-600 bg-brand-blue-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-brand-blue-700" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">HD Video Teleconsult</p>
                      <p className="text-[10px] text-slate-500">LiveKit WebRTC Encrypted</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-brand-blue-900">
                    {formatCurrency(doctor.videoFee)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Next Available Slot:
                  </span>
                  <span className="font-bold text-brand-green-700">{doctor.nextAvailableSlot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Slot Duration:
                  </span>
                  <span className="font-medium text-slate-800">20 Minutes</span>
                </div>
              </div>

              <Link href={`/booking/${doctor.id}`} className="block">
                <Button size="lg" variant="primary" className="w-full gap-2 font-bold shadow-lg py-3.5">
                  <Calendar className="h-4 w-4" />
                  <span>Book Appointment Slot</span>
                </Button>
              </Link>

              <div className="text-center">
                <p className="text-[11px] text-slate-400">
                  Guaranteed zero double-booking with 10-minute slot lock protection. 100% refund if cancelled up to 2 hours before OPD.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

