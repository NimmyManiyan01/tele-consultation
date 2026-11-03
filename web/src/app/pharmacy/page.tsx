"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Pill, 
  Search, 
  ShoppingCart, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  FileText, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_PHARMACY_ITEMS } from "@/data/mock-store";
import { PharmacyItem } from "@/types";

interface CartItem extends PharmacyItem {
  quantity: number;
}

export default function PharmacyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [pincode, setPincode] = useState<string>("560038");
  const [isPincodeValid, setIsPincodeValid] = useState<boolean>(true);

  const categories = [
    { id: "ALL", label: "All Medicines" },
    { id: "CARDIOLOGY", label: "Cardiology & BP" },
    { id: "DIABETES", label: "Diabetes Care" },
    { id: "ANTIBIOTICS", label: "Antibiotics" },
    { id: "GASTRO", label: "Gastro & Acidity" },
    { id: "PAIN_RELIEF", label: "Pain Relief & Fever" },
    { id: "WELLNESS", label: "Vitamins & Minerals" }
  ];

  const filteredMedicines = MOCK_PHARMACY_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: PharmacyItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.id === item.id);
      if (existing) {
        return prev.map((ci) => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => 
      prev.map((ci) => {
        if (ci.id === id) {
          const newQty = ci.quantity + delta;
          return newQty > 0 ? { ...ci, quantity: newQty } : null;
        }
        return ci;
      }).filter(Boolean) as CartItem[]
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const requiresPrescription = cart.some((item) => item.requiresPrescription);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Pharmacy Top Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-teal-700/80 text-teal-100 border border-teal-500/40 text-xs py-0.5">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-300" /> CDSCO & Drugs Act Compliant
              </Badge>
              <Badge className="bg-emerald-600/80 text-white text-xs py-0.5">
                100% Genuine Medicines
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Kaizentrix Certified E-Pharmacy</h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Order verified prescription and OTC medications with temperature-controlled delivery. Prescription orders verified by registered pharmacists within 10 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link href="/pharmacy/upload" className="w-full sm:w-auto">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md">
                <FileText className="w-4 h-4 mr-1.5" /> Upload Doctor's Prescription
              </Button>
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 flex items-center justify-center w-full sm:w-auto"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-teal-900">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pincode & Delivery SLA Strip */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Delivery Location & Estimated SLA</p>
              <p className="text-slate-500 text-[11px]">Serving PIN: <span className="font-mono font-bold text-slate-700">{pincode}</span> (Indiranagar, Bengaluru)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold text-xs">
              <Clock className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Hyperlocal 2-Hour Delivery Available
            </Badge>
          </div>
        </div>

        {/* Search & Category Filter Navigation */}
        <div className="space-y-4">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by medicine name, generic salt (e.g. Telmisartan, Paracetamol), or company..."
              className="pl-10 text-xs sm:text-sm h-11 border-slate-300 rounded-xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-teal-700 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedicines.map((med) => {
            const discountPercent = Math.round(((med.mrp - med.price) / med.mrp) * 100);
            return (
              <Card key={med.id} className="p-5 border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className={`text-[10px] py-0 px-2 font-bold ${
                      med.schedule === "SCHEDULE_H1" 
                        ? "bg-rose-50 text-rose-800 border-rose-300" :
                      med.schedule === "SCHEDULE_H" 
                        ? "bg-amber-50 text-amber-800 border-amber-300" :
                        "bg-emerald-50 text-emerald-800 border-emerald-300"
                    }`}>
                      {med.schedule === "OTC" ? "OTC • No Rx Needed" : `Rx Required (${med.schedule})`}
                    </Badge>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{med.name}</h3>
                    <p className="text-xs text-teal-700 font-medium">{med.genericName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{med.manufacturer} • {med.packaging}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-slate-900">₹{med.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{med.mrp}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Inclusive of all GST taxes</span>
                  </div>

                  <Button 
                    size="sm" 
                    onClick={() => addToCart(med)}
                    className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Regulatory Disclosure Notice */}
        <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p>
            <strong>Statutory Rule (Drugs & Cosmetics Act 1940):</strong> Schedule H & Schedule H1 drugs cannot be dispensed without a valid prescription from a Registered Medical Practitioner (RMP). You will be prompted to attach or upload your prescription before order fulfillment.
          </p>
        </div>

      </div>

      {/* Slide-out Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-teal-700" />
                <h2 className="text-base font-bold text-slate-900">Medicine Cart ({totalCartCount})</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                  <Pill className="w-12 h-12 text-slate-300" />
                  <p className="text-sm font-medium">Your pharmacy cart is empty</p>
                  <p className="text-xs">Add prescription or OTC medicines from the catalog.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="space-y-0.5 max-w-[200px]">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-teal-700 truncate">{item.genericName}</p>
                      <p className="text-[11px] font-mono font-bold text-slate-700">₹{item.price * item.quantity}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 font-bold font-mono text-slate-900 text-xs">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                {requiresPrescription && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Your cart contains <strong>Schedule H/H1 drugs</strong>. You will be asked to attach a doctor's prescription during checkout.</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline text-sm">
                  <span className="text-slate-600 font-medium">To Pay:</span>
                  <span className="text-xl font-black text-slate-900">₹{cartSubtotal}</span>
                </div>

                <Link href="/pharmacy/upload" className="block">
                  <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs py-3 shadow-md">
                    Proceed to Prescription Verification <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

