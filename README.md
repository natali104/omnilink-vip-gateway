# OmniLink VIP Gateway

AI-assisted operational command system for VIP incident resolution in luxury hospitality and aviation. Reliability, explainability, and auditability are the top priorities — AI provides decision-support, humans make the final call.

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

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Framework      | Next.js 14 (App Router)                 |
| UI             | Tailwind CSS + Shadcn UI                |
| Database       | Supabase (Postgres + Realtime)          |
| AI             | OpenAI gpt-4o-mini (Structured Outputs) |
| Email          | Resend (conditional escalation)         |
| Hosting        | Vercel                                  |

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url> && cd omnilink-vip-gateway
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Open the SQL Editor and run the contents of `supabase/schema.sql`
3. Copy your project URL, anon key, and service role key

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in the values:

| Variable                         | Where to find it                         |
| -------------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase → Settings → API               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase → Settings → API               |
| `SUPABASE_SERVICE_ROLE_KEY`      | Supabase → Settings → API (secret)      |
| `OPENAI_API_KEY`                 | [platform.openai.com](https://platform.openai.com/api-keys) |
| `RESEND_API_KEY`                 | [resend.com](https://resend.com)         |
| `ESCALATION_EMAIL_TO`            | Duty manager email                       |
| `ESCALATION_EMAIL_FROM`          | Verified sender domain in Resend         |

### 4. Run Locally

```bash
npm run dev
```

- Landing page: [http://localhost:3000](http://localhost:3000)
- Ground Staff form: [http://localhost:3000/report](http://localhost:3000/report)
- Operations Board: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

### 5. Deploy to Vercel

```bash
vercel --prod
```

Add all environment variables in the Vercel dashboard under Settings → Environment Variables.

## Enterprise Workflow

1. **Input** — Ground staff submits a rapid incident report via `/report`
2. **AI Triage** — The API sends the raw text to OpenAI with a strict JSON schema enforcing: `client_tier`, `issue_type`, `urgency`, `suggested_action`, `reasoning`, `confidence_score`
3. **Database + Realtime** — The structured incident is saved to Supabase; the Operations Board receives it instantly via Realtime
4. **Smart Escalation** — Resend sends an email only when `urgency === "Critical"` AND `confidence_score > 0.8` AND `client_tier` is top-level (First Class / Platinum)
5. **Human Override** — The Duty Manager reviews the AI reasoning, then clicks **Approve AI Action** or **Override with Manual Action**. The decision, manager ID, and timestamp are logged for the audit trail

## Database Schema

See `supabase/schema.sql` for the complete DDL. Key table: `vip_incidents` with columns for raw input, AI-generated fields, and human-in-the-loop audit trail.

## Project Structure

```
src/
├── app/
│   ├── api/incidents/          # POST (create + triage) and GET (list)
│   │   └── resolve/            # PATCH (approve / override)
│   ├── dashboard/              # Operations Command Board (Realtime)
│   ├── report/                 # Ground Staff incident form
│   ├── layout.tsx
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # Shadcn UI primitives
│   ├── incident-card.tsx       # Color-coded urgency card
│   └── incident-detail.tsx     # Detail dialog with approve/override
├── lib/
│   ├── openai-triage.ts        # OpenAI structured output integration
│   ├── resend-escalation.ts    # Conditional email logic
│   ├── supabase-browser.ts     # Browser client (Realtime)
│   ├── supabase-server.ts      # Server client (service role)
│   └── utils.ts                # cn() utility
├── types/
│   └── incident.ts             # TypeScript interfaces
supabase/
└── schema.sql                  # Database DDL
```
