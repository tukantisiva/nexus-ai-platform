"""
NexusAI Platform: Automated Daily Ingestion Worker
Operates within 100% Free-Tier Limits:
- Google Gemini 2.0 Flash (Free Tier: 15 RPM, 1,500 RPD)
- Google text-embedding-004 (Free Tier)
- Supabase pgvector Free Tier
- Rate-limited to preserve free quotas
"""

import os
import sys
import time
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

import feedparser
import requests
from supabase import create_client, Client
from google import genai
from google.genai import errors as genai_errors

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("NexusAI-Ingest")

# Load environment configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Free Tier Safety Constants
GEMINI_MODEL = "gemini-2.0-flash"
EMBEDDING_MODEL = "text-embedding-004"
RPM_DELAY_SECONDS = 4.5  # Guarantees strictly <= 13 requests/minute (Free limit: 15 RPM)


def get_clients():
    """Validate environment variables and initialize API clients."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.")
        sys.exit(1)
    if not GEMINI_API_KEY:
        logger.error("Missing GEMINI_API_KEY environment variable.")
        sys.exit(1)

    supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    ai_client = genai.Client(api_key=GEMINI_API_KEY)
    return supabase_client, ai_client


def summarize_content(ai_client: genai.Client, title: str, content: str, category: str) -> Optional[str]:
    """Summarize raw content using Gemini 2.0 Flash Free Tier with exponential backoff."""
    prompt = f"""
You are an AI Architecture and Enterprise Advisory Specialist.
Analyze the following {category} item and generate a concise executive summary formatted in Markdown:

Title: {title}
Content: {content}

Output Format:
- **Executive Takeaway**: 1-2 sentence core insight.
- **Architectural / Enterprise Impact**: Why this matters for engineering teams.
- **Key Tags**: 3-5 comma-separated tags (e.g., #RAG, #Security, #FineTuning).
"""
    for attempt in range(3):
        try:
            response = ai_client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
            )
            return response.text
        except genai_errors.APIError as e:
            logger.warning(f"Gemini API rate limit/error (attempt {attempt + 1}/3): {e}")
            time.sleep(5 * (attempt + 1))
        except Exception as e:
            logger.error(f"Unexpected error summarizing item '{title}': {e}")
            break
    return None


def generate_embedding(ai_client: genai.Client, text: str) -> Optional[List[float]]:
    """Generate 768-dimension vector embedding using text-embedding-004 Free API."""
    truncated_text = text[:3000]  # Respect token constraints
    for attempt in range(3):
        try:
            embed_resp = ai_client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=truncated_text,
            )
            # Correct SDK extraction from google-genai
            if embed_resp.embeddings and len(embed_resp.embeddings) > 0:
                return embed_resp.embeddings[0].values
            return None
        except genai_errors.APIError as e:
            logger.warning(f"Embedding API error (attempt {attempt + 1}/3): {e}")
            time.sleep(5 * (attempt + 1))
        except Exception as e:
            logger.error(f"Unexpected error generating embedding: {e}")
            break
    return None


def ingest_arxiv_papers(supabase: Client, ai_client: genai.Client, max_results: int = 5):
    """Scrape and summarize the latest top AI research papers from ArXiv."""
    logger.info(f"Fetching {max_results} latest papers from ArXiv...")
    categories = ["cat:cs.AI", "cat:cs.CL", "cat:cs.LG"]
    query = "+OR+".join(categories)
    url = f"http://export.arxiv.org/api/query?search_query={query}&start=0&max_results={max_results}&sortBy=submittedDate&sortOrder=descending"

    feed = feedparser.parse(url)
    logger.info(f"Found {len(feed.entries)} entries from ArXiv.")

    for entry in feed.entries:
        title = entry.title.replace('\n', ' ').strip()
        link = entry.link
        abstract = entry.summary.replace('\n', ' ').strip()
        published = entry.get("published", datetime.now(timezone.utc).isoformat())

        # Check if already ingested to avoid wasting free LLM quota
        existing = supabase.table("intelligence_items").select("id").eq("url", link).execute()
        if existing.data and len(existing.data) > 0:
            logger.info(f"Skipping already ingested paper: {title[:50]}...")
            continue

        logger.info(f"Processing paper: {title[:60]}...")
        summary = summarize_content(ai_client, title, abstract, "Research Paper")
        time.sleep(RPM_DELAY_SECONDS)

        if not summary:
            continue

        embedding = generate_embedding(ai_client, f"{title}\n{summary}")
        time.sleep(RPM_DELAY_SECONDS)

        supabase.table("intelligence_items").upsert({
            "title": title,
            "source": "ArXiv",
            "url": link,
            "raw_content": abstract,
            "summary_markdown": summary,
            "category": "Architecture",
            "threat_level": None,
            "tags": ["Research", "Paper", "ArXiv"],
            "embedding": embedding,
            "published_at": published
        }, on_conflict="url").execute()
        logger.info(f"Successfully stored paper: {title[:40]}")


def ingest_security_cves(supabase: Client, ai_client: genai.Client, max_results: int = 5):
    """Scrape latest AI/LLM related CVE security vulnerabilities from NVD."""
    logger.info("Checking NVD API for AI & LLM security advisories...")
    nvd_url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
    keywords = "LLM OR prompt injection OR langchain OR llamaindex OR vllm"
    params = {
        "keywordSearch": keywords,
        "resultsPerPage": max_results
    }

    try:
        resp = requests.get(nvd_url, params=params, timeout=15)
        if resp.status_code != 200:
            logger.warning(f"NVD API returned status {resp.status_code}. Skipping CVE ingestion.")
            return

        data = resp.json()
        vulnerabilities = data.get("vulnerabilities", [])
        logger.info(f"Found {len(vulnerabilities)} CVE items from NVD.")

        for item in vulnerabilities:
            cve = item.get("cve", {})
            cve_id = cve.get("id", "Unknown CVE")
            descriptions = cve.get("descriptions", [])
            desc_text = descriptions[0].get("value", "") if descriptions else ""
            cve_url = f"https://nvd.nist.gov/vuln/detail/{cve_id}"
            published = cve.get("published", datetime.now(timezone.utc).isoformat())

            # Check if existing
            existing = supabase.table("intelligence_items").select("id").eq("url", cve_url).execute()
            if existing.data and len(existing.data) > 0:
                logger.info(f"Skipping already ingested CVE: {cve_id}")
                continue

            # Classify threat level
            threat_level = "Priority" if "prompt injection" in desc_text.lower() else "Hazard"

            logger.info(f"Processing CVE: {cve_id} ({threat_level})...")
            summary = summarize_content(ai_client, cve_id, desc_text, "Security Vulnerability (CVE)")
            time.sleep(RPM_DELAY_SECONDS)

            if not summary:
                continue

            embedding = generate_embedding(ai_client, f"{cve_id}\n{summary}")
            time.sleep(RPM_DELAY_SECONDS)

            supabase.table("intelligence_items").upsert({
                "title": f"Security Alert: {cve_id}",
                "source": "NVD",
                "url": cve_url,
                "raw_content": desc_text,
                "summary_markdown": summary,
                "category": "Security",
                "threat_level": threat_level,
                "tags": ["Security", "CVE", "OWASP", "Vulnerability"],
                "embedding": embedding,
                "published_at": published
            }, on_conflict="url").execute()
            logger.info(f"Successfully stored CVE: {cve_id}")

    except Exception as e:
        logger.error(f"Error fetching CVEs from NVD: {e}")


def main():
    logger.info("=== Starting NexusAI Daily Ingestion Pipeline ===")
    supabase, ai_client = get_clients()

    try:
        ingest_arxiv_papers(supabase, ai_client, max_results=5)
        ingest_security_cves(supabase, ai_client, max_results=5)
    except Exception as e:
        logger.error(f"Ingestion pipeline failed: {e}")
        sys.exit(1)

    logger.info("=== Ingestion Pipeline Completed Successfully ===")


if __name__ == "__main__":
    main()
