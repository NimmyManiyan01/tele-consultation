"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Stethoscope, 
  Search, 
  Calendar, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  PhoneCall, 
  Building2, 
  Activity,
  ChevronDown,
  LogIn,
  LogOut,
  KeyRound,
  CheckCircle2,
  Lock,
  ArrowRight
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { kgsApi } from "@/lib/api-client";

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ fullName: string; role: string; email?: string } | null>(null);
  const [patientPhone, setPatientPhone] = useState("9876543210");
  const [patientOtp, setPatientOtp] = useState("123456");
  const [doctorEmail, setDoctorEmail] = useState("dr.priya.sharma@apollo.kaizentrix.local");
  const [doctorPassword, setDoctorPassword] = useState("DoctorPass@2025!");
  const [doctorTotp, setDoctorTotp] = useState("123456");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync session from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("kgs_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setCurrentUser({
          fullName: parsed.full_name || parsed.fullName || (parsed.role === "DOCTOR" ? "Dr. Priya Sharma" : "Rahul Varma"),
          role: parsed.role || "PATIENT",
          email: parsed.email,
        });
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await kgsApi.auth.verifyOtp(patientPhone, patientOtp, "Rahul Varma");
      setCurrentUser({
        fullName: res.user?.full_name || "Rahul Varma",
        role: "PATIENT",
        email: res.user?.email || "rahul.varma@example.com",
      });
      setAuthModalOpen(false);
      router.push("/patient/dashboard");
    } catch (err: any) {
      setAuthError(err.message || "Failed to verify mobile OTP. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await kgsApi.auth.login(doctorEmail, doctorPassword, doctorTotp);
      setCurrentUser({
        fullName: res.user?.full_name || "Dr. Priya Sharma",
        role: "DOCTOR",
        email: res.user?.email || doctorEmail,
      });
      setAuthModalOpen(false);
      router.push("/doctor/dashboard");
    } catch (err: any) {
      setAuthError(err.message || "Invalid doctor credentials or MFA code.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    kgsApi.auth.logout();
    setCurrentUser(null);
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue-700 text-white shadow-md group-hover:bg-brand-blue-800 transition-colors">
              <span className="font-heading font-black text-sm tracking-tighter text-white">KGS</span>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green-500 text-white shadow">
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M7 17L17 7M17 7H9M17 7V15" />
                </svg>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold tracking-tight text-brand-blue-800 text-base leading-tight">
                KAIZENTRIX
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-slate-500">
                Healthcare Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-700">
            <Link 
              href="/doctors" 
              className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-brand-blue-700 transition-colors"
            >
              Find Doctors
            </Link>
            <Link 
              href="/consult/instant" 
              className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-brand-blue-700 transition-colors flex items-center gap-1.5"
            >
              <Activity className="h-4 w-4 text-brand-green-600" />
              <span>Instant Consult</span>
              <span className="inline-flex h-2 w-2 rounded-full bg-brand-green-500 animate-pulse" />
            </Link>
            <Link 
              href="/pharmacy" 
              className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-brand-blue-700 transition-colors"
            >
              Pharmacy
            </Link>
            <Link 
              href="/diagnostics" 
              className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-brand-blue-700 transition-colors"
            >
              Lab Tests
            </Link>
            <Link 
              href="/vault" 
              className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-brand-blue-700 transition-colors"
            >
              Health Vault
            </Link>
          </nav>
        </div>

        {/* Action Group: Emergency Button + Portals Menu + Login / User Menu */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Emergency Hotline Button */}
          <a
            href="tel:112"
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
          >
            <PhoneCall className="h-3.5 w-3.5 text-red-600 animate-pulse" />
            <span>Emergency 112</span>
          </a>

          {/* Role Navigation Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
              aria-label="Open Portals Menu"
            >
              <span>Portals</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {roleMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-border shadow-xl p-2 z-50 text-xs"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-2 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Switch Role Views
                </div>
                <Link
                  href="/patient/dashboard"
                  onClick={() => setRoleMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 text-slate-800"
                >
                  <User className="h-4 w-4 text-brand-blue-600" />
                  <div>
                    <p className="font-semibold">Patient Dashboard</p>
                    <p className="text-[10px] text-slate-500">Upcoming visits & vault</p>
                  </div>
                </Link>
                <Link
                  href="/doctor/dashboard"
                  onClick={() => setRoleMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 text-slate-800"
                >
                  <Stethoscope className="h-4 w-4 text-brand-blue-600" />
                  <div>
                    <p className="font-semibold">Doctor Clinical Portal</p>
                    <p className="text-[10px] text-slate-500">OPD queue & SOAP charting</p>
                  </div>
                </Link>
                <Link
                  href="/clinic/reception"
                  onClick={() => setRoleMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 text-slate-800"
                >
                  <Building2 className="h-4 w-4 text-brand-blue-600" />
                  <div>
                    <p className="font-semibold">Front Desk & Triage</p>
                    <p className="text-[10px] text-slate-500">Walk-ins & vitals check</p>
                  </div>
                </Link>
                <Link
                  href="/spoke/triage"
                  onClick={() => setRoleMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 text-slate-800"
                >
                  <Building2 className="h-4 w-4 text-brand-green-600" />
                  <div>
                    <p className="font-semibold">Rural Spoke Clinic</p>
                    <p className="text-[10px] text-slate-500">eSanjeevani AB-HWC</p>
                  </div>
                </Link>
                <Link
                  href="/doctor/finance/payouts"
                  onClick={() => setRoleMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 text-slate-800"
                >
                  <Activity className="h-4 w-4 text-amber-600" />
                  <div>
                    <p className="font-semibold">Doctor Earnings & TDS</p>
                    <p className="text-[10px] text-slate-500">Sec 194J & GST invoices</p>
                  </div>
                </Link>
                <Link
                  href="/auth/national"
                  onClick={() => setRoleMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 text-slate-800"
                >
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  <div>
                    <p className="font-semibold">ABDM National Health ID</p>
                    <p className="text-[10px] text-slate-500">ABHA M1 Aadhaar linking</p>
                  </div>
                </Link>
                <Link
                  href="/admin/analytics"
                  onClick={() => setRoleMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 text-slate-800"
                >
                  <Activity className="h-4 w-4 text-brand-blue-600" />
                  <div>
                    <p className="font-semibold">Platform Analytics</p>
                    <p className="text-[10px] text-slate-500">SLOs & teleconsult volume</p>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* User Sign In / Profile Section */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-brand-blue-50 hover:bg-brand-blue-100 text-brand-blue-900 border border-brand-blue-200 rounded-lg text-xs font-semibold transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-brand-blue-700 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.fullName[0]}
                </div>
                <span>{currentUser.fullName}</span>
                <Badge variant="verified" className="text-[10px] py-0 px-1.5">
                  {currentUser.role}
                </Badge>
                <ChevronDown className="h-3 w-3 text-slate-500" />
              </button>

              {userMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-lg bg-white border border-border shadow-xl p-2 z-50 text-xs"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                    <p className="font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentUser.email || "Active Session"}</p>
                  </div>
                  <Link
                    href={currentUser.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard"}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 text-slate-800"
                  >
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    <span>My Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 rounded hover:bg-red-50 text-red-600 font-medium text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => { setAuthError(null); setAuthModalOpen(true); }}
                className="gap-1.5 text-xs font-semibold"
              >
                <LogIn className="h-3.5 w-3.5 text-brand-blue-700" />
                <span>Log In / Sign In</span>
              </Button>
              <Link href="/patient/dashboard">
                <Button size="sm" variant="primary" className="gap-1.5 font-medium text-xs">
                  <User className="h-3.5 w-3.5" />
                  <span>Patient Portal</span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="tel:112"
            className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold"
          >
            112
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link 
              href="/doctors" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-slate-100"
            >
              Find Doctors
            </Link>
            <Link 
              href="/consult/instant" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Instant Teleconsultation</span>
              <Badge variant="verified">Live &lt;15m</Badge>
            </Link>
            <Link 
              href="/pharmacy" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-slate-100"
            >
              Pharmacy Store
            </Link>
            <Link 
              href="/diagnostics" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-slate-100"
            >
              Lab Tests & Checkups
            </Link>
            <Link 
              href="/vault" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-slate-100"
            >
              Digital Health Vault
            </Link>
            <hr className="my-2 border-slate-200" />
            <div className="pt-1">
              <Button 
                size="sm" 
                variant="primary" 
                onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }}
                className="w-full gap-2 justify-center"
              >
                <LogIn className="h-4 w-4" />
                <span>Log In / Sign In</span>
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Interactive Authentication Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  KGS
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Sign In to Kaizentrix</h3>
                  <p className="text-[11px] text-slate-500">Access your healthcare records or clinical practice</p>
                </div>
              </div>
              <button 
                onClick={() => setAuthModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
                aria-label="Close Login Modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Role Tab Selector */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 m-4 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => { setAuthRole("PATIENT"); setAuthError(null); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authRole === "PATIENT" 
                    ? "bg-white text-brand-blue-700 shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Patient (Mobile OTP)</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthRole("DOCTOR"); setAuthError(null); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authRole === "DOCTOR" 
                    ? "bg-white text-brand-blue-700 shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Stethoscope className="h-3.5 w-3.5" />
                <span>Doctor / Clinician</span>
              </button>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="mx-4 mb-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {authError}
              </div>
            )}

            {/* Patient Login Form */}
            {authRole === "PATIENT" ? (
              <form onSubmit={handlePatientLogin} className="p-5 pt-1 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-600 font-medium"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Pre-filled with seeded demo patient account (+91 98765 43210)</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      SMS Verification Code (OTP)
                    </label>
                    <span className="text-[10px] text-brand-green-700 font-bold bg-brand-green-50 px-1.5 py-0.5 rounded">
                      Sandbox OTP: 123456
                    </span>
                  </div>
                  <input
                    type="text"
                    value={patientOtp}
                    onChange={(e) => setPatientOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-600 font-mono tracking-widest text-center text-sm font-bold"
                    maxLength={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="md"
                  variant="primary"
                  isLoading={authLoading}
                  className="w-full gap-2 font-bold py-2.5 mt-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Verify OTP & Sign In as Patient</span>
                </Button>
              </form>
            ) : (
              /* Doctor Login Form */
              <form onSubmit={handleDoctorLogin} className="p-5 pt-1 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinician Email
                  </label>
                  <input
                    type="email"
                    value={doctorEmail}
                    onChange={(e) => setDoctorEmail(e.target.value)}
                    placeholder="dr.name@kaizentrix.local"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-600 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Password
                  </label>
                  <input
                    type="password"
                    value={doctorPassword}
                    onChange={(e) => setDoctorPassword(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-600 font-medium"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      MFA Staff TOTP Code
                    </label>
                    <span className="text-[10px] text-brand-blue-700 font-bold bg-brand-blue-50 px-1.5 py-0.5 rounded">
                      Sandbox Code: 123456
                    </span>
                  </div>
                  <input
                    type="text"
                    value={doctorTotp}
                    onChange={(e) => setDoctorTotp(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-600 font-mono tracking-widest text-center text-sm font-bold"
                    maxLength={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="md"
                  variant="primary"
                  isLoading={authLoading}
                  className="w-full gap-2 font-bold py-2.5 mt-2"
                >
                  <Lock className="h-4 w-4" />
                  <span>Authenticate & Enter OPD Practice</span>
                </Button>
              </form>
            )}

            {/* Quick Demo Switcher Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                Quick 1-Click Demo Profiles
              </span>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthRole("PATIENT");
                    setPatientPhone("9876543210");
                    setPatientOtp("123456");
                  }}
                  className="text-[11px] font-semibold text-brand-blue-700 hover:underline bg-white border border-slate-200 px-2 py-1 rounded"
                >
                  Rahul Varma (Patient)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthRole("DOCTOR");
                    setDoctorEmail("dr.priya.sharma@apollo.kaizentrix.local");
                    setDoctorPassword("DoctorPass@2025!");
                    setDoctorTotp("123456");
                  }}
                  className="text-[11px] font-semibold text-brand-blue-700 hover:underline bg-white border border-slate-200 px-2 py-1 rounded"
                >
                  Dr. Priya Sharma (Cardiology)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
