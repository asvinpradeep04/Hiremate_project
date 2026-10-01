import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

interface ReasoningNode {
  id: string;
  name: string;
  category: string;
  score: number;
  status: 'passed' | 'warning' | 'strong';
  quote: string;
  finding: string;
  x: number; // percentage
  y: number; // percentage
}

const REASONING_NODES: ReasoningNode[] = [
  {
    id: 'clarify',
    name: 'CLARIFICATION',
    category: 'Scope & Boundary Verification',
    score: 94,
    status: 'strong',
    quote: '"Before diagnosing features, is this 30-day retention drop isolated to mobile free tiers or paid subscribers?"',
    finding: 'Immediately bound the search space without premature assumptions.',
    x: 12,
    y: 45,
  },
  {
    id: 'empathy',
    name: 'USER UNDERSTANDING',
    category: 'Behavioral Friction Isolation',
    score: 84,
    status: 'strong',
    quote: '"Commute listeners abandon daily mixes when track 3 unexpectedly shifts genres, causing emotional drop-off."',
    finding: 'Identified experiential friction rather than abstract demographic cohorts.',
    x: 28,
    y: 20,
  },
  {
    id: 'framing',
    name: 'PROBLEM FRAMING',
    category: 'Root Cause vs Symptom Separation',
    score: 64,
    status: 'warning',
    quote: '"We should build an AI chatbot DJ between songs to boost engagement."',
    finding: 'Premature solutioning detected: pitched complex feature before confirming onboarding vs discovery drop-off.',
    x: 48,
    y: 65,
  },
  {
    id: 'prioritize',
    name: 'PRIORITIZATION',
    category: 'Objective Trade-off Matrix',
    score: 85,
    status: 'strong',
    quote: '"Prioritizing algorithmic skip reduction over social features due to 3x engineering leverage on existing infra."',
    finding: 'Defended decision sequence using explicit leverage and engineering feasibility.',
    x: 68,
    y: 30,
  },
  {
    id: 'tradeoffs',
    name: 'TRADE-OFFS & GUARDRAILS',
    category: 'Downside Metric Governance',
    score: 91,
    status: 'strong',
    quote: '"Our guardrail metric must be ad-skip complaints and push notification unsubscribe rates."',
    finding: 'Explicitly protected whole-platform health with counter-metrics.',
    x: 82,
    y: 60,
  },
  {
    id: 'structuring',
    name: 'STRUCTURING',
    category: 'Executive Synthesis',
    score: 88,
    status: 'strong',
    quote: '"In summary: 1 diagnostic cohort run, 2 low-risk discovery tests, targeting +3.5% retention lift."',
    finding: 'Clean executive signposting leaving the interviewer with high clarity.',
    x: 95,
    y: 38,
  },
];

export function NeuralReasoningMap() {
  const [selectedNode, setSelectedNode] = useState<ReasoningNode>(REASONING_NODES[2]); // Default to flagged warning for impact
  const [activeStep, setActiveStep] = useState(0);

  // Auto-pulse through nodes sequentially for dynamic AI life
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % REASONING_NODES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-3xl border border-white/[0.08] bg-[#070707] p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.9)] relative overflow-hidden text-left">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

      {/* Atmospheric ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top telemetry bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.07] gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/30">
            <Brain className="h-4 w-4 text-teal-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                COGNITIVE REASONING TOPOLOGY
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
            </div>
            <p className="font-mono text-[10px] text-zinc-500">Live Graph · 6 Distinct PM Competency Nodes</p>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf]" />
            <span>Sound Logic</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
            <span>Cognitive Gap</span>
          </div>
        </div>
      </div>

      {/* Neural Graph Canvas (Desktop / Interactive SVG) */}
      <div className="relative my-8 h-[280px] sm:h-[340px] w-full z-10">
        {/* SVG Neural Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#19D3C5" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#35E6FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#19D3C5" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connected Curves across sequential nodes */}
          {REASONING_NODES.slice(0, -1).map((node, i) => {
            const nextNode = REASONING_NODES[i + 1];
            return (
              <g key={`connection-${i}`}>
                {/* Background base path */}
                <line
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${nextNode.x}%`}
                  y2={`${nextNode.y}%`}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Active animated pulsing pulse line */}
                <line
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${nextNode.x}%`}
                  y2={`${nextNode.y}%`}
                  stroke={node.status === 'warning' || nextNode.status === 'warning' ? '#fbbf24' : '#19D3C5'}
                  strokeWidth="2"
                  strokeDasharray="8 12"
                  strokeOpacity={activeStep === i ? 0.9 : 0.3}
                  filter="url(#glow)"
                  className="transition-all duration-700"
                />
              </g>
            );
          })}
        </svg>

        {/* Node Buttons Placed Over the Topology */}
        {REASONING_NODES.map((node, idx) => {
          const isSelected = selectedNode.id === node.id;
          const isWarning = node.status === 'warning';
          const isCurrentActive = activeStep === idx;

          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              onClick={() => setSelectedNode(node)}
              data-cursor="view"
            >
              {/* Outer pulsing ring for active node */}
              {(isSelected || isCurrentActive) && (
                <div
                  className={`absolute -inset-3 rounded-full animate-ping opacity-40 pointer-events-none ${
                    isWarning ? 'bg-amber-400' : 'bg-teal-400'
                  }`}
                />
              )}

              {/* Node Core Badge */}
              <div
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-md transition-all duration-300 shadow-xl ${
                  isSelected
                    ? isWarning
                      ? 'border-amber-400 bg-[#1A1308] shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-105'
                      : 'border-teal-400 bg-[#081717] shadow-[0_0_25px_rgba(25,211,197,0.4)] scale-105'
                    : isWarning
                    ? 'border-amber-500/30 bg-[#0D0B07] hover:border-amber-400/60'
                    : 'border-white/10 bg-[#0A0A0A] hover:border-teal-500/40 hover:bg-[#0F1414]'
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isWarning
                      ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                      : 'bg-teal-400 shadow-[0_0_8px_#19D3C5]'
                  }`}
                />
                <div className="text-left">
                  <div className="font-mono text-[10px] font-bold text-white tracking-wider flex items-center gap-1.5">
                    <span>{node.name}</span>
                    {isWarning && <AlertTriangle className="h-3 w-3 text-amber-400 inline" />}
                  </div>
                  <span
                    className={`font-mono text-[9px] font-semibold ${
                      isWarning ? 'text-amber-400' : 'text-teal-300'
                    }`}
                  >
                    {node.score}% {isWarning ? 'GAP' : 'SOUND'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Deep Dive Inspector */}
      <div className="relative z-10 rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                selectedNode.status === 'warning' ? 'bg-amber-400' : 'bg-teal-400'
              }`}
            />
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              REASONING SIGNAL: {selectedNode.name}
            </span>
            <span className="text-zinc-500 font-mono text-xs">·</span>
            <span className="font-mono text-xs text-zinc-400">{selectedNode.category}</span>
          </div>

          <div className="font-mono text-xs flex items-center gap-2">
            <span className="text-zinc-500">EVALUATION SCORE:</span>
            <span
              className={`font-bold ${
                selectedNode.status === 'warning' ? 'text-amber-400' : 'text-teal-300'
              }`}
            >
              {selectedNode.score} / 100
            </span>
          </div>
        </div>

        {/* Verbatim quote from candidate */}
        <div className="rounded-xl border border-white/[0.05] bg-[#050505] p-3.5">
          <span className="font-mono text-[10px] text-zinc-500 block mb-1 uppercase tracking-wider">
            VERBATIM CANDIDATE UTTERANCE (EXTRACTED)
          </span>
          <p className="font-serif italic text-sm text-zinc-200 leading-relaxed">
            {selectedNode.quote}
          </p>
        </div>

        {/* Clinical diagnosis */}
        <div className="flex items-start gap-2.5 text-xs text-zinc-300 font-sans leading-relaxed pt-1">
          <Sparkles className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">AI Diagnostic Finding: </strong>
            {selectedNode.finding}
          </p>
        </div>
      </div>
    </div>
  );
}
