"use client";

import { useState } from "react";
import type { VipIncident } from "@/types/incident";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  PenLine,
  Loader2,
  Brain,
  FileText,
  Shield,
  MapPin,
  Hotel,
  Plane,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

const INDUSTRY_ICON = {
  Hotel: <Hotel className="h-4 w-4 text-amber-400" />,
  Airline: <Plane className="h-4 w-4 text-blue-400" />,
  Restaurant: <UtensilsCrossed className="h-4 w-4 text-emerald-400" />,
};

interface IncidentDetailProps {
  incident: VipIncident | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolved: (updated: VipIncident) => void;
}

export function IncidentDetail({
  incident,
  open,
  onOpenChange,
  onResolved,
}: IncidentDetailProps) {
  const [managerName, setManagerName] = useState("");
  const [overrideAction, setOverrideAction] = useState("");
  const [loading, setLoading] = useState<"approve" | "override" | null>(null);
  const [error, setError] = useState("");

  if (!incident) return null;

  const isResolvable = incident.status === "Open";

  async function handleAction(action: "approve" | "override") {
    if (!managerName.trim()) {
      setError("Manager name is required for the audit trail.");
      return;
    }
    if (action === "override" && !overrideAction.trim()) {
      setError("Please specify the override action.");
      return;
    }

    setLoading(action);
    setError("");

    try {
      const res = await fetch("/api/incidents/resolve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incident_id: incident!.id,
          action,
          resolved_by: managerName.trim(),
          final_action_taken:
            action === "override" ? overrideAction.trim() : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to resolve");
      }

      const data = await res.json();
      onResolved(data.incident);
      onOpenChange(false);
      setManagerName("");
      setOverrideAction("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(null);
    }
  }

  const urgencyColor = {
    Critical: "text-red-400",
    Medium: "text-amber-400",
    Low: "text-slate-400",
  }[incident.ai_urgency ?? "Low"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0c1222] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-amber-400" />
            Incident Detail
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-2">
            <span className="font-mono text-xs">{incident.id.slice(0, 8)}…</span>
            {INDUSTRY_ICON[incident.industry]}
            <span>{incident.industry}</span>
            {incident.location && (
              <>
                <MapPin className="h-3 w-3 ml-1" />
                <span>{incident.location}</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Raw Field Report
              </h3>
              <div className="bg-white/[0.03] rounded-xl p-3 text-sm text-slate-300 border border-white/5">
                {incident.raw_incident_text}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5" />
                AI Breakdown
              </h3>
              <div className="bg-white/[0.03] rounded-xl p-3 text-sm space-y-2 border border-white/5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Issue</span>
                  <span className="text-white font-medium">{incident.ai_issue_type ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tier</span>
                  <span className="text-white font-medium">{incident.client_tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Urgency</span>
                  <span className={cn("font-bold", urgencyColor)}>{incident.ai_urgency ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Confidence</span>
                  <span className="text-white font-medium">
                    {incident.ai_confidence != null ? `${(incident.ai_confidence * 100).toFixed(0)}%` : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Reasoning</h3>
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 text-sm text-blue-200">
              {incident.ai_reasoning ?? "No reasoning provided."}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suggested Action</h3>
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-sm text-amber-200">
              {incident.ai_suggested_action ?? "No suggestion."}
            </div>
          </div>

          {incident.status !== "Open" && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audit Trail</h3>
              <div className="bg-white/[0.03] rounded-xl p-3 text-sm space-y-1.5 border border-white/5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <Badge variant="outline" className="text-[10px]">{incident.status.replace("_", " ")}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resolved By</span>
                  <span className="text-white">{incident.resolved_by}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resolved At</span>
                  <span className="text-white">
                    {incident.resolved_at ? new Date(incident.resolved_at).toLocaleString() : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Final Action</span>
                  <span className="text-white text-right max-w-[60%]">{incident.final_action_taken}</span>
                </div>
              </div>
            </div>
          )}

          {isResolvable && (
            <>
              <Separator className="bg-white/5" />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white">Manager Decision</h3>
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs">Manager Name (audit)</Label>
                  <Input
                    placeholder="e.g. James Wilson"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleAction("approve")}
                    disabled={loading !== null}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    {loading === "approve" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    Approve AI Action
                  </Button>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Override action…"
                      value={overrideAction}
                      onChange={(e) => setOverrideAction(e.target.value)}
                      rows={2}
                      className="bg-white/5 border-white/10 text-white resize-none text-sm"
                    />
                    <Button
                      onClick={() => handleAction("override")}
                      disabled={loading !== null}
                      variant="outline"
                      className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                    >
                      {loading === "override" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <PenLine className="mr-2 h-4 w-4" />
                      )}
                      Override
                    </Button>
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 rounded-xl p-2 border border-red-500/20">{error}</p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
