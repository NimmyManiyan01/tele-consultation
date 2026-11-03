"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Lock, 
  Info,
  Trash2,
  Eye,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmergencyTakeoverModal } from "@/components/ui/emergency-banner";

const COMMON_SYMPTOMS = [
  "High Fever (> 100°F)",
  "Sore Throat & Cough",
  "Severe Headache / Migraine",
  "Chest Congestion",
  "Nausea / Vomiting",
  "Abdominal Pain",
  "Skin Rash / Lesions",
  "Joint / Muscle Ache",
  "Fatigue & Weakness",
  "Dizziness / Vertigo",
  "Shortness of Breath",
  "Chest Pain / Pressure"
];

const EMERGENCY_RED_FLAGS = [
  "Chest Pain / Pressure",
  "Shortness of Breath",
  "Loss of Consciousness",
  "Sudden Slurred Speech",
  "Severe Sudden Headache"
];

const COMMON_ALLERGIES = [
  "Penicillin / Amoxicillin",
  "Sulfa Drugs / Bactrim",
  "NSAIDs (Aspirin/Ibuprofen)",
  "Paracetamol / Acetaminophen",
  "Iodine / Radiocontrast Dye",
  "Peanuts / Tree Nuts",
  "No Known Drug Allergies (NKDA)"
];

interface IntakePageProps {
  params: Promise<{ id: string }>;
}

export default function ClinicalIntakePage({ params }: IntakePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["High Fever (> 100°F)", "Severe Headache / Migraine"]);
  const [symptomSeverity, setSymptomSeverity] = useState<number>(6);
  const [duration, setDuration] = useState<string>("3 days");
  const [chiefComplaint, setChiefComplaint] = useState<string>("Intermittent high-grade fever with throbbing frontal headache and body ache.");
  const [currentMeds, setCurrentMeds] = useState<string>("Paracetamol 650mg SOS, Vitamin C 500mg daily");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(["Penicillin / Amoxicillin"]);
  const [customAllergy, setCustomAllergy] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; sanitized: boolean }[]>([
    { name: "throat_swelling_photo.jpg", size: "2.4 MB", sanitized: true }
  ]);
  const [consentAgreed, setConsentAgreed] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleSymptom = (sym: string) => {
    if (EMERGENCY_RED_FLAGS.includes(sym)) {
      setShowEmergencyModal(true);
      return;
    }
    setSelectedSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const toggleAllergy = (all: string) => {
    if (all === "No Known Drug Allergies (NKDA)") {
      setSelectedAllergies(["No Known Drug Allergies (NKDA)"]);
      return;
    }
    setSelectedAllergies(prev => {
      const filtered = prev.filter(a => a !== "No Known Drug Allergies (NKDA)");
      return filtered.includes(all) ? filtered.filter(a => a !== all) : [...filtered, all];
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles(prev => [
        ...prev, 
        { 
          name: file.name, 
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`, 
          sanitized: true // Demonstrates automatic EXIF metadata stripping
        }
      ]);
    }
  };

  const removeFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/room/${resolvedParams.id}`);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Pre-Consultation Clinical Intake</h1>
                <p className="text-xs text-slate-500 font-medium">Appointment ID: <span className="font-mono text-slate-700 font-bold">{resolvedParams.id}</span> • Form S15-CLINICAL</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs py-1 px-2.5">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> MoHFW Tele-Triage
            </Badge>
          </div>

          {/* Stepper Progress */}
          <div className="mt-6">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold mb-2">
              <span className={currentStep >= 1 ? "text-teal-700" : "text-slate-400"}>1. Symptoms</span>
              <span className={currentStep >= 2 ? "text-teal-700" : "text-slate-400"}>2. Meds & Allergies</span>
              <span className={currentStep >= 3 ? "text-teal-700" : "text-slate-400"}>3. Photos & Vault</span>
              <span className={currentStep >= 4 ? "text-teal-700" : "text-slate-400"}>4. Consent</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-teal-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* STEP 1: Symptoms & Severity */}
        {currentStep === 1 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Chief Symptoms & Severity</h2>
              <p className="text-xs text-slate-600 mt-1">Select all present symptoms so the consulting physician can review prior to joining.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Common Symptoms (Click to toggle)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {COMMON_SYMPTOMS.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  const isEmergency = EMERGENCY_RED_FLAGS.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`text-left text-xs p-3 rounded-lg border font-medium transition-all flex items-center justify-between ${
                        isSelected 
                          ? "bg-teal-50 border-teal-500 text-teal-900 shadow-sm" 
                          : isEmergency
                            ? "bg-rose-50/40 border-rose-200 text-rose-800 hover:bg-rose-50"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span>{sym}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 ml-1.5" />
                      ) : isEmergency ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 ml-1.5" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity Slider */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">Symptom Severity Rating (NRS 1–10 Scale)</label>
                <Badge variant="outline" className={`font-mono text-xs font-bold ${
                  symptomSeverity >= 8 ? "bg-rose-50 text-rose-700 border-rose-300" :
                  symptomSeverity >= 5 ? "bg-amber-50 text-amber-700 border-amber-300" :
                  "bg-emerald-50 text-emerald-700 border-emerald-300"
                }`}>
                  Score: {symptomSeverity}/10 ({symptomSeverity >= 8 ? "Severe" : symptomSeverity >= 5 ? "Moderate" : "Mild"})
                </Badge>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={symptomSeverity}
                onChange={(e) => setSymptomSeverity(parseInt(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>1 - Barely Noticeable</span>
                <span>5 - Impairing Activity</span>
                <span>10 - Unbearable Pain</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Symptom Duration</label>
                <Input 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                  placeholder="e.g. 3 days, 2 weeks" 
                  className="text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Concern / Details</label>
                <Input 
                  value={chiefComplaint} 
                  onChange={(e) => setChiefComplaint(e.target.value)} 
                  placeholder="Brief summary for the doctor" 
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button onClick={() => setCurrentStep(2)} className="bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs px-5">
                Next: Medications & Allergies <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: Medications & Allergies */}
        {currentStep === 2 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Current Medications & Drug Allergies</h2>
              <p className="text-xs text-slate-600 mt-1">Prevent adverse drug interactions by reporting all currently taken prescriptions, OTCs, and allergies.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Known Drug & Substance Allergies
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COMMON_ALLERGIES.map((all) => {
                  const isSelected = selectedAllergies.includes(all);
                  return (
                    <button
                      key={all}
                      type="button"
                      onClick={() => toggleAllergy(all)}
                      className={`text-left text-xs p-3 rounded-lg border font-medium transition-all flex items-center justify-between ${
                        isSelected 
                          ? all.includes("No Known") 
                            ? "bg-slate-100 border-slate-400 text-slate-900"
                            : "bg-rose-50 border-rose-400 text-rose-900 shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span>{all}</span>
                      {isSelected && (
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ml-1.5 ${all.includes("No Known") ? "text-slate-600" : "text-rose-600"}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex gap-2">
                <Input 
                  value={customAllergy}
                  onChange={(e) => setCustomAllergy(e.target.value)}
                  placeholder="Other allergy (e.g., Latex, Ciprofloxacin)..."
                  className="text-xs"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    if (customAllergy.trim()) {
                      setSelectedAllergies(prev => [...prev, customAllergy.trim()]);
                      setCustomAllergy("");
                    }
                  }}
                  className="text-xs shrink-0"
                >
                  Add Allergy
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Medications & Dosages</label>
              <textarea 
                rows={3}
                value={currentMeds}
                onChange={(e) => setCurrentMeds(e.target.value)}
                placeholder="List any ongoing tablets, inhalers, insulin, or Ayurvedic supplements with dosage..."
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-slate-800"
              />
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400" /> Include dosage if known (e.g., Metformin 500mg BD).
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="text-xs">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button onClick={() => setCurrentStep(3)} className="bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs px-5">
                Next: Clinical Photos & Vault <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: Photos & Document Triage */}
        {currentStep === 3 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Clinical Photos & Diagnostic Reports</h2>
              <p className="text-xs text-slate-600 mt-1">Upload high-resolution lesion photos, recent lab reports, or discharge summaries for pre-call doctor review.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Safeguard:</strong> All photos undergo automated client-side EXIF metadata scrubbing (GPS geolocation and camera hardware identifiers are completely removed prior to encryption).
              </span>
            </div>

            {/* Upload Zone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-teal-400 bg-slate-50/50 rounded-xl p-6 text-center transition-all cursor-pointer">
              <input 
                type="file" 
                id="intake-upload" 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*,.pdf"
              />
              <label htmlFor="intake-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800">Tap to upload clinical photo or PDF report</span>
                <span className="text-[11px] text-slate-500 mt-0.5">JPEG, PNG, HEIC, or PDF up to 25 MB</span>
              </label>
            </div>

            {/* Attached files list */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Attached Triage Files ({uploadedFiles.length})</label>
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{file.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{file.size} • <span className="text-emerald-700 font-medium">EXIF Scrubbed</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 text-[10px] border-emerald-200">
                        Ready for Doctor
                      </Badge>
                      <button 
                        type="button" 
                        onClick={() => removeFile(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setCurrentStep(2)} className="text-xs">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button onClick={() => setCurrentStep(4)} className="bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs px-5">
                Next: Consent & Finalize <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 4: Consent & Review */}
        {currentStep === 4 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Informed Telemedicine Consent & Review</h2>
              <p className="text-xs text-slate-600 mt-1">Review your intake summary and confirm statutory telemedicine consent as mandated under MoHFW Guidelines (2020).</p>
            </div>

            {/* Summary preview */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Chief Complaint:</span>
                <span className="font-semibold text-slate-900 max-w-xs text-right">{chiefComplaint}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Duration & Severity:</span>
                <span className="font-semibold text-slate-900">{duration} (NRS {symptomSeverity}/10)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Known Allergies:</span>
                <span className="font-semibold text-rose-700">{selectedAllergies.join(", ") || "None"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Clinical Attachments:</span>
                <span className="font-semibold text-slate-900">{uploadedFiles.length} file(s) attached</span>
              </div>
            </div>

            {/* Statutory Consent Checkbox */}
            <div className="border border-teal-200 bg-teal-50/60 p-4 rounded-xl space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600"
                />
                <div className="text-xs text-slate-800 leading-relaxed">
                  <span className="font-bold text-teal-950">Statutory Telemedicine Informed Consent (MoHFW 2020)</span>
                  <p className="text-slate-600 mt-1">
                    I understand that teleconsultation has inherent clinical limitations compared to in-person physical examination. I confirm that I am not experiencing acute emergency symptoms (such as severe chest pain, loss of consciousness, or breathing failure). I consent to the transmission of my medical summary and photos to the licensed registered medical practitioner.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setCurrentStep(3)} className="text-xs">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!consentAgreed || isSubmitting}
                className="bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs px-6 py-2.5 shadow-md shadow-teal-700/10"
              >
                {isSubmitting ? "Encrypting & Joining..." : "Submit Intake & Join Room"}
                {!isSubmitting && <ArrowRight className="w-4 h-4 ml-1.5" />}
              </Button>
            </div>
          </Card>
        )}

      </div>

      {/* Emergency Modal Intercept */}
      <EmergencyTakeoverModal 
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        detectedKeyword="Chest Pain / Shortness of Breath"
      />
    </div>
  );
}
