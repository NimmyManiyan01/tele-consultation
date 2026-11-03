"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Settings, 
  ShieldCheck, 
  Activity, 
  Camera, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Send, 
  Paperclip, 
  Maximize2, 
  X,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_CLINICIANS } from "@/data/mock-store";
import { kgsApi } from "@/lib/api-client";

export default function VideoTeleconsultationRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params?.id as string) || "appt-5412";
  const doctor = MOCK_CLINICIANS[0] || null;

  // States
  const [deviceCheckPassed, setDeviceCheckPassed] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [endCallModalOpen, setEndCallModalOpen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Chat messages
  const [messages, setMessages] = useState([
    { sender: "Dr. Priya Sharma", text: "Hello Rohan, I'm reviewing your morning BP readings. How are you feeling right now?", time: "4:31 PM" },
    { sender: "You", text: "Good afternoon doctor. I had mild breathlessness when climbing stairs yesterday, but feeling okay currently.", time: "4:32 PM" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Call timer simulation
  useEffect(() => {
    if (!deviceCheckPassed) return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [deviceCheckPassed]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    }]);
    setNewMessage("");
  };

  const [livekitToken, setLivekitToken] = useState<string | null>(null);

  const handleJoinCall = async () => {
    try {
      const res = await kgsApi.consultations.getToken(roomId, "Rahul Varma");
      setLivekitToken(res.token);
    } catch (e) {
      // Fallback
    }
    setDeviceCheckPassed(true);
  };

  // Pre-Call Hardware Check View
  if (!deviceCheckPassed) {
    return (
      <div className="bg-slate-900 min-h-screen text-white flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <Badge variant="verified" className="bg-brand-blue-900/60 text-brand-blue-300 border-brand-blue-700">
              LiveKit SFU Pre-Call Diagnostics
            </Badge>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Pre-Call Hardware & Audio Test
            </h1>
            <p className="text-xs text-slate-400">
              Verify your camera, microphone, and speakers before entering the clinical consultation room.
            </p>
          </div>

          {/* Simulated Video Preview Box */}
          <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center">
            {isVideoOff ? (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <VideoOff className="h-10 w-10" />
                <span className="text-xs">Camera is paused</span>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 relative">
                <div className="h-20 w-20 rounded-full bg-brand-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg">
                  RV
                </div>
                <span className="text-xs text-slate-400 mt-2 font-medium">Camera Feed Active (Face Detected)</span>
                {/* Audio Level Meter */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700">
                  <Volume2 className="h-4 w-4 text-brand-green-400 shrink-0" />
                  <span className="text-[10px] text-slate-300">Mic Volume:</span>
                  <div className="flex-1 flex gap-1 h-2 items-center">
                    <span className="h-full w-2 bg-brand-green-500 rounded-sm animate-pulse" />
                    <span className="h-full w-2 bg-brand-green-500 rounded-sm animate-pulse" />
                    <span className="h-full w-2 bg-brand-green-500 rounded-sm animate-pulse" />
                    <span className="h-2/3 w-2 bg-brand-green-500 rounded-sm" />
                    <span className="h-1/3 w-2 bg-slate-700 rounded-sm" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-green-400">Optimal</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Hardware Toggles */}
          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant={isMicMuted ? "destructive" : "outline"}
              onClick={() => setIsMicMuted(!isMicMuted)}
              size="sm"
              className="gap-2 text-xs"
            >
              {isMicMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              <span>{isMicMuted ? "Mic Muted" : "Mic Active"}</span>
            </Button>
            <Button
              type="button"
              variant={isVideoOff ? "destructive" : "outline"}
              onClick={() => setIsVideoOff(!isVideoOff)}
              size="sm"
              className="gap-2 text-xs"
            >
              {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              <span>{isVideoOff ? "Camera Paused" : "Camera Active"}</span>
            </Button>
          </div>

          {/* Clinician Admittance Notice */}
          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-700 flex items-start gap-3 text-xs text-slate-300">
            <CheckCircle2 className="h-5 w-5 text-brand-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Attending Clinician: {doctor.fullName}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                The doctor has been notified that your hardware check is complete.
              </p>
            </div>
          </div>

          <Button
            size="lg"
            variant="secondary"
            onClick={handleJoinCall}
            className="w-full font-bold text-base py-3.5 shadow-lg"
          >
            Everything is Working — Join Consultation
          </Button>
        </div>
      </div>
    );
  }

  // Active Video Room View
  return (
    <div className="bg-slate-950 min-h-screen text-white flex flex-col relative overflow-hidden">
      {/* Top Bar Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-green-500 animate-pulse" />
            <h1 className="font-bold text-sm tracking-tight text-white">{doctor.fullName}</h1>
          </div>
          <span className="text-slate-500 text-xs hidden sm:inline">•</span>
          <span className="text-xs text-slate-400 hidden sm:inline">{doctor.primarySpecialty}</span>
          <Badge variant="verified" className="bg-brand-blue-900/40 text-brand-blue-300 border-brand-blue-800 text-[10px] hidden md:inline-flex">
            LiveKit WebRTC SFU (TLS 1.3)
          </Badge>
        </div>

        {/* Call Timer & Network Health */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full text-xs font-mono font-bold text-brand-green-400 border border-slate-700">
            <Activity className="h-3.5 w-3.5" />
            <span>{formatTime(callDuration)}</span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">1080p • 24ms</span>
        </div>
      </header>

      {/* Main Encounter Area: Video Canvas + Slideout Chat */}
      <div className="flex-1 flex relative">
        {/* Main Video Viewport (16:9 Remote Doctor Feed) */}
        <main className="flex-1 flex items-center justify-center p-4 relative bg-slate-950">
          <div className="relative w-full max-w-5xl aspect-video rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
            {/* Simulated Remote Doctor Video View */}
            <div className="h-28 w-28 rounded-full bg-brand-blue-700 text-white font-bold text-4xl flex items-center justify-center shadow-2xl ring-4 ring-brand-blue-500/20">
              PS
            </div>
            <div className="text-center mt-4 space-y-1">
              <h2 className="font-bold text-lg text-white">{doctor.fullName}</h2>
              <p className="text-xs text-brand-green-400 flex items-center justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-brand-green-500" />
                Live HD Audio & Video Active
              </p>
            </div>

            {/* Doctor Verification Council Badge Overlay */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-xs flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-blue-400" />
              <span className="font-medium text-slate-200">RMP: {doctor.councilRegistrationNumber}</span>
            </div>

            {/* Local Patient PiP View (Bottom Right) */}
            <div className="absolute bottom-4 right-4 w-36 sm:w-48 aspect-video rounded-xl bg-slate-900 border-2 border-slate-700 overflow-hidden shadow-2xl flex items-center justify-center">
              {isVideoOff ? (
                <span className="text-[10px] text-slate-500">Camera Paused</span>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800">
                  <div className="h-8 w-8 rounded-full bg-brand-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    You
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1">Rohan Verma (Self)</span>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* In-Call Clinical Chat Drawer (Slide-out) */}
        {chatDrawerOpen && (
          <aside className="w-80 md:w-96 border-l border-slate-800 bg-slate-900 flex flex-col z-30 shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-brand-blue-400" />
                Clinical Chat & Reports
              </span>
              <button 
                onClick={() => setChatDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close Chat Drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, i) => {
                const isMe = m.sender === "You";
                return (
                  <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] text-slate-400 mb-0.5">{m.sender} • {m.time}</span>
                    <div className={`p-3 rounded-xl max-w-[85%] ${
                      isMe ? "bg-brand-blue-600 text-white" : "bg-slate-800 text-slate-200 border border-slate-700"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-900">
              <input
                type="text"
                placeholder="Type a clinical query..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-blue-500"
              />
              <button
                type="submit"
                className="p-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white rounded-lg"
                aria-label="Send Message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </aside>
        )}
      </div>

      {/* Floating Bottom In-Call Control Bar */}
      <footer className="h-20 bg-slate-900/95 border-t border-slate-800 flex items-center justify-center gap-3 sm:gap-4 px-4 z-20">
        <button
          onClick={() => setIsMicMuted(!isMicMuted)}
          className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
            isMicMuted ? "bg-red-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
          aria-label={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
            isVideoOff ? "bg-red-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
          aria-label={isVideoOff ? "Turn Video On" : "Turn Video Off"}
        >
          {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </button>

        <button
          onClick={() => setChatDrawerOpen(!chatDrawerOpen)}
          className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors relative ${
            chatDrawerOpen ? "bg-brand-blue-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
          aria-label="Toggle Clinical Chat"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-green-400" />
        </button>

        <Link href={`/doctor/emr/${roomId}`}>
          <Button variant="outline" size="sm" className="hidden md:flex gap-1.5 border-slate-700 text-xs text-slate-300">
            <FileText className="h-4 w-4 text-brand-blue-400" />
            <span>Open EMR SOAP Chart</span>
          </Button>
        </Link>

        {/* End Call Button */}
        <button
          onClick={() => setEndCallModalOpen(true)}
          className="h-12 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          aria-label="End Consultation Encounter"
        >
          <PhoneOff className="h-5 w-5" />
          <span className="text-xs sm:text-sm font-semibold">End Encounter</span>
        </button>
      </footer>

      {/* End Call Confirmation Modal (OVERLAY-10) */}
      {endCallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-slate-900">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-slate-900">
                End Consultation Encounter?
              </h2>
              <p className="text-xs text-slate-500">
                Ending the call will terminate the encrypted WebRTC audio/video bridge and transition the encounter to clinical documentation and prescription signing.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link href={`/doctor/emr/${roomId}`} className="block">
                <Button variant="primary" size="md" className="w-full font-bold gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Finalize EMR Notes & Sign Prescription</span>
                </Button>
              </Link>
              <Link href={`/prescription/rx-98421`} className="block">
                <Button variant="outline" size="md" className="w-full text-slate-700">
                  View Patient Signed e-Prescription
                </Button>
              </Link>
              <button
                onClick={() => setEndCallModalOpen(false)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800"
              >
                Return to Video Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

