"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Download, 
  Share2, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  QrCode, 
  PhoneCall,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_CLINICIANS, MOCK_DEPENDENTS } from "@/data/mock-store";
import { formatCurrency } from "@/lib/utils";

export default function BookingSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = (params?.id as string) || "appt-5412";
  const doctor = MOCK_CLINICIANS[0];
  const patient = MOCK_DEPENDENTS[0];

  const handleDownloadCalendar = () => {
    // Generate .ics calendar payload
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kaizentrix//Teleconsultation Platform//EN
BEGIN:VEVENT
SUMMARY:Teleconsultation with ${doctor.fullName}
DESCRIPTION:HD Video Consultation on Kaizentrix Telehealth Platform. Access room: https://telehealth.kaizentrix.com/room/${appointmentId}
DTSTART:20261101T100000Z
DTEND:20261101T102000Z
LOCATION:Kaizentrix Encrypted WebRTC Room
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `appointment-${appointmentId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        {/* Animated Success Banner */}
        <div className="text-center space-y-3 mb-8">
          <div className="h-16 w-16 bg-brand-green-100 text-brand-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-brand-green-50">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Appointment Confirmed & Reserved!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Your appointment has been locked with zero double-booking and verified with the clinic schedule.
          </p>
          <div className="inline-flex items-center gap-2 bg-brand-blue-50 border border-brand-blue-200 px-3 py-1 rounded-full text-xs font-semibold text-brand-blue-800">
            <span>Appointment ID:</span>
            <span className="font-mono">{appointmentId.toUpperCase()}</span>
          </div>
        </div>

        {/* Voucher Pass Card */}
        <Card className="overflow-hidden border-2 border-slate-200 shadow-xl bg-white mb-8">
          {/* Top Pass Header */}
          <div className="bg-gradient-to-r from-brand-blue-700 to-brand-blue-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue-200">
                Official Digital Appointment Pass
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {doctor.fullName}
              </h2>
              <p className="text-xs text-brand-blue-100">
                {doctor.primarySpecialty} • {doctor.degrees.join(", ")}
              </p>
            </div>
            <Badge variant="verified" className="bg-white/10 text-white border-white/20 px-3 py-1 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-green-400 mr-1" />
              <span>{doctor.councilRegistrationNumber}</span>
            </Badge>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Key Encounter Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Date & Time</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <Calendar className="h-4 w-4 text-brand-blue-600" />
                  Today, 4:30 PM
                </span>
                <span className="text-[11px] text-slate-500">20 Minutes Session</span>
              </div>

              <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Encounter Mode</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <Video className="h-4 w-4 text-brand-blue-600" />
                  HD Video Teleconsult
                </span>
                <span className="text-[11px] text-brand-green-700 font-medium">LiveKit SFU Encrypted</span>
              </div>

              <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Patient Name</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <UserCheck className="h-4 w-4 text-brand-blue-600" />
                  {patient.fullName}
                </span>
                <span className="text-[11px] text-slate-500">Age: 36 • Male</span>
              </div>
            </div>

            {/* QR Code and Joining Instructions */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-slate-200 bg-white">
              {/* QR Representation */}
              <div className="h-28 w-28 p-2 rounded-lg border-2 border-slate-800 flex flex-col items-center justify-center shrink-0 bg-white shadow-inner">
                <QrCode className="h-20 w-20 text-slate-900" />
                <span className="text-[8px] font-mono font-bold tracking-tighter text-slate-500 mt-0.5">CHECK-IN PASS</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <h3 className="font-bold text-sm text-slate-900">
                  Pre-Consultation Instructions:
                </h3>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  <li>Please join the <strong>Virtual Waiting Room</strong> 5 minutes before your scheduled slot.</li>
                  <li>Ensure your device camera and microphone are authorized in your browser.</li>
                  <li>Have your past medical records or current prescription slips handy for upload.</li>
                  <li>A confirmation SMS and WhatsApp message have been dispatched to your registered phone.</li>
                </ul>
              </div>
            </div>

            {/* Calendar & Share Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCalendar}
                className="gap-2 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Add to Calendar (.ics)</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => alert("Appointment details copied to clipboard!")}
                  className="gap-1.5 text-xs text-slate-600"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Pass</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Primary Action CTAs */}
        <div className="space-y-3">
          <Link href={`/room/${appointmentId}`} className="block">
            <Button size="lg" variant="primary" className="w-full gap-2 font-bold shadow-lg py-4 text-base">
              <Video className="h-5 w-5" />
              <span>Enter Pre-Call Waiting Room Now</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/patient/dashboard">
              <Button variant="outline" size="md" className="w-full justify-center">
                Go to Patient Dashboard
              </Button>
            </Link>
            <Link href={`/prescription/rx-98421`}>
              <Button variant="outline" size="md" className="w-full justify-center gap-1.5">
                <FileText className="h-4 w-4 text-brand-blue-600" />
                <span>View Sample e-Prescription</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

