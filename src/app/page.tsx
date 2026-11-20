'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Radar, 
  ShieldAlert, 
  Layers, 
  Compass, 
  Settings, 
  Search, 
  SlidersHorizontal, 
  Clock, 
  Sparkles, 
  Bell, 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  AlertTriangle,
  Flame,
  FileText,
  Calculator
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'radar' | 'security' | 'blueprints' | 'launchpad'>('radar');
  const [radarFilter, setRadarFilter] = useState<'all' | 'arxiv' | 'hf'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample seed data reflecting ProtoType.jpeg
  const milestones = [
    { id: 1, title: 'Acquire AI Skills', subtitle: 'Master prompt engineering, RAG, and agent frameworks', completed: true },
    { id: 2, title: 'Define GTM (Go-To-Market) Strategy', subtitle: 'Identify enterprise target ICP and establish advisory tiers', completed: true },
    { id: 3, title: 'Position Value Proposition & Cases', subtitle: 'Package software leadership experience into advisory assets', completed: true },
    { id: 4, title: 'Build Architectural Blueprint Vault', subtitle: 'Document production-ready patterns: RAG, Swarms, Guardrails', completed: true },
    { id: 5, title: 'Build Security & Governance Checklists', subtitle: 'Map OWASP Top 10 for LLMs and NIST AI RMF compliance', completed: false },
    { id: 6, title: 'Launch Public Discovery Funnel', subtitle: 'Deploy AI Readiness Assessment & Token ROI Calculator', completed: false },
    { id: 7, title: 'First Enterprise Advisory Client', subtitle: 'Execute discovery consultation & deliver AI architecture roadmap', completed: false },
  ];

  return (
    <div className="flex h-screen w-full bg-[#070b12] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 border-r border-slate-800/80 bg-[#0a0f1d] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-5 flex items-center space-x-3 border-b border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Radar className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight">NexusAI</span>
              <span className="text-cyan-400 font-semibold text-xs ml-1.5 uppercase tracking-wider">Advisory</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('radar')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'radar' 
                  ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 shadow-inner' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Radar className="w-4 h-4" />
              <span>Intelligence Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'security' 
                  ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Security & Governance Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('blueprints')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'blueprints' 
                  ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Architecture Blueprints</span>
            </button>

            <button
              onClick={() => setActiveTab('launchpad')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'launchpad' 
                  ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Advisory Launchpad</span>
            </button>
          </nav>

          {/* Public Tools Links */}
          <div className="px-5 py-4 border-t border-slate-800/60 mt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Public Client Tools</span>
            <div className="mt-2 space-y-1 text-xs">
              <Link href="/assessment" className="flex items-center space-x-2 py-1.5 text-slate-400 hover:text-cyan-400 transition">
                <FileText className="w-3.5 h-3.5" />
                <span>AI Readiness Survey</span>
              </Link>
              <Link href="/calculator" className="flex items-center space-x-2 py-1.5 text-slate-400 hover:text-cyan-400 transition">
                <Calculator className="w-3.5 h-3.5" />
                <span>Token ROI Calculator</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Profile */}
        <div className="p-3 border-t border-slate-800/80">
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 transition text-sm">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-14 border-b border-slate-800/80 bg-[#090d18] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 w-96">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search research papers, blueprints, or CVEs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs font-medium bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cron Ingest: Active (06:00 UTC)</span>
            </div>

            <button className="relative text-slate-400 hover:text-slate-200">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                EM
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-slate-200 leading-tight">Software Eng. Manager</p>
                <p className="text-[10px] text-cyan-400">AI Advisory Mode</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
            </div>
          </div>
        </header>

        {/* Subheader Title & Action Bar */}
        <div className="px-6 py-3.5 border-b border-slate-800/60 bg-[#0b101f] flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">AI Architecture & Advisory Portal</h1>
            <p className="text-xs text-slate-400">Tracking trending AI models, security shifts, and practice transition milestones.</p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Interactive Filter</span>
            </button>
            <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg font-medium shadow-md shadow-cyan-500/20 transition">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Daily Briefing</span>
            </button>
          </div>
        </div>

        {/* 3. 3-COLUMN COCKPIT (Reflecting ProtoType.jpeg) */}
        <main className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#070b12]">
          
          {/* COLUMN 1: INTELLIGENCE RADAR (4 Cols) */}
          <section className="lg:col-span-4 bg-[#0d1322] border border-slate-800/80 rounded-xl p-4 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight uppercase flex items-center space-x-2">
                  <Radar className="w-4 h-4 text-cyan-400" />
                  <span>Intelligence Radar</span>
                </h2>
                <p className="text-[11px] text-slate-400">ArXiv Papers & Hugging Face Digests</p>
              </div>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/50 px-2 py-0.5 rounded font-mono">
                Daily Feed
              </span>
            </div>

            {/* Filter Chips */}
            <div className="flex space-x-1.5 text-xs">
              <button 
                onClick={() => setRadarFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  radarFilter === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                All Sources
              </button>
              <button 
                onClick={() => setRadarFilter('arxiv')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  radarFilter === 'arxiv' ? 'bg-cyan-600 text-white' : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                ArXiv AI
              </button>
              <button 
                onClick={() => setRadarFilter('hf')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  radarFilter === 'hf' ? 'bg-cyan-600 text-white' : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                Trending Models
              </button>
            </div>

            {/* Radar Cards */}
            <div className="space-y-3 overflow-y-auto pr-1">
              <div className="bg-[#11192e] border border-slate-800/80 hover:border-cyan-800/60 p-3.5 rounded-lg transition group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Architecture</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/40 font-mono">
                    ● 50K Reads
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition">
                  Modular RAG & Self-Correcting Query Engines
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  Architectural breakdown of speculative decoding, reranking fallbacks, and multi-vector retrieval pipelines for reducing hallucination in enterprise environments.
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                  <span>ArXiv: cs.AI • 6h ago</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-400" />
                </div>
              </div>

              <div className="bg-[#11192e] border border-slate-800/80 hover:border-cyan-800/60 p-3.5 rounded-lg transition group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Agents</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/40 font-mono">
                    ● 55K Reads
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition">
                  Agentic Workflows: Multi-Agent Consensus
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  Evaluation of debate protocols between specialized subagents vs monolithic zero-shot prompting across benchmarked enterprise tasks.
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                  <span>ArXiv: cs.CL • 1d ago</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-400" />
                </div>
              </div>

              <div className="bg-[#11192e] border border-slate-800/80 hover:border-cyan-800/60 p-3.5 rounded-lg transition group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Benchmarks</span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800/40 font-mono">
                    Trending
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition">
                  DeepSeek & Open Weights Cost Efficiency
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  Token cost comparisons and distillation patterns enabling enterprise on-premise execution at 1/10th the commercial API cost.
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Hugging Face • 2d ago</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-400" />
                </div>
              </div>
            </div>
          </section>

          {/* COLUMN 2: SECURITY & GOVERNANCE HUB (4 Cols) */}
          <section className="lg:col-span-4 bg-[#0d1322] border border-slate-800/80 rounded-xl p-4 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight uppercase flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Security & Governance</span>
                </h2>
                <p className="text-[11px] text-slate-400">NVD Vulnerabilities & OWASP Top 10</p>
              </div>
              <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-800/50 px-2 py-0.5 rounded font-mono font-semibold">
                3 Active Threats
              </span>
            </div>

            {/* 2x2 Alert Cards Grid (Matching ProtoType.jpeg) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#121929] border border-rose-900/40 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-white">Prompt Injection</span>
                </div>
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/50">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>Priority</span>
                </span>
                <p className="text-[10px] text-slate-400 mt-2">Indirect injection via RAG vector documents.</p>
              </div>

              <div className="bg-[#121929] border border-amber-900/40 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-white">Model Leaks</span>
                </div>
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/50">
                  <Flame className="w-2.5 h-2.5" />
                  <span>Hazard</span>
                </span>
                <p className="text-[10px] text-slate-400 mt-2">System prompt extraction in LangChain agents.</p>
              </div>

              <div className="bg-[#121929] border border-amber-900/40 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-white">Data Exfiltration</span>
                </div>
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/50">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>Hazard</span>
                </span>
                <p className="text-[10px] text-slate-400 mt-2">Zero-click markdown image render leak.</p>
              </div>

              <div className="bg-[#121929] border border-cyan-900/40 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-white">NIST AI RMF</span>
                </div>
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
                  <span>Standard</span>
                </span>
                <p className="text-[10px] text-slate-400 mt-2">Governance controls for enterprise compliance.</p>
              </div>
            </div>

            {/* Embedded Analytics Chart (Matching ProtoType.jpeg) */}
            <div className="bg-[#11192e] border border-slate-800/80 p-3.5 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Monthly CVE Velocity</span>
                <div className="flex items-end space-x-2 mt-3 h-16">
                  <div className="w-5 bg-cyan-600/40 rounded-t h-8"></div>
                  <div className="w-5 bg-cyan-600/60 rounded-t h-12"></div>
                  <div className="w-5 bg-cyan-500 rounded-t h-16"></div>
                  <div className="w-5 bg-indigo-500 rounded-t h-10"></div>
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="flex flex-col items-center pl-4 border-l border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Audit Score</span>
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-cyan-500 border-r-cyan-500 animate-spin-slow"></div>
                  <span className="absolute font-bold text-sm text-white">82%</span>
                </div>
                <span className="text-[9px] text-emerald-400 mt-1">Ready for Audit</span>
              </div>
            </div>
          </section>

          {/* COLUMN 3: ADVISORY LAUNCHPAD & ROADMAP (4 Cols) */}
          <section className="lg:col-span-4 bg-[#0d1322] border border-slate-800/80 rounded-xl p-4 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight uppercase flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Advisory Launchpad</span>
                </h2>
                <p className="text-[11px] text-slate-400">Engineering Manager Transition Roadmap</p>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded font-mono font-bold">
                57% Complete
              </span>
            </div>

            {/* Overall Transition Progress Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-300 mb-1">
                <span>Practice Bootstrap Progress</span>
                <span className="text-cyan-400 font-bold">4 of 7 Milestones</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full w-[57%]"></div>
              </div>
            </div>

            {/* Milestone Checklist (Matching ProtoType.jpeg) */}
            <div className="space-y-2 overflow-y-auto pr-1">
              {milestones.map((milestone) => (
                <div 
                  key={milestone.id}
                  className={`p-2.5 rounded-lg border transition flex items-start space-x-3 ${
                    milestone.completed 
                      ? 'bg-[#101728] border-slate-800/80' 
                      : 'bg-[#0f172a]/60 border-slate-800/40 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {milestone.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold leading-tight ${milestone.completed ? 'text-white' : 'text-slate-300'}`}>
                      {milestone.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {milestone.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>

    </div>
  );
}
