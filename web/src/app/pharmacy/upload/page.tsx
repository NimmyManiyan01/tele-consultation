"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  MapPin, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft,
  Building2,
  FileCheck2,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_VAULT_DOCUMENTS } from "@/data/mock-store";

export default function PharmacyUploadPage() {
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState<"VAULT" | "UPLOAD">("VAULT");
  const [selectedVaultDoc, setSelectedVaultDoc] = useState<string>("doc-vault-01");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [ocrCompleted, setOcrCompleted] = useState<boolean>(true);
  const [address, setAddress] = useState<string>("Flat 402, Green Glen Apartments, 12th Main, Indiranagar, Bengaluru, KA 560038");
  const [paymentMode, setPaymentMode] = useState<"UPI" | "CARD" | "COD">("UPI");
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);

  const handlePlaceOrder = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setOrderPlaced(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation */}
        <Link href="/pharmacy">
          <Button variant="outline" size="sm" className="text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Pharmacy Store
          </Button>
        </Link>

        {/* Page Title Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Prescription Verification Gateway</h1>
                <Badge className="bg-emerald-600 text-white text-[10px]">Mandatory Rx Check</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory verification under Rule 65 of the Drugs and Cosmetics Rules (1945).
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs border-amber-300 bg-amber-50 text-amber-800 font-semibold">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> Pharmacist SLA: &lt; 10 mins
          </Badge>
        </div>

        {orderPlaced ? (
          /* Order Confirmation Screen */
          <Card className="p-8 text-center space-y-5 border-emerald-200 bg-emerald-50/20 shadow-md">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <Badge className="bg-emerald-600 text-white text-xs mb-2">Order #KGS-RX-982103 Placed</Badge>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Prescription Verified & Order Confirmed!</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Your prescription was reviewed and verified by <strong className="text-slate-800">Pharmacist Arun S. (Reg # KA-PHARM-28190)</strong>. Medicines are currently being dispensed from our temperature-controlled facility.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs max-w-md mx-auto space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[240px] truncate">{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="font-bold text-emerald-700 font-mono">Today by 4:30 PM (2-Hour Express)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-semibold text-slate-800">Paid via UPI (₹474)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/patient/dashboard">
                <Button className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-6">
                  Go to Patient Dashboard
                </Button>
              </Link>
              <Link href="/pharmacy">
                <Button variant="outline" className="text-xs font-semibold">
                  Order More Medicines
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Main Order Placement Form */
          <div className="space-y-6">
            
            {/* Step 1: Prescription Selection / Upload */}
            <Card className="p-6 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  1. Select or Upload Doctor's Prescription
                </h2>
                <span className="text-xs text-teal-700 font-medium">Digital E-Rx / Physical Slip</span>
              </div>

              {/* Source Switcher */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSelectedSource("VAULT")}
                  className={`py-2 rounded-md transition-all ${
                    selectedSource === "VAULT" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Select from Digital Health Vault
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSource("UPLOAD")}
                  className={`py-2 rounded-md transition-all ${
                    selectedSource === "UPLOAD" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Upload New Photo / PDF
                </button>
              </div>

              {selectedSource === "VAULT" ? (
                <div className="space-y-2">
                  {MOCK_VAULT_DOCUMENTS.filter(d => d.category === "PRESCRIPTION").map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedVaultDoc(doc.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        selectedVaultDoc === doc.id
                          ? "bg-teal-50 border-teal-500 text-teal-950 shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className={`w-5 h-5 ${selectedVaultDoc === doc.id ? "text-teal-600" : "text-slate-400"}`} />
                        <div>
                          <p className="font-bold">{doc.title}</p>
                          <p className="text-[11px] text-slate-500">Issued by: {doc.issuedBy} • {doc.issueDate}</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-600 text-white text-[10px]">Digitally Signed</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">Tap to upload prescription image or PDF</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Ensure doctor name, council reg, and clinic stamp are legible</p>
                </div>
              )}

              {/* OCR Extracted Medicine Recognition */}
              {ocrCompleted && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-bold flex items-center gap-1.5 text-teal-800">
                      <ShieldCheck className="w-4 h-4 text-teal-600" /> Automated OCR Prescription Parsing
                    </span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 text-[10px]">99.4% Match</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400 block">Practitioner:</span>
                      <strong className="text-slate-800">Dr. Priya Sharma (KMC-48291)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Valid Regimen:</span>
                      <strong className="text-slate-800">Telmisartan 40mg (1-0-0), Metformin</strong>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Step 2: Delivery Address & Payment Mode */}
            <Card className="p-6 border-slate-200 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Delivery Address & Express Logistics
              </h2>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Delivery Address</label>
                <div className="relative">
                  <Input 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="text-xs pl-8"
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-3 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setPaymentMode("UPI")}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      paymentMode === "UPI" ? "bg-teal-50 border-teal-500 text-teal-900 font-bold" : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <span>Instant UPI</span>
                    <span className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode("CARD")}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      paymentMode === "CARD" ? "bg-teal-50 border-teal-500 text-teal-900 font-bold" : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <span>Credit / Debit Card</span>
                    <span className="text-[10px] text-slate-400">Visa, MasterCard, RuPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode("COD")}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      paymentMode === "COD" ? "bg-teal-50 border-teal-500 text-teal-900 font-bold" : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <span>Cash on Delivery</span>
                    <span className="text-[10px] text-slate-400">Pay at Doorstep</span>
                  </button>
                </div>
              </div>
            </Card>

            {/* Order Final Action */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs text-slate-500 block">Total Order Payable</span>
                <span className="text-xl font-black text-slate-900">₹474</span>
              </div>
              <Button 
                onClick={handlePlaceOrder}
                disabled={isVerifying}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 py-2.5 shadow-md"
              >
                {isVerifying ? "Reviewing with Pharmacist..." : "Submit Prescription & Place Order"}
                {!isVerifying && <ArrowRight className="w-4 h-4 ml-1.5" />}
              </Button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

