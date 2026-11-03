import React from "react";
import { AlertTriangle, PhoneCall, ShieldAlert, X } from "lucide-react";
import { Button } from "./button";

interface EmergencyBannerProps {
  onDismiss?: () => void;
  isDismissible?: boolean;
}

export function EmergencyWarningStrip({ onDismiss, isDismissible = true }: EmergencyBannerProps) {
  return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 text-xs sm:text-sm text-red-900 flex items-center justify-between">
      <div className="flex items-center gap-2 max-w-5xl mx-auto">
        <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 animate-bounce" />
        <span>
          <strong>Emergency Medical Warning:</strong> If you or the patient are experiencing chest pain, severe breathlessness, sudden speech difficulty, or severe trauma, please immediately dial{" "}
          <a href="tel:112" className="font-bold underline text-red-700 hover:text-red-950">
            112 (National Emergency)
          </a>{" "}
          or visit the nearest emergency room. Teleconsultation is not a substitute for in-person emergency care.
        </span>
      </div>
      {isDismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-700 hover:text-red-950 p-1 shrink-0 ml-2"
          aria-label="Dismiss Emergency Advisory"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedKeyword?: string;
}

export function EmergencyTakeoverModal({ isOpen, onClose, detectedKeyword }: EmergencyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-title"
        className="bg-white rounded-xl max-w-lg w-full border-4 border-red-600 shadow-2xl overflow-hidden"
      >
        <div className="bg-red-600 text-white p-6 text-center">
          <ShieldAlert className="h-16 w-16 mx-auto mb-3 animate-pulse" />
          <h2 id="emergency-title" className="text-2xl font-bold tracking-tight">
            CRITICAL EMERGENCY TRIAGE ALERT
          </h2>
          <p className="text-red-100 text-sm mt-1">
            Statutory Clinical Safety Protection Mechanism (MoHFW Telemedicine Guidelines 2020)
          </p>
        </div>

        <div className="p-6 space-y-4 text-slate-800">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-900">
            {detectedKeyword ? (
              <p>
                Potential acute red-flag detected: <span className="font-bold underline">{detectedKeyword}</span>.
              </p>
            ) : (
              <p>Critical symptoms detected that require immediate physical medical evaluation.</p>
            )}
            <p className="mt-1 font-medium">
              Virtual teleconsultation is strictly prohibited by medical safety protocols for acute medical emergencies.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href="tel:112"
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-lg text-lg shadow-lg transition-colors text-center"
            >
              <PhoneCall className="h-5 w-5" />
              Call 112 (National Emergency Dispatcher)
            </a>

            <a
              href="https://maps.google.com/?q=nearest+hospital+emergency+room"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border-2 border-slate-700 hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-lg text-center transition-colors"
            >
              Locate Nearest Physical Emergency Room (ER)
            </a>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              I understand the risks; continue for routine query only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

