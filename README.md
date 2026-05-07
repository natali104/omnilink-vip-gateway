# OmniLink VIP Gateway

**AI-assisted operational command system for VIP incident resolution** across luxury hospitality, aviation, and premium dining.

> Reliability, explainability, and auditability are the top priorities — AI provides decision-support, humans make the final call.

## Live Demo

**[omnilink-vip-gateway.vercel.app](https://omnilink-vip-gateway.vercel.app)**

| Page | URL |
|------|-----|
| Landing | [/](https://omnilink-vip-gateway.vercel.app) |
| Report Incident | [/report](https://omnilink-vip-gateway.vercel.app/report) |
| Operations Board | [/dashboard](https://omnilink-vip-gateway.vercel.app/dashboard) |
| Admin Panel | [/admin](https://omnilink-vip-gateway.vercel.app/admin) |

## Architecture

```
Ground Staff Form ──► Next.js API ──► OpenAI (gpt-4o-mini, Structured JSON)
                                  ├──► Supabase (insert + Realtime broadcast)
                                  └──► Resend (conditional Critical alert)

Operations Board ◄── Supabase Realtime ◄── vip_incidents table
       │
       ▼
  Duty Manager: Approve AI / Override ──► Audit log in Supabase
```

## Supported Industries

| Industry | Client Tiers | Incident Types |
|----------|-------------|----------------|
| **Hotels** | Presidential Suite, Platinum, Gold, Silver, Standard | Service Failure, Security, Complaint, VIP Request |
| **Airlines** | First Class, Business, Premium Economy, Economy | Medical, Luggage, Delay, Security |
| **Restaurants** | Michelin VIP, Private Dining, Premium, Regular | Medical, Service Failure, Complaint, VIP Request |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | Tailwind CSS + Shadcn UI + Glass Morphism |
| Database | Supabase (Postgres + Realtime) |
| AI | OpenAI gpt-4o-mini (Structured JSON Outputs) |
| Email | Resend (conditional escalation) |
| Hosting | Vercel |

## Enterprise Workflow (Human-in-the-Loop)

1. **Input** — Staff submits incident via mobile-friendly form with industry selector
2. **AI Triage** — GPT-4o-mini returns structured JSON: `client_tier`, `issue_type`, `urgency`, `suggested_action`, `reasoning`, `confidence_score`
3. **Database + Realtime** — Incident saved to Supabase; Operations Board receives it instantly
4. **Smart Escalation** — Email only when `urgency === "Critical"` AND `confidence > 0.8` AND top-tier client
5. **Human Override** — Manager reviews AI reasoning, clicks Approve or Override. Decision + timestamp + manager ID logged for audit

## Features

- **3D Interactive Landing Page** — Glass morphism, gradient animations, animated backgrounds
- **Multi-Industry Support** — Hotels, Airlines, Restaurants with industry-specific tiers
- **Realtime Operations Board** — Color-coded urgency cards, live stats, industry/urgency/status filters
- **AI Transparency** — Raw report vs AI breakdown comparison, reasoning always visible
- **Admin Panel** — Profile, analytics, industry breakdown, decision metrics, recent activity
- **Smart Escalation** — Conditional email alerts (no spam)
- **Full Audit Trail** — Every decision logged with manager ID and timestamp

## Getting Started

### 1. Install

```bash
git clone <repo-url> && cd omnilink-vip-gateway
npm install
```

### 2. Supabase Setup

Run `supabase/schema.sql` in the Supabase SQL Editor.

### 3. Environment Variables

```bash
cp .env.example .env.local
```

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (secret) |
| `OPENAI_API_KEY` | platform.openai.com |
| `RESEND_API_KEY` | resend.com |

### 4. Run

```bash
npm run dev
```

## Project Structure

```
src/
├── app/
│   ├── api/incidents/          # POST (create + triage), GET (list)
│   │   └── resolve/            # PATCH (approve / override)
│   ├── admin/                  # Admin panel + analytics
│   ├── dashboard/              # Realtime Operations Board
│   ├── report/                 # Multi-industry incident form
│   ├── layout.tsx
│   └── page.tsx                # 3D interactive landing page
├── components/
│   ├── ui/                     # Shadcn UI primitives
│   ├── incident-card.tsx       # Color-coded urgency card
│   └── incident-detail.tsx     # Detail dialog with approve/override
├── lib/
│   ├── openai-triage.ts        # OpenAI structured output integration
│   ├── resend-escalation.ts    # Conditional email logic
│   ├── supabase-browser.ts     # Browser client (Realtime)
│   ├── supabase-server.ts      # Server client
│   └── utils.ts
├── types/
│   └── incident.ts
supabase/
└── schema.sql
```
