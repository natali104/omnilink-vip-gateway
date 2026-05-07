import Link from "next/link";
import {
  Shield,
  Send,
  LayoutDashboard,
  ArrowRight,
  Brain,
  Radio,
  Lock,
  Hotel,
  Plane,
  UtensilsCrossed,
  Zap,
  Eye,
  Bell,
  BarChart3,
  Users,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const INDUSTRIES = [
  {
    icon: Hotel,
    name: "Hotels",
    desc: "VIP guest incident management",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Plane,
    name: "Airlines",
    desc: "Passenger & crew crisis response",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: UtensilsCrossed,
    name: "Restaurants",
    desc: "Premium dining incident tracking",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Triage",
    desc: "GPT-4o-mini analyzes reports with structured JSON outputs for consistent, explainable assessments.",
    color: "from-amber-500/20 to-orange-500/10",
  },
  {
    icon: Radio,
    title: "Realtime Operations",
    desc: "Supabase Realtime pushes incidents to the dashboard instantly. No refresh needed.",
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: Lock,
    title: "Human-in-the-Loop",
    desc: "AI suggests, managers decide. Every action is logged with timestamps and manager IDs.",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: Bell,
    title: "Smart Escalation",
    desc: "Emails trigger only for Critical + high-confidence + top-tier clients. No alert fatigue.",
    color: "from-purple-500/20 to-pink-500/10",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    desc: "AI reasoning is always visible. Managers see exactly why the AI made each assessment.",
    color: "from-rose-500/20 to-red-500/10",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Track incident patterns, resolution times, and team performance in real time.",
    color: "from-indigo-500/20 to-violet-500/10",
  },
];

const STATS = [
  { value: "< 3s", label: "AI Triage Time", icon: Zap },
  { value: "100%", label: "Audit Coverage", icon: Lock },
  { value: "3", label: "Industries", icon: Globe },
  { value: "24/7", label: "Realtime Ops", icon: Users },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070b14] overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse-glow [animation-delay:1.5s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/3 rounded-full blur-[100px] animate-pulse-glow [animation-delay:3s]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-20 mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            OmniLink
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#industries"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Industries
          </a>
          <a
            href="#features"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Features
          </a>
          <Link href="/admin">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              Admin
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-500 text-white"
            >
              Operations Board
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 glass mb-8 animate-slide-up">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium tracking-wide uppercase">
                AI-Powered Incident Command
              </span>
            </div>

            <h1
              className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-[1.1] animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Resolve VIP incidents{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                in seconds
              </span>
            </h1>

            <p
              className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              AI triages. Managers decide. Every action audited. Purpose-built
              for luxury hospitality, aviation, and premium dining.
            </p>

            <div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="/report">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold h-14 px-8 shadow-lg shadow-amber-500/20 text-base"
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
                  className="border-slate-700 text-slate-300 hover:bg-white/5 font-semibold h-14 px-8 text-base"
                >
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Live Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-5 text-center group hover:bg-white/5 transition-all duration-300"
              >
                <stat.icon className="h-5 w-5 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
              Multi-Industry
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
              One platform, every premium sector
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              OmniLink adapts to the unique incident patterns of each industry
              while maintaining a unified command interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
            {INDUSTRIES.map((ind, i) => (
              <div
                key={ind.name}
                className="group relative rounded-2xl glass-strong p-8 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-default"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="gradient-border rounded-2xl absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div
                  className={`h-14 w-14 rounded-2xl ${ind.bg} ${ind.border} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <ind.icon className={`h-7 w-7 ${ind.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {ind.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {ind.desc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm">
                  <span className={`${ind.color} font-medium`}>
                    Learn more
                  </span>
                  <ArrowRight
                    className={`h-3.5 w-3.5 ${ind.color} group-hover:translate-x-1 transition-transform`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
              Capabilities
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
              Enterprise-grade incident intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className="group rounded-2xl glass p-6 hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="glass-strong rounded-3xl p-12 glow-amber">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to transform incident management?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Start resolving VIP incidents with AI-powered triage and
              human-verified decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/report">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold h-12 px-8"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Your First Report
                </Button>
              </Link>
              <Link href="/admin">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-white/5 h-12 px-8"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-slate-500">
              OmniLink VIP Gateway
            </span>
          </div>
          <p className="text-xs text-slate-600">
            &copy; 2026 OmniLink. AI-assisted operations for premium service
            industries.
          </p>
        </div>
      </footer>
    </div>
  );
}
