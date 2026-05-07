import Link from "next/link";
import { Shield, Send, LayoutDashboard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-8">
        <div className="flex items-center justify-center">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/20 flex items-center justify-center">
            <Shield className="h-8 w-8 text-amber-400" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            OmniLink VIP Gateway
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mx-auto">
            AI-assisted operational command system for VIP incident resolution.
            Human-in-the-loop reliability for luxury hospitality and aviation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <Link href="/report">
            <Button
              size="lg"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold h-14"
            >
              <Send className="mr-2 h-5 w-5" />
              Report Incident
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 font-semibold h-14"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Operations Board
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="pt-8 grid grid-cols-3 gap-6 text-center max-w-lg mx-auto">
          <div>
            <p className="text-2xl font-bold text-amber-400">AI Triage</p>
            <p className="text-xs text-slate-500 mt-1">
              Structured JSON analysis via GPT-4o-mini
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">Realtime</p>
            <p className="text-xs text-slate-500 mt-1">
              Live Supabase subscriptions for instant updates
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">Audit Trail</p>
            <p className="text-xs text-slate-500 mt-1">
              Every decision logged with manager ID &amp; timestamp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
