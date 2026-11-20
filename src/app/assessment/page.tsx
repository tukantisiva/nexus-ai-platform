'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Calculator, Sparkles } from 'lucide-react';

const questions = [
  {
    id: 1,
    title: 'Data Readiness & Infrastructure',
    question: 'How structured and accessible is your enterprise data for AI ingestion?',
    options: [
      { text: 'Unstructured files scattered across multiple cloud silos without indexing', score: 1 },
      { text: 'Centralized data lake (S3/Snowflake) but limited metadata and APIs', score: 2 },
      { text: 'Clean tabular & text datasets with established access governance', score: 3 },
      { text: 'Production-ready streaming/batch pipelines with real-time vector embeddings', score: 4 },
    ]
  },
  {
    id: 2,
    title: 'Model Governance & Security',
    question: 'What safeguards are active to prevent prompt injection and data leaks?',
    options: [
      { text: 'No formal policies; employees use commercial LLM web portals freely', score: 1 },
      { text: 'Basic terms of service forbidding paste of sensitive customer PII', score: 2 },
      { text: 'Enterprise API gateway with automated PII masking and audit logs', score: 3 },
      { text: 'Automated red-teaming, guardrails (NeMo/Llama Guard), and NIST AI RMF compliance', score: 4 },
    ]
  },
  {
    id: 3,
    title: 'Architecture & Scalability',
    question: 'What is your current strategy for production AI deployment?',
    options: [
      { text: 'Exploring zero-shot prompts via OpenAI API directly in application code', score: 1 },
      { text: 'Custom Python prototype using LangChain / LlamaIndex with local vectors', score: 2 },
      { text: 'Production RAG pipeline with hybrid search, reranking, and evaluation metrics', score: 3 },
      { text: 'Distributed multi-agent orchestration with self-hosted vLLM inference clusters', score: 4 },
    ]
  },
  {
    id: 4,
    title: 'Cost & Token Economics',
    question: 'How do you monitor and optimize LLM token expenditure?',
    options: [
      { text: 'No tracking; billed to corporate credit card without token attribution', score: 1 },
      { text: 'Monthly budget caps set at the cloud provider billing level', score: 2 },
      { text: 'Real-time telemetry tracking cost per user, feature, and token utilization', score: 3 },
      { text: 'Semantic prompt caching, model routing, and automated small-model distillation', score: 4 },
    ]
  }
];

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 4;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactEmail) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center space-x-2 text-xs text-cyan-400 hover:text-cyan-300 mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Advisory Portal</span>
        </Link>

        {!submitted ? (
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-8 shadow-2xl">
            <div className="border-b border-slate-800 pb-5 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/40">
                Self-Service Assessment
              </span>
              <h1 className="text-2xl font-bold text-white mt-2">Enterprise AI Architecture Readiness Audit</h1>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Evaluate your organization's technical readiness across data pipelines, model security, and token economics.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {questions.map((q, idx) => (
                <div key={q.id} className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">
                    {idx + 1}. {q.title}
                  </h3>
                  <p className="text-xs text-slate-400">{q.question}</p>
                  <div className="space-y-2 mt-2">
                    {q.options.map((opt) => (
                      <label 
                        key={opt.score}
                        className={`flex items-center space-x-3 p-3 rounded-lg border text-xs cursor-pointer transition ${
                          answers[q.id] === opt.score
                            ? 'bg-cyan-950/50 border-cyan-500 text-white'
                            : 'bg-[#10172a] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={answers[q.id] === opt.score}
                          onChange={() => setAnswers({ ...answers, [q.id]: opt.score })}
                          className="accent-cyan-500"
                        />
                        <span>{opt.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-slate-800 pt-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Receive Executive Audit Report</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-[#10172a] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work Email (e.g. cto@company.com)"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="bg-[#10172a] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={Object.keys(answers).length < questions.length}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-xs shadow-lg shadow-cyan-500/20 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Maturity Report & Score</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">Readiness Score: {percentage}%</h2>
              <p className="text-xs text-slate-400 mt-2">
                Audit generated for <span className="text-cyan-400 font-semibold">{companyName}</span> ({contactEmail}).
              </p>
            </div>

            <div className="bg-[#11192e] border border-slate-800 p-4 rounded-lg text-left text-xs space-y-2">
              <p className="font-semibold text-white">Advisory Recommendation:</p>
              {percentage >= 75 ? (
                <p className="text-emerald-400">
                  Your architecture is primed for custom domain-specific agents and self-hosted model quantization.
                </p>
              ) : percentage >= 50 ? (
                <p className="text-amber-400">
                  Target priority: Establish hybrid search vector reranking and formalize OWASP LLM security guardrails.
                </p>
              ) : (
                <p className="text-rose-400">
                  Target priority: Consolidate data access pipelines and implement an enterprise LLM gateway before deploying customer-facing AI.
                </p>
              )}
            </div>

            <Link
              href="/calculator"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg border border-slate-700 transition"
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Proceed to LLM Token Cost Calculator</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
