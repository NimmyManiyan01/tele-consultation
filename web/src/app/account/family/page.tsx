"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X,
  Heart,
  Baby
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_DEPENDENTS } from "@/data/mock-store";
import { Dependent } from "@/types";

export default function FamilyAccountManagerPage() {
  const [dependents, setDependents] = useState<Dependent[]>(MOCK_DEPENDENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<"CHILD" | "PARENT" | "SPOUSE" | "OTHER">("CHILD");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");

  const handleAddDependent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDep: Dependent = {
      id: `dep-${Date.now()}`,
      fullName: name,
      relationship,
      gender,
      dateOfBirth: dob || "2020-01-01",
      bloodGroup,
      knownAllergies: allergies ? allergies.split(",").map(s => s.trim()) : [],
      chronicConditions: conditions ? conditions.split(",").map(s => s.trim()) : [],
    };

    setDependents(prev => [...prev, newDep]);
    setIsModalOpen(false);
    setName("");
    setAllergies("");
    setConditions("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this family profile?")) {
      setDependents(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Family & Dependent Profiles
              </h1>
              <Badge variant="verified" className="text-xs">
                {dependents.length} Profiles Linked
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Add family members to book doctor consultations on their behalf and maintain separate medical records.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-2 font-bold shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Family Member</span>
          </Button>
        </div>

        {/* Dependents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dependents.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 shadow-sm">
              <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Family Members Registered</h3>
              <p className="text-xs text-slate-500 mt-1">Add your dependents or family members to manage their consultations together.</p>
              <Button size="sm" onClick={() => setIsModalOpen(true)} className="mt-3 text-xs gap-1.5">
                <UserPlus className="h-3.5 w-3.5" />
                <span>Add First Family Member</span>
              </Button>
            </div>
          )}
          {dependents.map((dep) => {
            const isSelf = dep.relationship === "SELF";
            return (
              <Card key={dep.id} className="bg-white border-slate-200 shadow-sm overflow-hidden hover:border-brand-blue-300 transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-brand-blue-50 text-brand-blue-700 font-bold text-lg flex items-center justify-center shrink-0">
                        {dep.fullName[0]}
                      </div>
                      <div>
                        <h2 className="font-bold text-base text-slate-900">{dep.fullName}</h2>
                        <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {dep.relationship}
                        </span>
                      </div>
                    </div>

                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => handleDelete(dep.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        aria-label="Delete Profile"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Clinical Demographics */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Date of Birth</span>
                      <span className="font-medium text-slate-800">{dep.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Blood Group</span>
                      <span className="font-bold text-brand-blue-700">{dep.bloodGroup || "Not Set"}</span>
                    </div>
                  </div>

                  {/* Allergies & Conditions */}
                  <div className="space-y-1.5 text-xs">
                    {dep.knownAllergies.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-red-700">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span>Allergies: <strong>{dep.knownAllergies.join(", ")}</strong></span>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-[11px]">No documented allergies</p>
                    )}

                    {dep.chronicConditions.length > 0 && (
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Heart className="h-3.5 w-3.5 text-brand-green-600 shrink-0" />
                        <span>Chronic: {dep.chronicConditions.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link href={`/doctors`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full text-xs font-semibold gap-1">
                        <Calendar className="h-3.5 w-3.5 text-brand-blue-600" />
                        <span>Book Visit</span>
                      </Button>
                    </Link>
                    <Link href={`/vault`} className="flex-1">
                      <Button size="sm" variant="ghost" className="w-full text-xs text-slate-600">
                        View Records
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add Dependent Modal (OVERLAY-02) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-brand-blue-700" />
                  <span>Add Family Member Profile</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddDependent} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Full Name</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Suman Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">Relationship</label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value as any)}
                      className="w-full p-2.5 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                    >
                      <option value="CHILD">Child / Dependent</option>
                      <option value="PARENT">Parent / Senior</option>
                      <option value="SPOUSE">Spouse</option>
                      <option value="OTHER">Other Dependent</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">Date of Birth</label>
                    <Input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full p-2.5 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full p-2.5 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Known Drug Allergies (Optional)</label>
                  <Input
                    type="text"
                    placeholder="e.g. Penicillin, Sulfa drugs (comma-separated)..."
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Pre-existing Chronic Conditions (Optional)</label>
                  <Input
                    type="text"
                    placeholder="e.g. Hypertension, Asthma, Type 2 Diabetes..."
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="font-bold shadow-md"
                  >
                    Save Family Profile
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

