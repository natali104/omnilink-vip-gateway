"use client";

import { useState } from "react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

const CLIENT_TIERS = [
  "First Class",
  "Business",
  "Platinum",
  "Gold",
  "Silver",
  "General",
];

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ReportPage() {
  const [staffName, setStaffName] = useState("");
  const [clientTier, setClientTier] = useState("");
  const [incidentText, setIncidentText] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit =
    staffName.trim() && clientTier && incidentText.trim().length >= 10;

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

      setTimeout(() => setSubmitState("idle"), 4000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setSubmitState("error");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-start justify-center p-4 pt-8 sm:pt-16">
      <Card className="w-full max-w-lg border-slate-700 bg-slate-800/80 backdrop-blur shadow-2xl">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Send className="h-4 w-4 text-amber-400" />
            </div>
            <CardTitle className="text-xl text-white">
              OmniLink Incident Report
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            Submit a rapid incident report. AI triage is automatic.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="staffName" className="text-slate-300">
                Your Name
              </Label>
              <Input
                id="staffName"
                placeholder="e.g. Maria Santos"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                disabled={submitState === "submitting"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientTier" className="text-slate-300">
                Client Tier
              </Label>
              <Select
                value={clientTier}
                onValueChange={setClientTier}
                disabled={submitState === "submitting"}
              >
                <SelectTrigger
                  id="clientTier"
                  className="bg-slate-700/50 border-slate-600 text-white"
                >
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_TIERS.map((tier) => (
                    <SelectItem key={tier} value={tier}>
                      {tier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incidentText" className="text-slate-300">
                Incident Description
              </Label>
              <Textarea
                id="incidentText"
                placeholder="Describe the incident in as much detail as possible…"
                rows={5}
                value={incidentText}
                onChange={(e) => setIncidentText(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                disabled={submitState === "submitting"}
              />
              <p className="text-xs text-slate-500">
                Minimum 10 characters. Be specific — include names, locations,
                and times.
              </p>
            </div>

            {submitState === "error" && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 rounded-lg p-3 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {submitState === "success" && (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 rounded-lg p-3 text-sm">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>
                  Incident submitted and triaged. The Duty Manager has been
                  notified.
                </span>
              </div>
            )}

            <Button
              type="submit"
              disabled={!canSubmit || submitState === "submitting"}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold"
            >
              {submitState === "submitting" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting &amp; Triaging…
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Incident
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
