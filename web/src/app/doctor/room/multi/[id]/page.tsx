"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Users, 
  Languages, 
  Share2, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  Settings, 
  UserPlus, 
  Volume2, 
  VolumeX, 
  Check, 
  Copy, 
  Lock,
  Maximize2,
  Stethoscope,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Participant {
  id: string;
  name: string;
  role: "Doctor (Host)" | "Patient" | "Family Member" | "Medical Interpreter";
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  language?: string;
  avatarLetter: string;
  bgGradient: string;
}

const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: "p1",
    name: "Dr. Priya Sharma",
    role: "Doctor (Host)",
    isAudioMuted: false,
    isVideoMuted: false,
    avatarLetter: "PS",
    bgGradient: "from-teal-800 to-teal-950"
  },
  {
    id: "p2",
    name: "Rahul Varma",
    role: "Patient",
    isAudioMuted: false,
    isVideoMuted: false,
    avatarLetter: "RV",
    bgGradient: "from-slate-800 to-slate-900"
  },
  {
    id: "p3",
    name: "Sunita Varma (Mother)",
    role: "Family Member",
    isAudioMuted: true,
    isVideoMuted: false,
    avatarLetter: "SV",
    bgGradient: "from-blue-900 to-indigo-950"
  },
  {
    id: "p4",
    name: "Rajesh K. (Certified)",
    role: "Medical Interpreter",
    isAudioMuted: false,
    isVideoMuted: true,
    language: "Hindi <-> English",
    avatarLetter: "RK",
    bgGradient: "from-amber-900 to-amber-950"
  }
];

const AVAILABLE_LANGUAGES = [
  "Hindi <-> English",
  "Tamil <-> English",
  "Telugu <-> English",
  "Bengali <-> English",
  "Marathi <-> English",
  "Gujarati <-> English",
  "Kannada <-> English",
  "Spanish <-> English"
];

interface MultiRoomProps {
  params: Promise<{ id: string }>;
}

export default function MultiPartyConsultationRoom({ params }: MultiRoomProps) {
  const resolvedParams = use(params);

  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState<"PARTICIPANTS" | "NOTES" | "INTERPRETER" | null>("PARTICIPANTS");
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi <-> English");
  const [interpreterVolume, setInterpreterVolume] = useState(85);
  const [copiedLink, setCopiedLink] = useState(false);
  const [quickSoapNotes, setQuickSoapNotes] = useState(
    "Patient reporting persistent fever since 3 days. Interpreter assisting family translation. Denies chest pain or breathlessness."
  );

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    setParticipants(prev => prev.map(p => p.id === "p1" ? { ...p, isAudioMuted: isMicOn } : p));
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    setParticipants(prev => prev.map(p => p.id === "p1" ? { ...p, isVideoMuted: isVideoOn } : p));
  };

  const toggleParticipantMute = (id: string) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, isAudioMuted: !p.isAudioMuted } : p));
  };

  const copyGuestLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col text-white overflow-hidden select-none">
      
      {/* Top Header Bar */}
      <header className="h-14 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">REC • 08:42</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-teal-500/40 bg-teal-950/50 text-teal-300 text-xs py-0.5">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-400" /> AES-256 E2EE SFU
            </Badge>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Room: <span className="font-mono text-slate-200">{resolvedParams.id}</span> (4-Way Multi-Party)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={copyGuestLink}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Link Copied!" : "Invite Family Link"}</span>
          </button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab(activeTab === "INTERPRETER" ? null : "INTERPRETER")}
            className={`text-xs border-amber-600/50 hover:bg-amber-950/30 ${
              activeTab === "INTERPRETER" ? "bg-amber-950/70 text-amber-300 border-amber-500" : "text-amber-400"
            }`}
          >
            <Languages className="w-3.5 h-3.5 mr-1" />
            Interpreter Live
          </Button>
        </div>
      </header>

      {/* Main Viewport: Video Grid + Clinical Side Panel */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Video Grid (2x2 Matrix) */}
        <div className="flex-1 p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
          {participants.map((p) => (
            <div 
              key={p.id}
              className={`relative rounded-xl overflow-hidden border border-slate-800 bg-gradient-to-br ${p.bgGradient} flex flex-col items-center justify-center shadow-lg group`}
            >
              {/* Fallback Avatar / Video Simulation */}
              {p.isVideoMuted ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-2xl font-bold tracking-wider">
                    {p.avatarLetter}
                  </div>
                  <Badge variant="outline" className="bg-black/40 text-slate-300 border-slate-700 text-[11px]">
                    <VideoOff className="w-3 h-3 mr-1" /> Video Disabled
                  </Badge>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <div className="w-24 h-24 rounded-full bg-white/15 border-2 border-white/20 flex items-center justify-center text-3xl font-bold">
                    {p.avatarLetter}
                  </div>
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur px-2.5 py-1 rounded-md text-[11px] text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>720p • 30fps</span>
                  </div>
                </div>
              )}

              {/* Participant Info Banner at Bottom */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/70 backdrop-blur px-3 py-2 rounded-lg border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{p.name}</span>
                  <Badge className={`text-[10px] py-0 px-1.5 ${
                    p.role.includes("Doctor") ? "bg-teal-600 text-white" :
                    p.role.includes("Interpreter") ? "bg-amber-600 text-white" :
                    "bg-slate-700 text-slate-200"
                  }`}>
                    {p.role}
                  </Badge>
                  {p.language && (
                    <span className="text-[10px] text-amber-300 font-mono hidden md:inline">
                      ({p.language})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => toggleParticipantMute(p.id)}
                    className={`p-1.5 rounded-full ${p.isAudioMuted ? "bg-rose-600/80 text-white" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}
                    title={p.isAudioMuted ? "Unmute" : "Mute"}
                  >
                    {p.isAudioMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Side Drawer (Collapsible) */}
        {activeTab && (
          <aside className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
            {/* Drawer Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex gap-1">
                <button 
                  onClick={() => setActiveTab("PARTICIPANTS")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeTab === "PARTICIPANTS" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Participants (4)
                </button>
                <button 
                  onClick={() => setActiveTab("INTERPRETER")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeTab === "INTERPRETER" ? "bg-slate-800 text-amber-300" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Interpreter Hub
                </button>
                <button 
                  onClick={() => setActiveTab("NOTES")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeTab === "NOTES" ? "bg-slate-800 text-teal-300" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Quick SOAP
                </button>
              </div>
              <button 
                onClick={() => setActiveTab(null)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              
              {/* Tab: Participants */}
              {activeTab === "PARTICIPANTS" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>In-Call Roster</span>
                    <span className="font-mono">4 Connected</span>
                  </div>
                  {participants.map(p => (
                    <div key={p.id} className="p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[11px]">
                          {p.avatarLetter}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {p.isAudioMuted ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                        {p.isVideoMuted ? <VideoOff className="w-3.5 h-3.5 text-slate-500" /> : <Video className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <button 
                      onClick={copyGuestLink}
                      className="w-full text-xs py-2 bg-teal-800/40 hover:bg-teal-800/60 text-teal-200 border border-teal-700/50 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Generate New Guest Pass Link
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Interpreter Hub */}
              {activeTab === "INTERPRETER" && (
                <div className="space-y-4">
                  <div className="bg-amber-950/40 border border-amber-800/60 rounded-lg p-3 text-xs text-amber-200">
                    <p className="font-semibold flex items-center gap-1.5 text-amber-300">
                      <Languages className="w-4 h-4" /> Certified Medical Interpreter Active
                    </p>
                    <p className="text-[11px] text-amber-300/80 mt-1">
                      Rajesh K. is certified for medical terminology in Hindi & English under Indian healthcare translation standards.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Language Pair</label>
                    <select 
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      {AVAILABLE_LANGUAGES.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                      <span>Interpreter Audio Level</span>
                      <span className="font-mono text-amber-400">{interpreterVolume}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={interpreterVolume}
                      onChange={(e) => setInterpreterVolume(parseInt(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-700 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-slate-800/70 rounded-lg border border-slate-700 text-xs text-slate-300 space-y-1.5">
                    <p className="font-medium text-slate-200">Audio Routing Mode:</p>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Simultaneous translation (Ducks patient audio by 40% when interpreter speaks)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Quick SOAP Notes */}
              {activeTab === "NOTES" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">In-Encounter SOAP Notes</span>
                    <Badge variant="outline" className="text-[10px] text-teal-400 border-teal-500/40">Syncs to EMR</Badge>
                  </div>
                  <textarea 
                    rows={8}
                    value={quickSoapNotes}
                    onChange={(e) => setQuickSoapNotes(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="Subjective complaints, objective observations..."
                  />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[11px] text-slate-400">Auto-saved to draft</span>
                    <Link href={`/doctor/emr/pat-01`}>
                      <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
                        Open Full EMR Console <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </aside>
        )}
      </div>

      {/* Bottom In-Call Controls Bar */}
      <footer className="h-18 bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-slate-700 text-slate-300 text-xs hidden md:inline-flex">
            Latency: 28ms • Loss: 0.0%
          </Badge>
        </div>

        {/* Center Control Group */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleMic}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isMicOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/40"
            }`}
            title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button 
            onClick={toggleVideo}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isVideoOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/40"
            }`}
            title={isVideoOn ? "Disable Camera" : "Enable Camera"}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <Link href="/doctor/dashboard">
            <button 
              className="px-5 h-11 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Encounter</span>
            </button>
          </Link>
        </div>

        {/* Right Toggle Group */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab(activeTab === "PARTICIPANTS" ? null : "PARTICIPANTS")}
            className={`p-2.5 rounded-lg border transition-colors ${
              activeTab === "PARTICIPANTS" ? "bg-teal-900/60 border-teal-500 text-teal-300" : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
            }`}
            title="Toggle Roster"
          >
            <Users className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === "NOTES" ? null : "NOTES")}
            className={`p-2.5 rounded-lg border transition-colors ${
              activeTab === "NOTES" ? "bg-teal-900/60 border-teal-500 text-teal-300" : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
            }`}
            title="Toggle EMR Notes"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </footer>

    </div>
  );
}

