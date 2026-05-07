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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-amber-400" />
            Incident Detail
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            ID: {incident.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Raw vs AI comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Raw Field Report
              </h3>
              <div className="bg-slate-800 rounded-lg p-3 text-sm text-slate-300 border border-slate-700">
                {incident.raw_incident_text}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-1">
                <Brain className="h-4 w-4" />
                AI Structured Breakdown
              </h3>
              <div className="bg-slate-800 rounded-lg p-3 text-sm space-y-2 border border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Issue Type</span>
                  <span className="text-white font-medium">
                    {incident.ai_issue_type ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Client Tier</span>
                  <span className="text-white font-medium">
                    {incident.client_tier}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Urgency</span>
                  <span className={cn("font-bold", urgencyColor)}>
                    {incident.ai_urgency ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-white font-medium">
                    {incident.ai_confidence != null
                      ? `${(incident.ai_confidence * 100).toFixed(0)}%`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-300">
              AI Reasoning
            </h3>
            <div className="bg-blue-950/30 border border-blue-800/40 rounded-lg p-3 text-sm text-blue-200">
              {incident.ai_reasoning ?? "No reasoning provided."}
            </div>
          </div>

          {/* AI Suggested Action */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-300">
              AI Suggested Action
            </h3>
            <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-3 text-sm text-amber-200">
              {incident.ai_suggested_action ?? "No suggestion."}
            </div>
          </div>

          {/* Audit trail for resolved incidents */}
          {incident.status !== "Open" && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-300">
                Resolution Audit
              </h3>
              <div className="bg-slate-800 rounded-lg p-3 text-sm space-y-1 border border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <Badge variant="outline" className="text-xs">
                    {incident.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resolved By</span>
                  <span className="text-white">{incident.resolved_by}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resolved At</span>
                  <span className="text-white">
                    {incident.resolved_at
                      ? new Date(incident.resolved_at).toLocaleString()
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Final Action</span>
                  <span className="text-white text-right max-w-[60%]">
                    {incident.final_action_taken}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Human-in-the-loop actions */}
          {isResolvable && (
            <>
              <Separator className="bg-slate-700" />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white">
                  Manager Decision
                </h3>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-xs">
                    Manager Name (required for audit)
                  </Label>
                  <Input
                    placeholder="e.g. James Wilson"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
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
                      placeholder="Specify override action…"
                      value={overrideAction}
                      onChange={(e) => setOverrideAction(e.target.value)}
                      rows={2}
                      className="bg-slate-800 border-slate-600 text-white resize-none text-sm"
                    />
                    <Button
                      onClick={() => handleAction("override")}
                      disabled={loading !== null}
                      variant="outline"
                      className="w-full border-purple-500 text-purple-300 hover:bg-purple-900/30"
                    >
                      {loading === "override" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <PenLine className="mr-2 h-4 w-4" />
                      )}
                      Override with Manual Action
                    </Button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-2">
                    {error}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
