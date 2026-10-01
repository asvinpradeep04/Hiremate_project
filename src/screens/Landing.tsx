import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Brain,
  Radio,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  Mic,
  TrendingUp,
  RotateCcw,
  Dumbbell,
  Repeat,
  Layers,
  Activity,
  Zap,
  ChevronRight,
  Compass,
  Target,
  Sliders,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { AudioWaveform } from '@/components/AudioWaveform';
import { AICoreSphere } from '@/components/AICoreSphere';
import { NeuralReasoningMap } from '@/components/NeuralReasoningMap';

interface LandingProps {
  onStart: () => void;
}

// 6 Competency Signals for the "See What The Interviewer Sees" Demo Section
const SIGNALS_CATALOG = [
  {
    id: 'clarification',
    number: '01',
    label: 'CLARIFICATION',
    tagline: 'Scope & Boundary Verification',
    score: 94,
    status: 'sound',
    quote: '"Before diagnosing features, I want to clarify: is this 30-day retention drop concentrated in free mobile tiers or paid desktop subscribers?"',
    evaluatorNote: 'Senior-level boundary setting. Immediately prevents wasting time on wrong user segments before problem diagnosis.',
    behaviorTag: 'Strong Boundary Framing',
  },
  {
    id: 'user_empathy',
    number: '02',
    label: 'USER UNDERSTANDING',
    tagline: 'Behavioral Friction Isolation',
    score: 84,
    status: 'sound',
    quote: '"Casual commute listeners abandon daily mixes around track 3 because the algorithmic shift to heavy synth creates emotional friction."',
    evaluatorNote: 'Isolates the specific moment of emotional drop-off rather than reciting generic demographic surveys.',
    behaviorTag: 'Persona Friction Identified',
  },
  {
    id: 'problem_framing',
    number: '03',
    label: 'PROBLEM FRAMING',
    tagline: 'Root Cause vs Symptom Separation',
    score: 61,
    status: 'warning',
    quote: '"We should build an AI conversational DJ between tracks to keep listeners engaged with their daily mixes."',
    evaluatorNote: 'COGNITIVE GAP (02:18): Premature feature pitch. Candidate jumped into complex technology before verifying onboarding vs discovery friction.',
    behaviorTag: 'Premature Solutioning Flagged',
  },
  {
    id: 'prioritization',
    number: '04',
    label: 'PRIORITIZATION',
    tagline: 'Objective Trade-off Matrix',
    score: 85,
    status: 'sound',
    quote: '"Between collaborative playlist sharing and skip-reduction algorithms, I prioritize skip reduction due to 3x engineering leverage on existing infra."',
    evaluatorNote: 'Rigorous trade-off justification using reach, effort, and architecture leverage.',
    behaviorTag: 'Leverage Weighted Criteria',
  },
  {
    id: 'trade_offs',
    number: '05',
    label: 'TRADE-OFFS & GUARDRAILS',
    tagline: 'Downside Metric Governance',
    score: 91,
    status: 'sound',
    quote: '"While maximizing total session listening minutes, our explicit guardrail metrics must be ad-skip complaints and push unsubscribes."',
    evaluatorNote: 'Protects the holistic ecosystem by naming explicit counter-metrics and adverse externalities.',
    behaviorTag: 'Guardrails Firmly Established',
  },
  {
    id: 'structuring',
    number: '06',
    label: 'STRUCTURING',
    tagline: 'Top-Down Executive Synthesis',
    score: 88,
    status: 'sound',
    quote: '"To summarize our roadmap: 1 diagnostic cohort run, 2 low-risk discovery experiments, targeting a +3.5% 30-day retention lift."',
    evaluatorNote: 'Crisp, structured wrap-up providing decision clarity and clear ownership expectations.',
    behaviorTag: 'Executive Signposting Verified',
  },
];

// Circular Practice Journey Stages
const PRACTICE_JOURNEY = [
  {
    id: '01',
    name: 'INTERVIEW',
    tag: 'DYNAMIC PRESSURE',
    headline: 'Adaptive Voice Simulation',
    description: 'Enter a high-stakes simulation. The AI interviewer actively challenges vague assumptions and pushes for structured trade-offs.',
    visualBadge: 'AI VOICE PROBING',
  },
  {
    id: '02',
    name: 'EVIDENCE',
    tag: 'VERBATIM QUOTES',
    headline: 'Transcript Extraction',
    description: 'Every statement is timestamped and indexed against top tech PM rubrics with zero hallucinated feedback.',
    visualBadge: '100% QUOTE GROUNDED',
  },
  {
    id: '03',
    name: 'DIAGNOSIS',
    tag: 'COGNITIVE AUDIT',
    headline: 'Habit-Level Breakdown',
    description: 'Diagnoses whether you jumped into features prematurely, neglected constraints, or failed to name guardrail metrics.',
    visualBadge: 'COGNITIVE GAP DETECTED',
  },
  {
    id: '04',
    name: 'PRACTICE',
    tag: 'DELIBERATE DRILL',
    headline: 'Single-Weakness Micro-Drill',
    description: 'Work on your single highest-friction habit using structured behavioral frameworks before re-entering the simulator.',
    visualBadge: 'HABIT REWIRING',
  },
  {
    id: '05',
    name: 'RETEST',
    tag: 'ISOMORPHIC CASE',
    headline: 'Comparable Second Attempt',
    description: 'Test your refined habit on an equivalent business problem to validate whether the behavioral learning transferred.',
    visualBadge: 'TRANSFER VALIDATION',
  },
  {
    id: '06',
    name: 'PROVE',
    tag: 'TELEMETRY DELTA',
    headline: 'Measured Side-by-Side Delta',
    description: 'See exact before-and-after rubric jumps, transcript comparisons, and quantified proof of candidate readiness.',
    visualBadge: '+1.4 RUBRIC DELTA',
  },
];

export function Landing({ onStart }: LandingProps) {
  const [activeSignal, setActiveSignal] = useState(SIGNALS_CATALOG[2]); // Default to flagged warning for drama
  const [activeJourneyIdx, setActiveJourneyIdx] = useState(0);
  const [heroScores, setHeroScores] = useState({ structuring: 78, empathy: 84, prioritization: 61 });

  // Gentle subtle pulse in hero telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroScores({
        structuring: 78 + Math.floor(Math.sin(Date.now() / 2000) * 3),
        empathy: 84 + Math.floor(Math.cos(Date.now() / 2500) * 2),
        prioritization: 61 + Math.floor(Math.sin(Date.now() / 1800) * 3),
      });
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F2] selection:bg-teal-500/25 selection:text-teal-200 overflow-x-hidden">
      {/* Minimal Header Navigation as specified */}
      <Header
        rightContent={
          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollToSection('reasoning-map')}
              className="hidden sm:inline-block text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection('practice-loop')}
              className="hidden sm:inline-block text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Practice
            </button>
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-xl border border-teal-500/40 bg-teal-950/40 px-4 py-2 text-xs font-semibold text-teal-300 hover:bg-teal-900/50 hover:border-teal-400 shadow-[0_0_15px_rgba(25,211,197,0.2)] transition-all cursor-pointer"
              data-cursor="explore"
            >
              <span>Start Interview</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        }
      />

      {/* ────────────────────────────────────────────────────────
          1. HERO SECTION: 2-COLUMN CINEMATIC COMPOSITION
          Left: Emotional / Product Promise + Single CTA
          Right: ONE Cinematic Floating Proof of the Product
      ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-10 pb-20 sm:pt-16 sm:pb-28 px-6 overflow-hidden">
        {/* Subtle Ambient Radial Glow Behind Hero */}
        <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] pointer-events-none -z-10 opacity-25 blur-[140px] bg-gradient-to-tr from-teal-500/50 via-cyan-400/20 to-transparent" />

        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* LEFT COLUMN: Emotional / Product Promise (5 Cols) */}
          <div className="lg:col-span-6 space-y-8 text-left relative z-20">
            {/* Small Eyebrow */}
            <div className="inline-flex flex-col gap-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              <span className="text-teal-400 font-bold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#19D3C5] animate-ping" />
                AI INTERVIEW LAB
              </span>
              <span className="text-zinc-500 text-[10px]">PRODUCT SENSE SIMULATION</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-normal tracking-tight text-[#F5F5F2] leading-[1.08]">
              Practice the interview.
              <br />
              <span className="text-[#19D3C5] italic">Understand your reasoning.</span>
              <br />
              Improve it.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#8A8F98] font-normal leading-relaxed max-w-xl">
              An adaptive PM interview simulator that analyzes how you think, not just what you say.
            </p>

            {/* ONE Primary CTA + Secondary Microcopy */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={onStart}
                className="btn-primary text-base px-8 py-4 group"
                data-cursor="explore"
              >
                <span>Start Product Sense Interview</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </button>
              <div className="font-mono text-xs text-[#8A8F98] flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>No signup required · 15–20 minutes</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ONE Cinematic AI Interview Intelligence Proof (6 Cols) */}
          <div className="lg:col-span-6 relative z-10">
            {/* Ambient subtle back glow */}
            <div className="absolute -inset-4 bg-teal-500/10 rounded-3xl blur-2xl pointer-events-none" />

            {/* Floating Product Intelligence Window */}
            <div className="relative rounded-3xl border border-white/[0.12] bg-[#0A0A0A]/95 p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-left overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
              {/* Subtle Laser Scanline Effect */}
              <div className="pointer-events-none absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-50 animate-laser-scan shadow-[0_0_12px_#19D3C5]" />

              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_#19D3C5]" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-300">
                    AI INTERVIEW INTELLIGENCE
                  </span>
                </div>
                <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-500/20">
                  LIVE SESSION
                </span>
              </div>

              {/* Prompt Box */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#050505] p-5 shadow-inner space-y-2">
                <div className="font-mono text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                  CASE 01 · PRODUCT SENSE
                </div>
                <p className="font-serif text-lg sm:text-xl text-[#F5F5F2] font-normal leading-relaxed">
                  "You are a PM at Spotify. 30-day listening retention dropped from 45% to 31%."
                </p>
              </div>

              {/* Animated Audio Waveform Telemetry */}
              <div className="my-5 rounded-2xl border border-white/[0.06] bg-[#0E0E0E] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-300">
                    <Radio className="h-3.5 w-3.5 text-teal-400 animate-pulse" />
                    <span>Candidate Spoken Audio Waveform</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#8A8F98]">Multimodal Neural Spectral FFT</span>
                </div>
                <div className="w-full sm:w-56">
                  <AudioWaveform state="playing" height={36} barCount={24} />
                </div>
              </div>

              {/* Live Signal Analysis Bars */}
              <div className="space-y-3 pt-1">
                <div className="font-mono text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  LIVE ANALYSIS
                </div>

                <div className="space-y-2.5">
                  {/* Structuring */}
                  <div className="rounded-xl border border-white/[0.06] bg-[#050505] p-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-zinc-300">STRUCTURING</span>
                    <div className="flex items-center gap-3">
                      <div className="w-28 sm:w-36 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 shadow-[0_0_8px_#19D3C5] transition-all duration-700"
                          style={{ width: `${heroScores.structuring}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-teal-300 w-10 text-right">
                        {heroScores.structuring}%
                      </span>
                    </div>
                  </div>

                  {/* User Empathy */}
                  <div className="rounded-xl border border-white/[0.06] bg-[#050505] p-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-zinc-300">USER EMPATHY</span>
                    <div className="flex items-center gap-3">
                      <div className="w-28 sm:w-36 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 shadow-[0_0_8px_#19D3C5] transition-all duration-700"
                          style={{ width: `${heroScores.empathy}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-teal-300 w-10 text-right">
                        {heroScores.empathy}%
                      </span>
                    </div>
                  </div>

                  {/* Prioritization */}
                  <div className="rounded-xl border border-white/[0.06] bg-[#050505] p-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-zinc-300">PRIORITIZATION</span>
                    <div className="flex items-center gap-3">
                      <div className="w-28 sm:w-36 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_8px_#fbbf24] transition-all duration-700"
                          style={{ width: `${heroScores.prioritization}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400 w-10 text-right">
                        {heroScores.prioritization}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          2. SCROLL SECTION 1: REASONING VISUALIZATION
          "How is it different?"
          AI neural reasoning map showing how cognitive signals are extracted
      ──────────────────────────────────────────────────────── */}
      <section id="reasoning-map" className="py-28 px-6 border-t border-white/[0.07] bg-[#070707] relative overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl mb-12 text-left">
            <div className="section-label mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              COGNITIVE SIGNAL EXTRACTION
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F5F5F2] leading-[1.12]">
              AI doesn’t just hear your answer.
              <br />
              <span className="text-[#19D3C5] italic">It reads the reasoning behind it.</span>
            </h2>
            <p className="mt-4 text-base text-[#8A8F98] max-w-2xl leading-relaxed">
              Every PM answer is composed of cognitive moves: clarifying boundaries, isolating friction, structuring hypotheses, and naming trade-offs. The simulator traces your neural reasoning pathway in real time.
            </p>
          </div>

          {/* Interactive AI Neural Reasoning Map */}
          <NeuralReasoningMap />
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          3. SCROLL SECTION 2: LIVE INTERVIEW DEMO
          "What actually happens?" / "See what the interviewer sees."
          Sticky left headline + Layered simulated analysis window
      ──────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-white/[0.07] bg-[#050505] relative overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* LEFT STICKY (5 Cols): Headline & Interactive Signal Nav */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 text-left">
              <div className="section-label">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                SIMULATED INTERVIEW ANALYSIS
              </div>
              <h2 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-[#F5F5F2] leading-[1.08]">
                See what the interviewer sees.
              </h2>
              <p className="text-base text-[#8A8F98] leading-relaxed">
                As you speak, the system extracts verbatim evidence, measures your structured communication, and detects habits like premature solutioning before human interviewers can even write them down.
              </p>

              {/* Interactive Competency Selector */}
              <div className="space-y-2 pt-2">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">
                  CLICK TO AUDIT COMPETENCY SIGNAL
                </span>
                {SIGNALS_CATALOG.map((sig) => {
                  const isSelected = activeSignal.id === sig.id;
                  const isWarn = sig.status === 'warning';
                  return (
                    <button
                      key={sig.id}
                      onClick={() => setActiveSignal(sig)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? isWarn
                            ? 'border-amber-400 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                            : 'border-teal-400 bg-teal-950/20 shadow-[0_0_20px_rgba(25,211,197,0.2)]'
                          : 'border-white/[0.06] bg-[#0A0A0A] hover:border-white/20 hover:bg-[#111111]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-zinc-500">{sig.number}</span>
                        <span className={`font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                          {sig.label}
                        </span>
                        {isWarn && (
                          <span className="font-mono text-[9px] uppercase font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/30">
                            GAP
                          </span>
                        )}
                      </div>
                      <span className={`font-mono text-xs font-bold ${isWarn ? 'text-amber-400' : 'text-teal-400'}`}>
                        {sig.score}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT (7 Cols): Layered Simulated Interview Screen */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Main Analysis Screen */}
              <div className="rounded-3xl border border-white/[0.12] bg-[#0A0A0A] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                      LIVE INTERVIEW AUDIT · SPOTIFY PM L5
                    </span>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">Elapsed: 02:45 · 6 Signals Detected</p>
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-full border ${
                      activeSignal.status === 'warning'
                        ? 'border-amber-500/40 bg-amber-950/30 text-amber-300'
                        : 'border-teal-500/40 bg-teal-950/30 text-teal-300'
                    }`}
                  >
                    {activeSignal.behaviorTag}
                  </span>
                </div>

                {/* AI Interviewer Prompt */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#050505] p-4 text-xs font-mono text-zinc-400 mb-4">
                  <strong className="text-teal-400 uppercase">AI Interviewer: </strong>
                  "30-day listening retention dropped from 45% to 31%. Where do you begin your diagnostic framework?"
                </div>

                {/* Candidate Utterance with Highlighted Quote */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E0E] p-6 space-y-3">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
                    CANDIDATE SPOKEN TRANSCRIPT
                  </span>
                  <p className="font-sans text-sm sm:text-base text-zinc-200 leading-relaxed">
                    "Thanks for the prompt.{' '}
                    <mark
                      className={`px-1.5 py-0.5 rounded font-semibold transition-colors duration-300 ${
                        activeSignal.status === 'warning'
                          ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                          : 'bg-teal-500/20 text-teal-200 border border-teal-500/40'
                      }`}
                    >
                      {activeSignal.quote}
                    </mark>{' '}
                    Then I’d isolate whether this churn is driven by algorithmic recommendation decay or onboarding UX friction."
                  </p>
                </div>

                {/* Clinical Evaluator Finding */}
                <div
                  className={`mt-6 rounded-2xl border p-5 space-y-2 transition-colors duration-300 ${
                    activeSignal.status === 'warning'
                      ? 'border-amber-500/30 bg-[#161208]'
                      : 'border-teal-500/30 bg-[#0A1414]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                        activeSignal.status === 'warning' ? 'text-amber-300' : 'text-teal-300'
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
                      EVALUATION DIAGNOSIS: {activeSignal.label}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        activeSignal.status === 'warning' ? 'text-amber-400' : 'text-teal-400'
                      }`}
                    >
                      SCORE {activeSignal.score} / 100
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
                    {activeSignal.evaluatorNote}
                  </p>
                </div>
              </div>

              {/* Real Photo Asset: Digital Interview Room */}
              <div className="rounded-3xl border border-white/[0.1] overflow-hidden shadow-2xl relative group">
                <img
                  src="/assets/ai_interview_environment.jpg"
                  alt="AI Interview Laboratory Environment"
                  className="w-full h-auto max-h-[380px] object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between font-mono text-xs text-white">
                  <span className="text-teal-300 font-bold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                    AUTONOMOUS AI VOICE AGENT
                  </span>
                  <span className="text-zinc-400">ZERO LATENCY TTS / STT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          4. SCROLL SECTION 3: THE PRACTICE LOOP
          "How does it help me improve?"
          Horizontal progression / pinned section with unique visuals
      ──────────────────────────────────────────────────────── */}
      <section id="practice-loop" className="py-28 px-6 border-t border-white/[0.07] bg-[#070707] relative overflow-hidden">
        <div className="mx-auto max-w-7xl text-left mb-16">
          <div className="section-label mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            THE SYSTEM ARCHITECTURE
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#F5F5F2] leading-tight">
            The Practice Loop.
          </h2>
          <p className="mt-3 text-base text-[#8A8F98] max-w-2xl leading-relaxed">
            Most prep tools give you 500 questions and static answers. We give you a clinical loop to isolate weaknesses, practice the exact behavior, and prove real improvement.
          </p>
        </div>

        {/* 6 Stages Progression Architecture */}
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive Stage List */}
          <div className="lg:col-span-6 space-y-3 text-left">
            {PRACTICE_JOURNEY.map((stage, idx) => {
              const isActive = activeJourneyIdx === idx;
              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveJourneyIdx(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'border-teal-400 bg-teal-950/20 shadow-[0_0_30px_rgba(25,211,197,0.15)] scale-[1.01]'
                      : 'border-white/[0.06] bg-[#0A0A0A] hover:border-white/20'
                  }`}
                  data-cursor="view"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs font-bold ${isActive ? 'text-teal-400' : 'text-zinc-500'}`}>
                        {stage.id}
                      </span>
                      <h3 className="text-sm font-bold text-white tracking-wide">{stage.name}</h3>
                    </div>
                    <span className="font-mono text-[10px] text-teal-400 uppercase tracking-wider font-semibold">
                      {stage.tag}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200 mt-1">{stage.headline}</h4>
                  <p className="text-xs text-[#8A8F98] mt-1 leading-relaxed">{stage.description}</p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Stage 3D AI Core & Visual Proof */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 rounded-3xl border border-white/[0.08] bg-[#0A0A0A] shadow-2xl relative min-h-[460px] text-center">
            <AICoreSphere
              size="hero"
              activeStage={PRACTICE_JOURNEY[activeJourneyIdx].name}
              pulseGlow={true}
            />

            <div className="mt-8 w-full rounded-2xl border border-white/[0.08] bg-[#070707] p-5 space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-teal-300 tracking-widest">
                {PRACTICE_JOURNEY[activeJourneyIdx].visualBadge}
              </span>
              <h4 className="font-serif text-lg font-bold text-white">
                {PRACTICE_JOURNEY[activeJourneyIdx].headline}
              </h4>
              <p className="text-xs text-[#8A8F98] leading-relaxed max-w-md mx-auto">
                {PRACTICE_JOURNEY[activeJourneyIdx].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          5. BENTO GRID: PRODUCT CAPABILITIES
          Bento grid used only where it helps
      ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/[0.07] bg-[#080808]">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-12 text-left">
            <div className="section-label mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              PRODUCT CAPABILITIES
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#F5F5F2] leading-tight">
              Five engines powering your readiness.
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 text-left">
            {/* Bento 1: Audio Intelligence (Span 7) */}
            <div className="lg:col-span-7 rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-7 shadow-lg flex flex-col justify-between hover:border-teal-500/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-light text-zinc-600">01</span>
                  <span className="badge bg-teal-500/10 text-teal-300 border border-teal-500/30 font-mono text-[10px]">
                    AUDIO INTELLIGENCE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">Multimodal Acoustic Waveform Analysis</h3>
                <p className="text-xs text-[#8A8F98] leading-relaxed mt-2 mb-6">
                  Measures pacing, hesitations, defensive fillers, and structured verbal signposting in real-time.
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-[#050505] p-5">
                <AudioWaveform state="playing" height={42} barCount={30} />
              </div>
            </div>

            {/* Bento 2: Evidence Extraction (Span 5) */}
            <div className="lg:col-span-5 rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-7 shadow-lg flex flex-col justify-between hover:border-teal-500/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-light text-zinc-600">02</span>
                  <span className="badge bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono text-[10px]">
                    EVIDENCE EXTRACTION
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">Zero Hallucinations</h3>
                <p className="text-xs text-[#8A8F98] leading-relaxed mt-2">
                  Every rubric score is anchored to an exact transcript quote. No generic advice.
                </p>
              </div>
              <div className="mt-6 rounded-2xl border border-white/[0.06] bg-[#050505] p-4 font-mono text-xs text-zinc-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Quote Grounding:</span>
                  <span className="text-teal-300 font-bold">100% Verifiable</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Rubric Calibration:</span>
                  <span className="text-white">Google & Meta L5/L6</span>
                </div>
              </div>
            </div>

            {/* Bento 3: Reasoning Analysis (Span 4) */}
            <div className="lg:col-span-4 rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-7 shadow-lg flex flex-col justify-between hover:border-teal-500/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-light text-zinc-600">03</span>
                  <Activity className="h-5 w-5 text-teal-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Reasoning Analysis</h3>
                <p className="text-xs text-[#8A8F98] leading-relaxed mt-2">
                  Diagnoses whether you framed the problem before proposing solutions.
                </p>
              </div>
              <div className="mt-6 rounded-xl border border-teal-500/30 bg-teal-950/20 p-3 text-center font-mono text-xs text-teal-300">
                AUDIT: HABITS OVER TRIVIA
              </div>
            </div>

            {/* Bento 4: Targeted Practice (Span 4) */}
            <div className="lg:col-span-4 rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-7 shadow-lg flex flex-col justify-between hover:border-teal-500/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-light text-zinc-600">04</span>
                  <Dumbbell className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Targeted Practice</h3>
                <p className="text-xs text-[#8A8F98] leading-relaxed mt-2">
                  Isolate and rewire your single biggest habit bottleneck with a 3-minute exercise.
                </p>
              </div>
              <div className="mt-6 rounded-xl border border-white/10 bg-[#050505] p-3 text-center font-mono text-xs text-zinc-300">
                DELIBERATE DRILL CHAMBER
              </div>
            </div>

            {/* Bento 5: Improvement Proof (Span 4) */}
            <div className="lg:col-span-4 rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-7 shadow-lg flex flex-col justify-between hover:border-teal-500/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-light text-zinc-600">05</span>
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Improvement Proof</h3>
                <p className="text-xs text-[#8A8F98] leading-relaxed mt-2">
                  Validate measurable behavioral transfer in a comparable second attempt.
                </p>
              </div>
              <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-center font-mono text-xs text-emerald-300 font-bold">
                +1.2 TO +1.8 SCORE JUMP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          6. SCROLL SECTION 4: BEFORE VS AFTER (ATTEMPT 1 → ATTEMPT 2)
          "Can I see the improvement?"
          "Don't just get feedback. Prove that you improved."
      ──────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-white/[0.07] bg-[#050505] relative overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
            {/* Left 5 Cols: Narrative & Metric Shifts */}
            <div className="lg:col-span-5 space-y-6">
              <div className="section-label">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                MEASURED IMPROVEMENT
              </div>
              <h2 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-[#F5F5F2] leading-[1.08]">
                Don’t just get feedback.
                <br />
                <span className="text-[#19D3C5] italic">Prove that you improved.</span>
              </h2>
              <p className="text-base text-[#8A8F98] leading-relaxed">
                Most platforms leave you wondering if you actually improved. We retest your isolated weakness on an isomorphic case and graph the exact before-and-after shift.
              </p>

              {/* Side-by-Side Competency Metrics Comparison Card */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-5 space-y-4">
                <div className="grid grid-cols-3 font-mono text-[10px] text-zinc-500 uppercase pb-2 border-b border-white/[0.06]">
                  <span>COMPETENCY</span>
                  <span className="text-center">ATTEMPT 01</span>
                  <span className="text-right text-emerald-400">ATTEMPT 02</span>
                </div>

                {/* Metric 1 */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300">Structuring</span>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-500">61%</span>
                    <span className="text-zinc-600">→</span>
                    <span className="text-emerald-400 font-bold">82%</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300">User Empathy</span>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-500">72%</span>
                    <span className="text-zinc-600">→</span>
                    <span className="text-emerald-400 font-bold">79%</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300">Prioritization</span>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-500">58%</span>
                    <span className="text-zinc-600">→</span>
                    <span className="text-emerald-400 font-bold">76%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between font-mono text-[11px]">
                  <span className="text-teal-400 font-bold">TARGETED REWIRING SUCCESS</span>
                  <span className="text-emerald-400 font-bold">+18% AVG DELTA</span>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: High-Resolution Delta Analytics Image Asset */}
            <div className="lg:col-span-7 rounded-3xl border border-white/[0.12] overflow-hidden shadow-2xl relative group">
              <img
                src="/assets/comparison_delta_analytics.jpg"
                alt="Attempt 1 vs Attempt 2 Comparison Dashboard"
                className="w-full h-auto object-cover max-h-[500px] group-hover:scale-[1.02] transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between font-mono text-xs text-white">
                <span className="text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  +1.4 OVERALL READINESS DELTA
                </span>
                <span className="text-zinc-400">ISOMORPHIC VALIDATION COMPLETE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          7. FINAL CTA SECTION: IMMERSIVE LAUNCH PAD
          "Let me try it."
          Central visual: glowing AI signal / waveform with expanding rings
      ──────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-6 py-32 text-center overflow-hidden">
        {/* Subtle expanding signal rings & ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />

        {/* Central visual: glowing AI signal with subtle expanding rings */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute w-44 h-44 rounded-full border border-teal-500/20 animate-ping opacity-30 pointer-events-none" />
          <div className="absolute w-32 h-32 rounded-full border border-teal-400/30 animate-pulse pointer-events-none" />
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-950 via-[#0A1A1A] to-teal-800/40 border border-teal-400/40 shadow-[0_0_30px_rgba(25,211,197,0.5)]">
            <Brain className="h-8 w-8 text-teal-300 animate-pulse" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/30 px-4 py-1.5 mb-6 font-mono text-xs font-bold text-teal-300 uppercase tracking-widest">
          <Zap className="h-4 w-4 text-teal-400" />
          SIMULATION LAB READY · ZERO SIGNUP REQUIRED
        </div>

        <h2 className="font-serif text-4xl sm:text-6xl font-normal text-[#F5F5F2] tracking-tight leading-tight max-w-3xl mx-auto">
          Ready to test your Product Sense?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#8A8F98] leading-relaxed font-normal">
          Enter the simulation. Uncover your cognitive blindspots, and see measurable improvement today.
        </p>

        <div className="mt-10">
          <button
            onClick={onStart}
            className="btn-primary text-base px-10 py-5 group shadow-[0_0_40px_rgba(25,211,197,0.5)]"
            data-cursor="explore"
          >
            <span>Begin Practice Simulation</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-2" />
          </button>
        </div>
      </section>
    </div>
  );
}
