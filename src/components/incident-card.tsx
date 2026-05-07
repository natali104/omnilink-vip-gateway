"use client";

import type { VipIncident } from "@/types/incident";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  User,
  Hotel,
  Plane,
  UtensilsCrossed,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const URGENCY_STYLES = {
  Critical: {
    border: "border-red-500/30",
    bg: "bg-red-500/5 hover:bg-red-500/10",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
    icon: <ShieldAlert className="h-4 w-4 text-red-400" />,
    glow: "shadow-red-500/10 hover:shadow-red-500/20",
    pulse: true,
  },
  Medium: {
    border: "border-amber-500/20",
    bg: "bg-amber-500/5 hover:bg-amber-500/8",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
    glow: "shadow-amber-500/5 hover:shadow-amber-500/10",
    pulse: false,
  },
  Low: {
    border: "border-slate-700/50",
    bg: "bg-slate-800/30 hover:bg-slate-800/50",
    badge: "bg-slate-600/30 text-slate-400 border-slate-600/30",
    icon: <Clock className="h-4 w-4 text-slate-400" />,
    glow: "",
    pulse: false,
  },
};

const INDUSTRY_ICON = {
  Hotel: <Hotel className="h-3.5 w-3.5" />,
  Airline: <Plane className="h-3.5 w-3.5" />,
  Restaurant: <UtensilsCrossed className="h-3.5 w-3.5" />,
};

const STATUS_BADGE: Record<string, string> = {
  Open: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  AI_Approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Human_Overridden: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Resolved: "bg-slate-600/20 text-slate-400 border-slate-600/30",
};

interface IncidentCardProps {
  incident: VipIncident;
  onClick: () => void;
}

export function IncidentCard({ incident, onClick }: IncidentCardProps) {
  const urgency = incident.ai_urgency ?? "Low";
  const style = URGENCY_STYLES[urgency];

  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        style.border,
        style.bg,
        style.glow,
        style.pulse && "animate-pulse-glow"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {style.icon}
          <h3 className="text-sm font-semibold text-white truncate">
            {incident.ai_issue_type ?? "Pending Triage"}
          </h3>
        </div>
        <Badge
          variant="outline"
          className={cn("text-[10px] shrink-0 border", style.badge)}
        >
          {urgency}
        </Badge>
      </div>

      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
        {incident.raw_incident_text}
      </p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-500">
            {INDUSTRY_ICON[incident.industry] ?? null}
          </div>
          <Badge
            variant="outline"
            className="text-[10px] text-slate-500 border-slate-700/50"
          >
            {incident.client_tier}
          </Badge>
          {incident.location && (
            <span className="flex items-center gap-0.5 text-[10px] text-slate-600">
              <MapPin className="h-2.5 w-2.5" />
              {incident.location}
            </span>
          )}
        </div>
        <Badge
          variant="outline"
          className={cn("text-[10px] border", STATUS_BADGE[incident.status])}
        >
          {incident.status === "AI_Approved" && (
            <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
          )}
          {incident.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <span className="flex items-center gap-1 text-[10px] text-slate-500">
          <User className="h-3 w-3" />
          {incident.staff_name}
        </span>
        <span className="text-[10px] text-slate-600">
          {formatDistanceToNow(new Date(incident.created_at), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
}
