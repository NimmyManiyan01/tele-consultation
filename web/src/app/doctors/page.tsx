"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Video, 
  Building2, 
  Calendar, 
  RotateCcw, 
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_CLINICIANS } from "@/data/mock-store";
import { formatCurrency } from "@/lib/utils";
import { kgsApi } from "@/lib/api-client";

export default function DoctorsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("ALL");
  const [maxFee, setMaxFee] = useState<number>(1200);
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [onlyInstantOnline, setOnlyInstantOnline] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [clinicians, setClinicians] = useState<any[]>(MOCK_CLINICIANS);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch doctors from backend with local fallback
  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    kgsApi.doctors.list({
      specialty: selectedSpecialty,
      city: selectedCity,
      maxFee,
      onlineOnly: onlyInstantOnline,
      search: searchQuery
    }).then((data) => {
      if (isMounted) {
        setClinicians(data);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => { isMounted = false; };
  }, [searchQuery, selectedSpecialty, maxFee, selectedCity, onlyInstantOnline]);

  // Dynamic filter evaluation
  const filteredDoctors = useMemo(() => {
    return clinicians.filter((doc) => {
      // Query match
      const matchesQuery = 
        !searchQuery ||
        doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.primarySpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subSpecialties.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Specialty match
      const matchesSpecialty = selectedSpecialty === "ALL" || doc.primarySpecialty === selectedSpecialty;

      // Fee match
      const matchesFee = doc.videoFee <= maxFee;

      // City match
      const matchesCity = selectedCity === "ALL" || doc.clinicCity === selectedCity;

      // Instant online match
      const matchesInstant = !onlyInstantOnline || doc.isOnlineForInstant;

      return matchesQuery && matchesSpecialty && matchesFee && matchesCity && matchesInstant;
    });
  }, [clinicians, searchQuery, selectedSpecialty, maxFee, selectedCity, onlyInstantOnline]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("ALL");
    setMaxFee(1200);
    setSelectedCity("ALL");
    setOnlyInstantOnline(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Breadcrumb & Heading */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-brand-blue-700">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-800 font-medium">Find Doctors & Specialists</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Verified Medical Practitioners
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {filteredDoctors.length} accredited doctors compliant with Indian Telemedicine Guidelines 2020.
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex sm:hidden">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="gap-2 w-full justify-center"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters & Sorting ({selectedSpecialty !== "ALL" || onlyInstantOnline ? "Active" : "Default"})</span>
              </Button>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Filter Sidebar + Results */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className={`md:block ${mobileFilterOpen ? "block" : "hidden"} md:col-span-1 space-y-6`}>
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-6 sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-brand-blue-700" />
                  Filter Search
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-brand-blue-700 hover:text-brand-blue-900 font-medium flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>

              {/* Instant Online Toggle */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyInstantOnline}
                    onChange={(e) => setOnlyInstantOnline(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-blue-600 focus:ring-brand-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Online for Instant Consult (&lt;15m)
                  </span>
                </label>
              </div>

              {/* Specialty Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Clinical Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full text-xs rounded-md border border-slate-200 p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                >
                  <option value="ALL">All Medical Specialties</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Dermatology">Dermatology</option>
                </select>
              </div>

              {/* City Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Clinic Location
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs rounded-md border border-slate-200 p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                >
                  <option value="ALL">All Metro Locations</option>
                  <option value="Bengaluru">Bengaluru, Karnataka</option>
                  <option value="Mumbai">Mumbai, Maharashtra</option>
                  <option value="Chennai">Chennai, Tamil Nadu</option>
                  <option value="Hyderabad">Hyderabad, Telangana</option>
                </select>
              </div>

              {/* Max Consultation Fee Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Max Video Fee</span>
                  <span className="font-bold text-brand-blue-700">{formatCurrency(maxFee)}</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="1200"
                  step="50"
                  value={maxFee}
                  onChange={(e) => setMaxFee(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹400</span>
                  <span>₹1,200</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Results List */}
          <main className="md:col-span-3 space-y-4">
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <Input
                type="text"
                placeholder="Search by clinician name or symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>

            {/* Empty State */}
            {filteredDoctors.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-800">No doctors match your filter criteria</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try relaxing the fee limit, switching the city filter to 'All Metro Locations', or clearing your search keywords.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              /* Doctor Cards Feed */
              filteredDoctors.map((doc) => (
                <Card 
                  key={doc.id} 
                  className="overflow-hidden border border-slate-200 hover:border-brand-blue-300 transition-all bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Doctor Avatar */}
                      <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-brand-blue-600 to-brand-blue-800 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow">
                        {doc.fullName.split(" ").slice(1).map((n: string) => n[0]).join("")}
                      </div>

                      {/* Doctor Information */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="font-bold text-lg text-slate-900 hover:text-brand-blue-700">
                                <Link href={`/doctor/${doc.id}`}>{doc.fullName}</Link>
                              </h2>
                              {doc.isOnlineForInstant && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-green-100 text-brand-green-800">
                                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green-500 animate-pulse" />
                                  Online Now
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-brand-blue-700">
                              {doc.primarySpecialty} • {doc.experienceYears} Years Clinical Experience
                            </p>
                          </div>

                          <Badge variant="verified" className="gap-1 text-xs shrink-0">
                            <ShieldCheck className="h-3.5 w-3.5 text-brand-blue-600" />
                            <span>{doc.councilRegistrationNumber}</span>
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-600">
                          {doc.degrees.join(", ")} — {doc.stateMedicalCouncil}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            {doc.rating}
                          </span>
                          <span>({doc.reviewCount} patient reviews)</span>
                          <span>•</span>
                          <span className="text-slate-500">{doc.languages.join(", ")}</span>
                        </div>

                        <div className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{doc.clinicName}, {doc.clinicCity}</span>
                        </div>

                        {/* Booking & Fee Footer */}
                        <div className="border-t border-slate-100 pt-3 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Video Consult</span>
                              <span className="text-sm font-bold text-slate-900">{formatCurrency(doc.videoFee)}</span>
                            </div>
                            <div className="border-l border-slate-200 pl-4">
                              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Next Available</span>
                              <span className="text-xs font-semibold text-brand-green-700 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {doc.nextAvailableSlot}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link href={`/doctor/${doc.id}`}>
                              <Button size="sm" variant="outline">
                                View Profile
                              </Button>
                            </Link>
                            <Link href={`/booking/${doc.id}`}>
                              <Button size="sm" variant="primary" className="gap-1.5 shadow-sm">
                                <Video className="h-3.5 w-3.5" />
                                <span>Book Video Consult</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

