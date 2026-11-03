"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  RefreshCw, 
  Lock, 
  AlertCircle,
  FileCheck2,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_ABHA_PROFILE } from "@/data/mock-store";

export default function NationalAuthPage() {
  const [authMode, setAuthMode] = useState<"EXISTING_ABHA" | "AADHAAR_NEW">("EXISTING_ABHA");
  const [identifier, setIdentifier] = useState<string>("14-8921-7643-0912");
  const [step, setStep] = useState<"INPUT" | "OTP" | "VERIFIED">("INPUT");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(54);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [federatedFacilities, setFederatedFacilities] = useState<{ [hipId: string]: boolean }>({
    "IN-KA-HOSP-00192": true,
    "IN-GOV-ESAN-00001": true,
    "IN-DL-AIIMS-00812": false
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "OTP" && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = () => {
    setStep("OTP");
    setTimer(60);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep("VERIFIED");
    }, 1200);
  };

  const toggleFacility = (hipId: string) => {
    setFederatedFacilities(prev => ({ ...prev, [hipId]: !prev[hipId] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full space-y-6">
        
        {/* National ABDM Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-900 mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Ayushman Bharat Digital Mission (ABDM) • Milestone M1/M2</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">National Health ID Gateway</h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Connect your 14-digit Ayushman Bharat Health Account (ABHA) for longitudinal health record federation across India.
          </p>
        </div>

        {/* STEP 1: Identification Input */}
        {step === "INPUT" && (
          <Card className="p-6 space-y-6 shadow-md border-slate-200">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("EXISTING_ABHA");
                  setIdentifier("14-8921-7643-0912");
                }}
                className={`py-2 rounded-md transition-all ${
                  authMode === "EXISTING_ABHA" 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Link Existing ABHA ID
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("AADHAAR_NEW");
                  setIdentifier("5412-8923-4109");
                }}
                className={`py-2 rounded-md transition-all ${
                  authMode === "AADHAAR_NEW" 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Create via Aadhaar
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {authMode === "EXISTING_ABHA" ? "14-Digit ABHA Number / PHR Address" : "12-Digit Aadhaar Number"}
                </label>
                <div className="relative">
                  <Input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={authMode === "EXISTING_ABHA" ? "14-8921-7643-0912" : "XXXX-XXXX-XXXX"}
                    className="font-mono text-sm tracking-wider pl-9"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {authMode === "EXISTING_ABHA" 
                    ? "Enter your 14-digit number or ABHA address (e.g. name@abdm)" 
                    : "An OTP will be sent to the mobile number registered with UIDAI"}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  Consent Notice: Your biometric data is never stored. Authentication is executed strictly through official NHA / UIDAI secure gateways under the DPDP Act 2023.
                </span>
              </div>
            </div>

            <Button 
              onClick={handleSendOtp} 
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs py-2.5 shadow-sm"
            >
              Request Aadhaar OTP <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Card>
        )}

        {/* STEP 2: OTP Verification */}
        {step === "OTP" && (
          <Card className="p-6 space-y-6 shadow-md border-slate-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center mb-2">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Enter Verification Code</h2>
              <p className="text-xs text-slate-600">
                A 6-digit Aadhaar OTP was sent to mobile linked with <span className="font-mono font-bold text-slate-800">{identifier}</span>
              </p>
            </div>

            {/* 6-box OTP input */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 text-center font-mono font-bold text-lg border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white text-slate-900"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-2">
              <span>Didn't receive code?</span>
              {timer > 0 ? (
                <span className="font-mono text-slate-500">Resend in 00:{timer < 10 ? `0${timer}` : timer}</span>
              ) : (
                <button 
                  onClick={() => setTimer(60)} 
                  className="text-teal-700 font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs py-2.5"
              >
                {isVerifying ? "Verifying with NHA Gateway..." : "Verify & Link ABHA Account"}
              </Button>
              <button
                type="button"
                onClick={() => setStep("INPUT")}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-700 py-1"
              >
                Change Identifier
              </button>
            </div>
          </Card>
        )}

        {/* STEP 3: Verified ABHA Profile & Consent Federation */}
        {step === "VERIFIED" && (
          <Card className="p-6 space-y-6 shadow-md border-emerald-200 bg-gradient-to-b from-white to-emerald-50/20">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{MOCK_ABHA_PROFILE.fullName}</h2>
                    <Badge className="bg-emerald-600 text-white text-[10px]">ABDM Verified</Badge>
                  </div>
                  <p className="text-xs font-mono text-slate-600 mt-0.5">{MOCK_ABHA_PROFILE.abhaAddress}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">ABHA Number</span>
                <span className="font-mono text-xs font-bold text-slate-800">{MOCK_ABHA_PROFILE.abhaNumber}</span>
              </div>
            </div>

            {/* Linked Health Facilities */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Federated Health Facilities ({MOCK_ABHA_PROFILE.linkedFacilities.length})
                </label>
                <span className="text-[11px] text-teal-700 font-medium">ABDM Consent Manager Active</span>
              </div>
              
              <div className="space-y-2">
                {MOCK_ABHA_PROFILE.linkedFacilities.map((fac) => {
                  const isLinked = federatedFacilities[fac.hipId];
                  return (
                    <div 
                      key={fac.hipId} 
                      className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="font-semibold text-slate-800">{fac.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">HIP ID: {fac.hipId} • {fac.recordCount} records</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleFacility(fac.hipId)}
                          className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                            isLinked 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-300" 
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {isLinked ? "Linked" : "Paused"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link href="/vault" className="flex-1">
                <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold">
                  <FileCheck2 className="w-4 h-4 mr-1.5" /> View Health Vault Records
                </Button>
              </Link>
              <Link href="/patient/dashboard" className="flex-1">
                <Button variant="outline" className="w-full text-xs font-semibold">
                  Return to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}

