"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Upload, 
  Search, 
  ShieldCheck, 
  Download, 
  Eye, 
  Plus, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Lock, 
  X,
  FileCheck,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_VAULT_DOCUMENTS } from "@/data/mock-store";
import { HealthVaultDocument } from "@/types";

export default function DigitalHealthVaultPage() {
  const [documents, setDocuments] = useState<HealthVaultDocument[]>(MOCK_VAULT_DOCUMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<HealthVaultDocument | null>(null);

  // Upload Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"PRESCRIPTION" | "LAB_REPORT" | "DISCHARGE_SUMMARY">("LAB_REPORT");
  const [newIssuedBy, setNewIssuedBy] = useState("");
  const [isScanningFile, setIsScanningFile] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === "ALL" || doc.category === selectedCategory;
    const matchesQuery = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.issuedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsScanningFile(true);
    setTimeout(() => {
      const doc: HealthVaultDocument = {
        id: `doc-vault-${Date.now()}`,
        title: newTitle,
        category: newCategory,
        issueDate: "Today",
        issuedBy: newIssuedBy || "Uploaded Record",
        fileSize: "840 KB",
        isVerified: true,
        downloadUrl: "#",
      };
      setDocuments(prev => [doc, ...prev]);
      setIsScanningFile(false);
      setUploadModalOpen(false);
      setNewTitle("");
      setNewIssuedBy("");
    }, 1200);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        {/* Vault Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Digital Health Vault
              </h1>
              <Badge variant="verified" className="text-xs">
                AES-256 Encrypted
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Longitudinal personal health records, verified digital prescriptions, and NABL diagnostic reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setUploadModalOpen(true)}
              className="gap-2 font-bold shadow-sm"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Medical Record</span>
            </Button>
          </div>
        </div>

        {/* ABDM Ayushman Bharat Health Account Sync Strip */}
        <div className="bg-gradient-to-r from-brand-blue-50 to-brand-green-50 border border-brand-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
              ABHA
            </div>
            <div>
              <p className="font-bold text-slate-900">
                Ayushman Bharat Digital Mission (ABDM M1/M2) Linked
              </p>
              <p className="text-slate-500">
                ABHA ID: <span className="font-mono font-semibold text-slate-700">91-4829-1029-4412</span> • All consultation summaries sync with consent.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="text-xs shrink-0">
            Manage Data Consents
          </Button>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedCategory("ALL")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === "ALL" 
                    ? "bg-brand-blue-600 text-white shadow-sm" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Records ({documents.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("PRESCRIPTION")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === "PRESCRIPTION" 
                    ? "bg-brand-blue-600 text-white shadow-sm" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Prescriptions
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("LAB_REPORT")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === "LAB_REPORT" 
                    ? "bg-brand-blue-600 text-white shadow-sm" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Lab Reports
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("DISCHARGE_SUMMARY")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === "DISCHARGE_SUMMARY" 
                    ? "bg-brand-blue-600 text-white shadow-sm" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Hospital Summaries
              </button>
            </div>

            {/* Search Input */}
            <div className="relative sm:w-64">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <Input
                type="text"
                placeholder="Search documents or labs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredDocs.map((doc) => (
              <div 
                key={doc.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-brand-blue-300 bg-white hover:bg-slate-50/50 transition-all flex items-start justify-between gap-3 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-brand-blue-50 text-brand-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {doc.issuedBy} • {doc.issueDate}
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                      <span>{doc.fileSize}</span>
                      <span>•</span>
                      <span className="text-brand-green-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Virus Scanned & Clean
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setPreviewDoc(doc)}
                    className="h-8 px-2.5 text-xs gap-1"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-500" />
                    <span>View</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => alert(`Downloading verified copy of ${doc.title}...`)}
                    className="h-8 w-8 p-0 text-slate-500"
                    aria-label="Download Document"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Modal (OVERLAY-28) */}
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-brand-blue-700" />
                  <span>Upload Medical Record to Health Vault</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Record Title</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Complete Blood Count (CBC) Report, Thyroid Profile..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">Record Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full p-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                    >
                      <option value="LAB_REPORT">Lab & Pathology Report</option>
                      <option value="PRESCRIPTION">Prior Prescription Slip</option>
                      <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">Issuing Hospital / Lab</label>
                    <Input
                      type="text"
                      placeholder="e.g. Lal PathLabs, Apollo Clinic..."
                      value={newIssuedBy}
                      onChange={(e) => setNewIssuedBy(e.target.value)}
                    />
                  </div>
                </div>

                {/* File Dropzone Simulation */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2 hover:bg-slate-50 cursor-pointer">
                  <FileCheck className="h-8 w-8 text-brand-blue-600 mx-auto" />
                  <p className="font-semibold text-slate-800">
                    Click to select PDF, JPEG, or PNG (Max 15 MB)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    All uploads are scanned for malware and stripped of sensitive GPS EXIF metadata before encryption.
                  </p>
                </div>

                {isScanningFile && (
                  <div className="bg-brand-blue-50 border border-brand-blue-200 rounded-lg p-3 text-xs text-brand-blue-800 flex items-center gap-2">
                    <Activity className="h-4 w-4 animate-spin text-brand-blue-700" />
                    <span>Analyzing file integrity and executing antivirus heuristic scan...</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isScanningFile}
                    className="font-bold shadow-md"
                  >
                    Upload & Encrypt
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Document Previewer Modal */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{previewDoc.title}</h3>
                  <p className="text-xs text-slate-500">{previewDoc.issuedBy} • {previewDoc.issueDate}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Document Canvas Preview Simulation */}
              <div className="h-80 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <FileText className="h-16 w-16 text-brand-blue-600 animate-pulse" />
                <div>
                  <p className="font-bold text-sm text-slate-800">Verified Health Record Render Canvas</p>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Displaying 2-page encrypted medical report synchronized from certified NABL diagnostic repository.
                  </p>
                </div>
                <Badge variant="verified">
                  Digital Cryptographic Checksum Verified
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">File Reference: {previewDoc.id}</span>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => alert("Downloading signed PDF...")}
                  className="gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Document</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

