"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
  Shield,
  Hotel,
  Plane,
  UtensilsCrossed,
  ArrowLeft,
  MapPin,
} from "lucide-react";

const INDUSTRIES = [
  { value: "Hotel", label: "Hotel", icon: Hotel, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { value: "Airline", label: "Airline", icon: Plane, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { value: "Restaurant", label: "Restaurant", icon: UtensilsCrossed, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
];

const TIERS: Record<string, string[]> = {
  Hotel: ["Presidential Suite", "Platinum", "Gold", "Silver", "Standard"],
  Airline: ["First Class", "Business", "Premium Economy", "Economy"],
  Restaurant: ["Michelin VIP", "Private Dining", "Premium", "Regular"],
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ReportPage() {
  const [industry, setIndustry] = useState("");
  const [staffName, setStaffName] = useState("");
  const [clientTier, setClientTier] = useState("");
  const [location, setLocation] = useState("");
  const [incidentText, setIncidentText] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit =
    industry && staffName.trim() && clientTier && incidentText.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staff_name: staffName.trim(),
          client_tier: clientTier,
          raw_incident_text: incidentText.trim(),
          industry,
          location: location.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setSubmitState("success");
      setStaffName("");
      setClientTier("");
      setIncidentText("");
      setLocation("");
      setIndustry("");
      setTimeout(() => setSubmitState("idle"), 4000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setSubmitState("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">OmniLink</span>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </nav>

      <div className="relative z-10 flex items-start justify-center px-4 pt-6 pb-12 sm:pt-12">
        <div className="w-full max-w-lg">
          <div className="glass-strong rounded-3xl p-8 glow-amber">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Send className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Incident Report</h1>
                <p className="text-sm text-slate-400">AI triage is automatic</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Industry selector */}
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Industry</Label>
                <div className="grid grid-cols-3 gap-3">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind.value}
                      type="button"
                      onClick={() => {
                        setIndustry(ind.value);
                        setClientTier("");
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                        industry === ind.value
                          ? ind.color
                          : "border-slate-700/50 bg-slate-800/30 text-slate-500 hover:border-slate-600"
                      }`}
                    >
                      <ind.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{ind.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="staffName" className="text-slate-300 text-sm">
                    Your Name
                  </Label>
                  <Input
                    id="staffName"
                    placeholder="e.g. Maria Santos"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50"
                    disabled={submitState === "submitting"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-300 text-sm">
                    Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                    <Input
                      id="location"
                      placeholder="e.g. Lobby, Gate B2"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 pl-9 focus:border-amber-500/50"
                      disabled={submitState === "submitting"}
                    />
                  </div>
                </div>
              </div>

              {industry && (
                <div className="space-y-2">
                  <Label htmlFor="clientTier" className="text-slate-300 text-sm">
                    Client Tier
                  </Label>
                  <Select
                    value={clientTier}
                    onValueChange={setClientTier}
                    disabled={submitState === "submitting"}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIERS[industry]?.map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          {tier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="incidentText" className="text-slate-300 text-sm">
                  Incident Description
                </Label>
                <Textarea
                  id="incidentText"
                  placeholder="Describe the incident — include names, locations, times…"
                  rows={4}
                  value={incidentText}
                  onChange={(e) => setIncidentText(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 resize-none focus:border-amber-500/50"
                  disabled={submitState === "submitting"}
                />
                <p className="text-xs text-slate-600">Min 10 characters</p>
              </div>

              {submitState === "error" && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 rounded-xl p-3 text-sm border border-red-500/20">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {submitState === "success" && (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 rounded-xl p-3 text-sm border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>Incident submitted and triaged successfully.</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={!canSubmit || submitState === "submitting"}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold h-12 shadow-lg shadow-amber-500/20"
              >
                {submitState === "submitting" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing &amp; Triaging…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit &amp; Auto-Triage
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
