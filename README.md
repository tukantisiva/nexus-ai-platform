# NexusAI Advisory Platform

NexusAI is an automated intelligence aggregation engine, architectural blueprint repository, and client lead-generation portal built to transition an engineering leader into an independent AI advisory practice.

Designed from the ground up to operate on a **$0.00/month (100% Free Tier)** infrastructure stack.

---

## Architecture Overview

```
                      +---------------------------------------+
                      |       GitHub Actions Cron Worker      |
                      |   (ArXiv Papers + NVD CVE Alerts)     |
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |       Google Gemini 2.0 Flash API     |
                      |     & text-embedding-004 (Free Tier)  |
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |     Supabase PostgreSQL + pgvector    |
                      |     (768-dim HNSW Cosine Similarity)  |
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |      Next.js 14 App Router (Vercel)   |
                      |  - Intelligence Radar Cockpit         |
                      |  - Security & Governance Hub          |
                      |  - Advisory Launchpad Roadmap         |
                      |  - Public AI Readiness Assessment     |
                      |  - Public Token ROI & Cost Calculator |
                      +---------------------------------------+
```

---

## Free-Tier Infrastructure Stack

- **Frontend & APIs:** Next.js 14 (App Router) + Tailwind CSS (Vercel Hobby Tier)
- **Database & Semantic Search:** Supabase PostgreSQL with `pgvector` and HNSW indexing
- **Intelligence Processing:** Google Gemini 2.0 Flash (Free Tier: 15 RPM / 1,500 RPD)
- **Embeddings:** Google `text-embedding-004` (768-dimension vectors)
- **Automated Ingestion:** GitHub Actions scheduled cron runner (2,000 free minutes/mo)

---

## Directory Structure

```
nexus-ai-platform/
├── supabase/
│   └── migrations/
│       └── 20261120000000_init_nexusai_schema.sql  # Database schema, HNSW index & RLS
├── scripts/
│   ├── daily_ingest.py                            # Ingestion worker (ArXiv + NVD CVEs)
│   └── requirements.txt                           # Python dependencies
├── .github/
│   └── workflows/
│       └── daily_ingest.yml                        # Scheduled 06:00 UTC ingestion workflow
├── src/
│   ├── app/
│   │   ├── page.tsx                               # Advisor 3-column cockpit
│   │   ├── assessment/page.tsx                    # Client AI Readiness survey
│   │   ├── calculator/page.tsx                    # Interactive Token ROI calculator
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   └── MermaidDiagram.tsx                     # Flowchart renderer
│   └── lib/
│       ├── supabase.ts                            # Supabase client singleton
│       └── types.ts                               # TypeScript interfaces
├── .env.example                                   # Configuration template
├── package.json
└── tailwind.config.js
```

---

## Getting Started

### 1. Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run the migration script:
   `supabase/migrations/20261120000000_init_nexusai_schema.sql`.

### 2. Environment Configuration

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon public API key.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for ingestion worker).
- `GEMINI_API_KEY`: Google AI Studio API key (from [aistudio.google.com](https://aistudio.google.com)).

### 3. Running the Intelligence Ingestion Worker

Install Python dependencies and execute the ingestion script:

```bash
pip install -r scripts/requirements.txt
python scripts/daily_ingest.py
```

### 4. Running the Web Platform

Ensure Node.js 18+ is active, install packages, and start the development server:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to access the advisory cockpit.
