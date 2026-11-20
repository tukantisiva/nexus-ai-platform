'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, DollarSign, Cpu } from 'lucide-react';

interface ModelOption {
  name: string;
  provider: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
}

const models: ModelOption[] = [
  { name: 'Gemini 1.5 Flash / 2.0 Flash', provider: 'Google AI', inputCostPer1M: 0.075, outputCostPer1M: 0.30 },
  { name: 'GPT-4o mini', provider: 'OpenAI', inputCostPer1M: 0.15, outputCostPer1M: 0.60 },
  { name: 'Claude 3.5 Haiku', provider: 'Anthropic', inputCostPer1M: 0.80, outputCostPer1M: 4.00 },
  { name: 'GPT-4o', provider: 'OpenAI', inputCostPer1M: 2.50, outputCostPer1M: 10.00 },
  { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', inputCostPer1M: 3.00, outputCostPer1M: 15.00 },
];

export default function CalculatorPage() {
  const [selectedModel, setSelectedModel] = useState<ModelOption>(models[0]);
  const [queriesPerDay, setQueriesPerDay] = useState<number>(5000);
  const [avgInputTokens, setAvgInputTokens] = useState<number>(1200);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(350);

  // Cost formulas
  const monthlyQueries = queriesPerDay * 30;
  const monthlyInputTokens = (monthlyQueries * avgInputTokens);
  const monthlyOutputTokens = (monthlyQueries * avgOutputTokens);

  const inputCost = (monthlyInputTokens / 1_000_000) * selectedModel.inputCostPer1M;
  const outputCost = (monthlyOutputTokens / 1_000_000) * selectedModel.outputCostPer1M;
  const totalMonthlyCost = inputCost + outputCost;

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center space-x-2 text-xs text-cyan-400 hover:text-cyan-300 mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Advisory Portal</span>
        </Link>

        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/40">
              Interactive ROI Tool
            </span>
            <h1 className="text-2xl font-bold text-white mt-2">Enterprise LLM Token & Cost Calculator</h1>
            <p className="text-xs text-slate-400 mt-1">
              Estimate monthly API expenditure based on daily query volume and token payload sizes.
            </p>
          </div>

          {/* Model Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Select Target LLM Architecture</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {models.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setSelectedModel(m)}
                  className={`p-3 rounded-lg border text-left text-xs transition ${
                    selectedModel.name === m.name
                      ? 'bg-cyan-950/60 border-cyan-500 text-white'
                      : 'bg-[#10172a] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{m.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {m.provider} • \${m.inputCostPer1M} in / \${m.outputCostPer1M} out (per 1M)
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Input Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Queries / Day</label>
              <input
                type="number"
                value={queriesPerDay}
                onChange={(e) => setQueriesPerDay(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#10172a] border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Avg Input Tokens (Context + RAG)</label>
              <input
                type="number"
                value={avgInputTokens}
                onChange={(e) => setAvgInputTokens(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#10172a] border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Avg Output Tokens (Response)</label>
              <input
                type="number"
                value={avgOutputTokens}
                onChange={(e) => setAvgOutputTokens(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#10172a] border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Cost Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-[#10172a] border border-slate-800/80 p-4 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-500">Monthly Query Volume</span>
              <p className="text-xl font-bold text-white mt-1">{monthlyQueries.toLocaleString()}</p>
              <span className="text-[10px] text-slate-400">Total requests / month</span>
            </div>

            <div className="bg-[#10172a] border border-slate-800/80 p-4 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-500">Token Volume</span>
              <p className="text-xl font-bold text-cyan-400 mt-1">
                {((monthlyInputTokens + monthlyOutputTokens) / 1_000_000).toFixed(1)}M
              </p>
              <span className="text-[10px] text-slate-400">Combined in/out tokens</span>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/80 to-[#10172a] border border-cyan-800/60 p-4 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-cyan-300">Estimated Monthly Spend</span>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                ${totalMonthlyCost.toFixed(2)}
              </p>
              <span className="text-[10px] text-slate-400">Excludes vector DB hosting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
