"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
  RefreshCw,
  Shield,
  Wifi,
  WifiOff,
  Send,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Hotel,
  Plane,
  UtensilsCrossed,
  User,
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
  const [selectedIncident, setSelectedIncident] = useState<VipIncident | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterIndustry, setFilterIndustry] = useState<string>("all");

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      if (data.incidents) setIncidents(data.incidents);
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
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "vip_incidents" }, (payload) => {
        setIncidents((prev) => [payload.new as VipIncident, ...prev]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "vip_incidents" }, (payload) => {
        const updated = payload.new as VipIncident;
        setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        if (selectedIncident?.id === updated.id) setSelectedIncident(updated);
      })
      .subscribe((status) => setConnected(status === "SUBSCRIBED"));

    return () => { supabase.removeChannel(channel); };
  }, [selectedIncident?.id]);

  const filtered = incidents
    .filter((i) => {
      if (filterUrgency !== "all" && i.ai_urgency !== filterUrgency) return false;
      if (filterStatus !== "all" && i.status !== filterStatus) return false;
      if (filterIndustry !== "all" && i.industry !== filterIndustry) return false;
      return true;
    })
    .sort((a, b) => {
      const ua = URGENCY_ORDER[a.ai_urgency ?? "Low"];
      const ub = URGENCY_ORDER[b.ai_urgency ?? "Low"];
      if (ua !== ub) return ua - ub;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const stats = {
    total: incidents.length,
    critical: incidents.filter((i) => i.ai_urgency === "Critical").length,
    open: incidents.filter((i) => i.status === "Open").length,
    resolved: incidents.filter((i) => i.status !== "Open").length,
    hotels: incidents.filter((i) => i.industry === "Hotel").length,
    airlines: incidents.filter((i) => i.industry === "Airline").length,
    restaurants: incidents.filter((i) => i.industry === "Restaurant").length,
  };

  return (
    <div className="min-h-screen bg-[#070b14]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/3 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/5 glass sticky top-0">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white hidden sm:block">OmniLink</span>
            </Link>
            <div className="h-5 w-px bg-white/10 hidden sm:block" />
            <h1 className="text-sm font-semibold text-slate-300 hidden sm:block">
              Operations Board
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5">
              {connected ? (
                <Wifi className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 text-red-400" />
              )}
              <span className={`text-xs font-medium ${connected ? "text-emerald-400" : "text-red-400"}`}>
                {connected ? "Live" : "Offline"}
              </span>
            </div>
            <Button onClick={fetchIncidents} variant="ghost" size="sm" className="text-slate-400 hover:text-white h-8">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <Link href="/report">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white h-8">
                <Send className="h-3.5 w-3.5 mr-1" />
                Report
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-8">
                <User className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="glass rounded-xl p-4 group hover:bg-white/[0.04] transition-all">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Total</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="glass rounded-xl p-4 border-red-500/10 group hover:bg-red-500/5 transition-all">
            <div className="flex items-center gap-1 mb-1">
              <ShieldAlert className="h-3 w-3 text-red-400" />
              <p className="text-[10px] text-red-400/70 uppercase tracking-wider">Critical</p>
            </div>
            <p className="text-2xl font-bold text-red-300">{stats.critical}</p>
          </div>
          <div className="glass rounded-xl p-4 group hover:bg-blue-500/5 transition-all">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="h-3 w-3 text-blue-400" />
              <p className="text-[10px] text-blue-400/70 uppercase tracking-wider">Open</p>
            </div>
            <p className="text-2xl font-bold text-blue-300">{stats.open}</p>
          </div>
          <div className="glass rounded-xl p-4 group hover:bg-emerald-500/5 transition-all">
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <p className="text-[10px] text-emerald-400/70 uppercase tracking-wider">Resolved</p>
            </div>
            <p className="text-2xl font-bold text-emerald-300">{stats.resolved}</p>
          </div>
          <div className="glass rounded-xl p-4 group hover:bg-amber-500/5 transition-all">
            <div className="flex items-center gap-1 mb-1">
              <Hotel className="h-3 w-3 text-amber-400" />
              <p className="text-[10px] text-amber-400/70 uppercase tracking-wider">Hotels</p>
            </div>
            <p className="text-2xl font-bold text-amber-300">{stats.hotels}</p>
          </div>
          <div className="glass rounded-xl p-4 group hover:bg-blue-500/5 transition-all hidden sm:block">
            <div className="flex items-center gap-1 mb-1">
              <Plane className="h-3 w-3 text-blue-400" />
              <p className="text-[10px] text-blue-400/70 uppercase tracking-wider">Airlines</p>
            </div>
            <p className="text-2xl font-bold text-blue-300">{stats.airlines}</p>
          </div>
          <div className="glass rounded-xl p-4 group hover:bg-emerald-500/5 transition-all hidden sm:block">
            <div className="flex items-center gap-1 mb-1">
              <UtensilsCrossed className="h-3 w-3 text-emerald-400" />
              <p className="text-[10px] text-emerald-400/70 uppercase tracking-wider">Dining</p>
            </div>
            <p className="text-2xl font-bold text-emerald-300">{stats.restaurants}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={filterIndustry} onValueChange={setFilterIndustry}>
            <SelectTrigger className="w-32 glass border-white/10 text-white text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="Hotel">Hotels</SelectItem>
              <SelectItem value="Airline">Airlines</SelectItem>
              <SelectItem value="Restaurant">Restaurants</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterUrgency} onValueChange={setFilterUrgency}>
            <SelectTrigger className="w-32 glass border-white/10 text-white text-xs h-8">
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
            <SelectTrigger className="w-36 glass border-white/10 text-white text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="AI_Approved">Approved</SelectItem>
              <SelectItem value="Human_Overridden">Overridden</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-700/50 h-8 px-3 flex items-center">
            {filtered.length} result{filtered.length !== 1 && "s"}
          </Badge>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-400 animate-pulse" />
            </div>
            <span className="text-sm text-slate-500">Loading incidents…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="h-14 w-14 rounded-2xl glass flex items-center justify-center">
              <Shield className="h-7 w-7 text-slate-700" />
            </div>
            <p className="text-slate-500 text-sm">No incidents match filters</p>
            <Link href="/report">
              <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-500 text-white">
                <Send className="h-3.5 w-3.5 mr-1" />
                Report First Incident
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onClick={() => {
                  setSelectedIncident(incident);
                  setDetailOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <IncidentDetail
        incident={selectedIncident}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onResolved={(updated) => {
          setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        }}
      />
    </div>
  );
}
