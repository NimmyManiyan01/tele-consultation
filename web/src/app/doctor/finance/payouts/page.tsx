"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  IndianRupee, 
  ArrowUpRight, 
  Download, 
  CheckCircle2, 
  Clock, 
  Building2, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  Search, 
  HelpCircle,
  TrendingUp,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_PAYOUTS } from "@/data/mock-store";
import { kgsApi } from "@/lib/api-client";

export default function DoctorPayoutsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PROCESSING">("ALL");
  const [payoutSummary, setPayoutSummary] = useState<any>(null);

  React.useEffect(() => {
    kgsApi.payments.getDoctorPayouts().then(data => {
      setPayoutSummary(data);
    }).catch(() => {});
  }, []);

  const filteredPayouts = MOCK_PAYOUTS.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.bankReference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalGross = payoutSummary?.total_gross_earnings_inr || MOCK_PAYOUTS.reduce((sum, p) => sum + p.grossAmount, 0);
  const totalTds = payoutSummary?.total_tds_withheld_inr || MOCK_PAYOUTS.reduce((sum, p) => sum + p.tdsDeductionAmount, 0);
  const totalNet = payoutSummary?.net_payable_inr || MOCK_PAYOUTS.reduce((sum, p) => sum + p.netDisbursedAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Earnings & Tax Payouts</h1>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs">
                Section 194J Compliant
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated doctor fee settlements, platform commissions (15%), and statutory TDS tax deduction certificates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="text-xs font-semibold">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download Annual TDS Summary (Form 16A)
            </Button>
            <Link href="/doctor/dashboard">
              <Button className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Financial KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Gross Consult Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                ₹
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">₹{totalGross.toLocaleString("en-IN")}</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs previous month
            </p>
          </Card>

          <Card className="p-5 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Net Disbursed to Bank</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-700">₹{totalNet.toLocaleString("en-IN")}</p>
            <p className="text-[11px] text-slate-500 mt-1">Direct NEFT/RTGS settlements</p>
          </Card>

          <Card className="p-5 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Sec 194J TDS Withheld (10%)</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-700">₹{totalTds.toLocaleString("en-IN")}</p>
            <p className="text-[11px] text-slate-500 mt-1">Deposited to ITD / Form 26AS</p>
          </Card>

          <Card className="p-5 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Upcoming Payout</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-blue-700">₹10,200</p>
            <p className="text-[11px] text-slate-500 mt-1">Settlement batch: 07 Nov 2026</p>
          </Card>
        </div>

        {/* Bank Account Details Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
              <Building2 className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">HDFC Bank Limited — Current Account</h3>
                <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Penny Drop Verified
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                A/C: <span className="font-bold text-slate-800">•••• •••• 4892</span> • IFSC: <span className="font-bold text-slate-800">HDFC0000142</span> (Indiranagar, BLR)
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="text-xs font-semibold text-slate-700">
            Update Settlement Account
          </Button>
        </div>

        {/* Settlement Ledger Table */}
        <Card className="p-6 border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Settlement Batches & Invoices</h2>
              <p className="text-xs text-slate-500">Historical remittance records with itemized platform split and statutory withholdings.</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search batch ID or bank ref..."
                  className="text-xs pl-8 h-9"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-lg text-xs p-2 h-9 text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="PAID">Disbursed (Paid)</option>
                <option value="PROCESSING">In Transit</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="p-3">Batch ID & Date</th>
                  <th className="p-3 text-center">Encounters</th>
                  <th className="p-3 text-right">Gross Fees</th>
                  <th className="p-3 text-right">Platform Fee (15%)</th>
                  <th className="p-3 text-right">TDS 194J (10%)</th>
                  <th className="p-3 text-right">Net Disbursed</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Tax Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3">
                      <p className="font-mono font-bold text-slate-900">{p.id}</p>
                      <p className="text-[11px] text-slate-500">{p.settlementDate}</p>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800">
                      {p.consultationCount}
                    </td>
                    <td className="p-3 text-right font-semibold text-slate-900">
                      ₹{p.grossAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-right text-rose-700 font-mono">
                      -₹{p.platformFeeAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-right text-amber-700 font-mono">
                      -₹{p.tdsDeductionAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-right font-black text-emerald-700 text-sm">
                      ₹{p.netDisbursedAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={`text-[10px] font-bold ${
                        p.status === "PAID" 
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300" 
                          : "bg-blue-100 text-blue-800 border-blue-300"
                      }`}>
                        {p.status === "PAID" ? "Disbursed" : "In Transit"}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold text-[11px]"
                        title="Download GST Compliant Tax Invoice PDF"
                      >
                        <FileText className="w-3.5 h-3.5" /> GST Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>
              <strong>Tax Compliance Note:</strong> As per Section 194J of the Indian Income Tax Act 1961, tax is deducted at source at 10% on professional healthcare consult fees. Quarterly Form 16A certificates are generated within 15 days of the following quarter.
            </span>
          </div>
        </Card>

      </div>
    </div>
  );
}

