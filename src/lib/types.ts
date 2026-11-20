export type Category = 'Architecture' | 'Security' | 'Benchmark' | 'News';
export type ThreatLevel = 'Priority' | 'Hazard' | 'Info' | null;

export interface IntelligenceItem {
  id: string;
  title: string;
  source: 'ArXiv' | 'Hugging Face' | 'NVD' | 'RSS';
  url: string;
  raw_content?: string;
  summary_markdown: string;
  category: Category;
  threat_level?: ThreatLevel;
  tags: string[];
  published_at?: string;
  created_at: string;
  similarity?: number;
}

export interface Blueprint {
  id: string;
  title: string;
  slug: string;
  description: string;
  mermaid_code: string;
  use_cases: string[];
  tradeoffs?: string;
  created_at: string;
}

export interface AdvisoryMilestone {
  id: string;
  category: 'Skills' | 'GTM' | 'Blueprints' | 'Milestones';
  title: string;
  subtitle?: string;
  is_completed: boolean;
  completed_at?: string;
  display_order: number;
  created_at: string;
}

export interface ClientAssessment {
  id: string;
  company_name: string;
  contact_email: string;
  score: number;
  assessment_data: Record<string, any>;
  status: 'new' | 'contacted' | 'qualified' | 'archived';
  created_at: string;
}
