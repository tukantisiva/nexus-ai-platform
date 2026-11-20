-- ==============================================================================
-- NexusAI Advisory Platform: Schema Migration
-- Version: 1.0.0
-- Target: Supabase PostgreSQL + pgvector (100% Free Tier Compatible)
-- ==============================================================================

-- 1. Enable pgvector Extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Table: Ingested Intelligence Items (Research Papers, News, CVEs)
CREATE TABLE IF NOT EXISTS intelligence_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    source VARCHAR(100) NOT NULL, -- 'ArXiv', 'Hugging Face', 'NVD', 'RSS'
    url TEXT UNIQUE NOT NULL,
    raw_content TEXT,
    summary_markdown TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'Architecture', -- 'Architecture', 'Security', 'Benchmark', 'News'
    threat_level VARCHAR(20), -- 'Priority', 'Hazard', 'Info' (For Security & CVE items)
    tags TEXT[] DEFAULT '{}',
    embedding VECTOR(768), -- 768-dim vector for Google text-embedding-004
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HNSW Vector Index for Sub-second Cosine Similarity Search
CREATE INDEX IF NOT EXISTS idx_intelligence_items_embedding 
ON intelligence_items 
USING hnsw (embedding vector_cosine_ops);

-- Index for category and source filtering
CREATE INDEX IF NOT EXISTS idx_intelligence_items_category ON intelligence_items(category);
CREATE INDEX IF NOT EXISTS idx_intelligence_items_source ON intelligence_items(source);
CREATE INDEX IF NOT EXISTS idx_intelligence_items_published ON intelligence_items(published_at DESC);


-- 3. Table: Reference Architectural Blueprints
CREATE TABLE IF NOT EXISTS blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    mermaid_code TEXT NOT NULL,
    use_cases TEXT[] DEFAULT '{}',
    tradeoffs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blueprints_slug ON blueprints(slug);


-- 4. Table: Client Assessment Submissions (Inbound Discovery Leads)
CREATE TABLE IF NOT EXISTS client_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    assessment_data JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_assessments_created ON client_assessments(created_at DESC);


-- 5. Table: Advisory Launchpad & Roadmap Milestones (From UI Mockup)
CREATE TABLE IF NOT EXISTS advisory_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL, -- 'Skills', 'GTM', 'Blueprints', 'Milestones'
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advisory_milestones_order ON advisory_milestones(display_order ASC);


-- 6. RPC Function: Semantic Vector Search via Cosine Similarity
CREATE OR REPLACE FUNCTION match_intelligence (
    query_embedding VECTOR(768),
    match_threshold FLOAT DEFAULT 0.65,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    source VARCHAR,
    url TEXT,
    category VARCHAR,
    threat_level VARCHAR,
    summary_markdown TEXT,
    similarity FLOAT,
    published_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT
        intelligence_items.id,
        intelligence_items.title,
        intelligence_items.source,
        intelligence_items.url,
        intelligence_items.category,
        intelligence_items.threat_level,
        intelligence_items.summary_markdown,
        1 - (intelligence_items.embedding <=> query_embedding) AS similarity,
        intelligence_items.published_at
    FROM intelligence_items
    WHERE intelligence_items.embedding IS NOT NULL
      AND 1 - (intelligence_items.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;


-- 7. Row Level Security (RLS) Configuration
ALTER TABLE intelligence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisory_milestones ENABLE ROW LEVEL SECURITY;

-- Intelligence Items: Publicly readable, write restricted to service role
CREATE POLICY "Allow public read access to intelligence_items"
ON intelligence_items FOR SELECT
USING (true);

CREATE POLICY "Allow service role write access to intelligence_items"
ON intelligence_items FOR ALL
USING (auth.role() = 'service_role');

-- Blueprints: Publicly readable, write restricted to service role
CREATE POLICY "Allow public read access to blueprints"
ON blueprints FOR SELECT
USING (true);

CREATE POLICY "Allow service role write access to blueprints"
ON blueprints FOR ALL
USING (auth.role() = 'service_role');

-- Client Assessments: Anyone can submit a lead assessment, but only authenticated users / service_role can read
CREATE POLICY "Allow public insert to client_assessments"
ON client_assessments FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow authenticated read access to client_assessments"
ON client_assessments FOR SELECT
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Advisory Milestones: Authenticated Advisor access only
CREATE POLICY "Allow authenticated access to advisory_milestones"
ON advisory_milestones FOR ALL
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');


-- 8. Seed Default Advisory Milestones (Reflecting ProtoType.jpeg)
INSERT INTO advisory_milestones (category, title, subtitle, is_completed, display_order)
VALUES 
('Skills', 'Acquire AI Skills', 'Master prompt engineering, RAG patterns, and agent evaluation frameworks', true, 1),
('GTM', 'Define GTM (Go-To-Market) Strategy', 'Identify enterprise target ICP and establish advisory offering tiers', true, 2),
('GTM', 'Position Value Proposition & Case Studies', 'Package previous engineering leadership wins into executive advisory pitches', true, 3),
('Blueprints', 'Build Architectural Blueprint Vault', 'Document production-ready patterns: Enterprise RAG, Guardrails, Multi-Agent Swarms', true, 4),
('Blueprints', 'Curate Security & Governance Checklists', 'Map OWASP Top 10 for LLMs and NIST AI RMF compliance matrices', false, 5),
('GTM', 'Launch Public Discovery Funnel', 'Deploy AI Readiness Assessment survey and Token ROI Calculator to Vercel', false, 6),
('Milestones', 'First Enterprise Advisory Client', 'Execute discovery consultation and deliver comprehensive AI architecture roadmap', false, 7)
ON CONFLICT DO NOTHING;
