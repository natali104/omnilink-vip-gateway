"use client";

import { useEffect, useState, useCallback } from "react";
import type { VipIncident, Urgency } from "@/types/incident";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { IncidentCard } from "@/components/incident-card";
import { IncidentDetail } from "@/components/incident-detail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Radio,
  RefreshCw,
  Shield,
  Wifi,
  WifiOff,
  LayoutGrid,
} from "lucide-react";

const URGENCY_ORDER: Record<Urgency, number> = {
  Critical: 0,
  Medium: 1,
  Low: 2,
};

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<VipIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<VipIncident | null>(
    null
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      if (data.incidents) {
        setIncidents(data.incidents);
      }
    } catch (err) {
      console.error("Failed to fetch incidents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel("vip-incidents-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "vip_incidents" },
        (payload) => {
          setIncidents((prev) => [payload.new as VipIncident, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "vip_incidents" },
        (payload) => {
          const updated = payload.new as VipIncident;
          setIncidents((prev) =>
            prev.map((i) => (i.id === updated.id ? updated : i))
          );
          if (selectedIncident?.id === updated.id) {
            setSelectedIncident(updated);
          }
        }
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedIncident?.id]);

  const filtered = incidents
    .filter((i) => {
      if (filterUrgency !== "all" && i.ai_urgency !== filterUrgency)
        return false;
      if (filterStatus !== "all" && i.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => {
      const ua = URGENCY_ORDER[a.ai_urgency ?? "Low"];
      const ub = URGENCY_ORDER[b.ai_urgency ?? "Low"];
      if (ua !== ub) return ua - ub;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  const stats = {
    total: incidents.length,
    critical: incidents.filter((i) => i.ai_urgency === "Critical").length,
    open: incidents.filter((i) => i.status === "Open").length,
  };

  function handleCardClick(incident: VipIncident) {
    setSelectedIncident(incident);
    setDetailOpen(true);
  }

  function handleResolved(updated: VipIncident) {
    setIncidents((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                OmniLink Operations Board
              </h1>
              <p className="text-xs text-slate-500">
                VIP Incident Command &amp; Resolution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {connected ? (
                <Wifi className="h-4 w-4 text-emerald-400" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-400" />
              )}
              <span
                className={`text-xs ${connected ? "text-emerald-400" : "text-red-400"}`}
              >
                {connected ? "Live" : "Offline"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchIncidents}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Total Incidents
            </p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-red-950/30 rounded-xl p-4 border border-red-800/30">
            <p className="text-xs text-red-400 uppercase tracking-wider">
              Critical
            </p>
            <p className="text-2xl font-bold text-red-300 mt-1">
              {stats.critical}
            </p>
          </div>
          <div className="bg-blue-950/30 rounded-xl p-4 border border-blue-800/30">
            <p className="text-xs text-blue-400 uppercase tracking-wider">
              Open
            </p>
            <p className="text-2xl font-bold text-blue-300 mt-1">
              {stats.open}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-400">Filter:</span>
          </div>
          <Select value={filterUrgency} onValueChange={setFilterUrgency}>
            <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-white text-sm h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgency</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white text-sm h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="AI_Approved">AI Approved</SelectItem>
              <SelectItem value="Human_Overridden">Overridden</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Badge
            variant="outline"
            className="text-xs text-slate-400 border-slate-700"
          >
            {filtered.length} result{filtered.length !== 1 && "s"}
          </Badge>
        </div>

        {/* Incident grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Radio className="h-6 w-6 text-amber-400 animate-spin" />
            <span className="ml-2 text-slate-400">Loading incidents…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Shield className="h-12 w-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">
              No incidents match the current filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onClick={() => handleCardClick(incident)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Detail dialog */}
      <IncidentDetail
        incident={selectedIncident}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onResolved={handleResolved}
      />
    </div>
  );
}
