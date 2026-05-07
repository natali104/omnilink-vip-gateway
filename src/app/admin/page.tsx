"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { VipIncident } from "@/types/incident";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  User,
  LayoutDashboard,
  BarChart3,
  Settings,
  Bell,
  Hotel,
  Plane,
  UtensilsCrossed,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Activity,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const ADMIN = {
  name: "Nataliya Nikolova",
  role: "Operations Director",
  email: "nata1iya.nikolv@gmail.com",
  avatar: "NN",
  joinedDate: "April 2026",
  permissions: [
    "Full Incident Access",
    "AI Override Authority",
    "Team Management",
    "Analytics & Reports",
    "System Configuration",
  ],
};

export default function AdminPage() {
  const [incidents, setIncidents] = useState<VipIncident[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      if (data.incidents) setIncidents(data.incidents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const stats = {
    total: incidents.length,
    critical: incidents.filter((i) => i.ai_urgency === "Critical").length,
    resolved: incidents.filter((i) => i.status !== "Open").length,
    avgConfidence: incidents.length
      ? (
          incidents.reduce((sum, i) => sum + (i.ai_confidence ?? 0), 0) /
          incidents.length *
          100
        ).toFixed(0)
      : "0",
    hotels: incidents.filter((i) => i.industry === "Hotel").length,
    airlines: incidents.filter((i) => i.industry === "Airline").length,
    restaurants: incidents.filter((i) => i.industry === "Restaurant").length,
    approvedByAI: incidents.filter((i) => i.status === "AI_Approved").length,
    overridden: incidents.filter((i) => i.status === "Human_Overridden").length,
  };

  const recentActivity = incidents.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#070b14]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-purple-500/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/3 rounded-full blur-[100px]" />
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
            <div className="h-5 w-px bg-white/10" />
            <h1 className="text-sm font-semibold text-slate-300">Admin Panel</h1>
          </div>
          <Link href="/dashboard">
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white h-8">
              <LayoutDashboard className="h-3.5 w-3.5 mr-1" />
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-strong rounded-2xl p-6 glow-amber">
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-amber-500/20 mb-4">
                  {ADMIN.avatar}
                </div>
                <h2 className="text-lg font-bold text-white">{ADMIN.name}</h2>
                <p className="text-sm text-amber-400 font-medium">{ADMIN.role}</p>
                <p className="text-xs text-slate-500 mt-1">{ADMIN.email}</p>
                <Badge variant="outline" className="mt-3 text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                  Active
                </Badge>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Permissions</p>
                <div className="space-y-2">
                  {ADMIN.permissions.map((perm) => (
                    <div key={perm} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-xs text-slate-300">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500">Member since</span>
                <span className="text-xs text-slate-300">{ADMIN.joinedDate}</span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="glass rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Quick Actions</p>
              <div className="space-y-2">
                <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                  <LayoutDashboard className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-slate-300">Operations Board</span>
                </Link>
                <Link href="/report" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                  <AlertTriangle className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-slate-300">Report Incident</span>
                </Link>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
                  <Bell className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-slate-300">Notification Settings</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
                  <Settings className="h-4 w-4 text-slate-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-slate-300">System Configuration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analytics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="glass rounded-xl p-4 hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-amber-400" />
                  <span className="text-[10px] text-slate-500 uppercase">Total Incidents</span>
                </div>
                <p className="text-3xl font-bold text-white">{loading ? "…" : stats.total}</p>
              </div>
              <div className="glass rounded-xl p-4 hover:bg-red-500/5 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="h-4 w-4 text-red-400" />
                  <span className="text-[10px] text-red-400/70 uppercase">Critical</span>
                </div>
                <p className="text-3xl font-bold text-red-300">{loading ? "…" : stats.critical}</p>
              </div>
              <div className="glass rounded-xl p-4 hover:bg-emerald-500/5 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400/70 uppercase">AI Confidence</span>
                </div>
                <p className="text-3xl font-bold text-emerald-300">{loading ? "…" : `${stats.avgConfidence}%`}</p>
              </div>
            </div>

            {/* Industry breakdown */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-400" />
                Industry Breakdown
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4 text-center">
                  <Hotel className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.hotels}</p>
                  <p className="text-xs text-slate-500">Hotels</p>
                </div>
                <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-4 text-center">
                  <Plane className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.airlines}</p>
                  <p className="text-xs text-slate-500">Airlines</p>
                </div>
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4 text-center">
                  <UtensilsCrossed className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.restaurants}</p>
                  <p className="text-xs text-slate-500">Restaurants</p>
                </div>
              </div>
              {/* Decision breakdown */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-slate-300">AI Approved</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-300">{stats.approvedByAI}</span>
                </div>
                <div className="rounded-xl bg-purple-500/5 border border-purple-500/10 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-400" />
                    <span className="text-xs text-slate-300">Human Override</span>
                  </div>
                  <span className="text-lg font-bold text-purple-300">{stats.overridden}</span>
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                Recent Activity
              </h3>
              {loading ? (
                <p className="text-sm text-slate-500 py-8 text-center">Loading…</p>
              ) : recentActivity.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">No incidents yet</p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((incident) => (
                    <Link
                      key={incident.id}
                      href="/dashboard"
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-2 w-2 rounded-full flex-shrink-0 ${
                            incident.ai_urgency === "Critical"
                              ? "bg-red-400"
                              : incident.ai_urgency === "Medium"
                                ? "bg-amber-400"
                                : "bg-slate-500"
                          }`}
                        />
                        <span className="text-sm text-white truncate">
                          {incident.ai_issue_type ?? "Pending"}
                        </span>
                        <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-700/50 shrink-0">
                          {incident.industry}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] border ${
                            incident.status === "Open"
                              ? "text-blue-300 border-blue-500/30"
                              : "text-emerald-300 border-emerald-500/30"
                          }`}
                        >
                          {incident.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
