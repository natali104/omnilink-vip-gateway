"use client";

import type { VipIncident } from "@/types/incident";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const URGENCY_STYLES = {
  Critical: {
    border: "border-red-500/60",
    bg: "bg-red-500/10",
    badge: "bg-red-600 hover:bg-red-600 text-white",
    icon: <ShieldAlert className="h-4 w-4 text-red-400" />,
    pulse: "animate-pulse",
  },
  Medium: {
    border: "border-amber-500/40",
    bg: "bg-amber-500/5",
    badge: "bg-amber-600 hover:bg-amber-600 text-white",
    icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
    pulse: "",
  },
  Low: {
    border: "border-slate-600",
    bg: "bg-slate-800/50",
    badge: "bg-slate-600 hover:bg-slate-600 text-white",
    icon: <Clock className="h-4 w-4 text-slate-400" />,
    pulse: "",
  },
};

const STATUS_BADGE: Record<string, string> = {
  Open: "bg-blue-600/80 hover:bg-blue-600 text-white",
  AI_Approved: "bg-emerald-600/80 hover:bg-emerald-600 text-white",
  Human_Overridden: "bg-purple-600/80 hover:bg-purple-600 text-white",
  Resolved: "bg-slate-600 hover:bg-slate-600 text-white",
};

interface IncidentCardProps {
  incident: VipIncident;
  onClick: () => void;
}

export function IncidentCard({ incident, onClick }: IncidentCardProps) {
  const urgency = incident.ai_urgency ?? "Low";
  const style = URGENCY_STYLES[urgency];

  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
        style.border,
        style.bg,
        style.pulse
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {style.icon}
            <CardTitle className="text-sm font-semibold text-white truncate">
              {incident.ai_issue_type ?? "Pending Triage"}
            </CardTitle>
          </div>
          <Badge className={cn("text-xs shrink-0", style.badge)}>
            {urgency}
          </Badge>
        </div>
        <CardDescription className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <User className="h-3 w-3" />
          {incident.staff_name} &middot;{" "}
          {formatDistanceToNow(new Date(incident.created_at), {
            addSuffix: true,
          })}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        <p className="text-xs text-slate-300 line-clamp-2 mb-2">
          {incident.raw_incident_text}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
            {incident.client_tier}
          </Badge>
          <div className="flex items-center gap-2">
            {incident.ai_confidence != null && (
              <span className="text-xs text-slate-500">
                {(incident.ai_confidence * 100).toFixed(0)}% conf.
              </span>
            )}
            <Badge className={cn("text-xs", STATUS_BADGE[incident.status])}>
              {incident.status === "AI_Approved" && (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              )}
              {incident.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
