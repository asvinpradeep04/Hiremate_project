import { useState } from 'react';
import {
  ArrowRight,
  Target,
  Sparkles,
  ClipboardCheck,
  Lightbulb,
  Dumbbell,
  Repeat,
  TrendingUp,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Layers,
  Activity,
  Mic,
  BarChart2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { COMPETENCIES } from '@/data/rubric';
import { CompetencyIcon } from '@/components/CompetencyIcon';

interface LandingProps {
  onStart: () => void;
}

const PRACTICE_LOOP_STEPS = [
  {
    step: '01',
    label: 'Interview',
    desc: 'Voice or text case simulation with realistic adaptive pressure.',
    icon: Mic,
  },
  {
    step: '02',
    label: 'Evidence',
    desc: 'Extracts exact spoken quotes and timestamps without hallucination.',
    icon: FileText,
  },
  {
    step: '03',
    label: 'Diagnosis',
    desc: 'Pinpoints specific cognitive gaps like premature solutioning.',
    icon: Lightbulb,
  },
  {
    step: '04',
    label: 'Targeted Practice',
    desc: 'Interactive micro-drills to rewire the single weakest habit.',
    icon: Dumbbell,
  },
  {
    step: '05',
    label: 'Second Attempt',
    desc: 'Re-test on a comparable case to validate behavioral shift.',
    icon: Repeat,
  },
  {
    step: '06',
    label: 'Measured Shift',
    desc: 'Side-by-side delta proving permanent interview mastery.',
    icon: TrendingUp,
  },
];

const DIFFERENCE_CARDS = [
  {
    number: '01',
    title: 'Evidence-linked feedback',
    tagline: 'Grounded in your exact spoken quotes',
    description:
      'Unlike generic chatbots that output generic bullet points, the system cites your precise phrases, highlights premature leaps, and explains the impact on the interviewer.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Behavior-level diagnosis',
    tagline: 'Cognitive habits over trivia',
    description:
      'We diagnose how you reason under ambiguity: did you explore customer segments before features? Did you weigh trade-offs before choosing your North Star?',
    icon: Activity,
  },
  {
    number: '03',
    title: 'Comparable second attempt',
    tagline: 'Proof of real behavioral change',
    description:
      'Practice one isolated weakness, then immediately re-enter the simulator on an isomorphic business problem to measure your before-and-after improvement.',
    icon: Repeat,
  },
];

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-ambient-light">
      <Header />

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-5xl px-6 text-center">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-300/60 bg-white/80 px-4 py-1.5 shadow-xs backdrop-blur-md animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary-800">
              PRODUCT SENSE • AI INTERVIEW SIMULATION
            </span>
          </div>

          {/* Cinematic Editorial Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl sm:leading-[1.12] font-medium tracking-tight text-ink-900 animate-slide-up">
            Practice a realistic PM interview.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-teal-600 to-primary-700 italic font-normal">
              Discover what holds you back.
            </span>
            <br />
            Prove improvement in a second attempt.
          </h1>

          {/* Narrower Refined Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-ink-600 font-normal animate-slide-up" style={{ animationDelay: '100ms' }}>
            Complete a structured Product Sense interview, receive evidence-linked feedback on specific behaviors, practice one targeted weakness, and see measurable change in a comparable second attempt.
          </p>

          {/* CTA & Micro-copy */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center gap-3 animate-slide-up" style={{ animationDelay: '180ms' }}>
            <button
              onClick={onStart}
              className="btn-primary text-base px-8 py-4 group cursor-pointer"
            >
              <span>Start Product Sense Interview</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <p className="text-xs font-medium text-ink-400">
              No signup required · 15–20 minutes per attempt · Real-time voice & AI evaluation
            </p>
          </div>

          {/* ─── Hero Visual: Floating Interview Intelligence Cards ─── */}
          <div className="mt-16 sm:mt-20 relative mx-auto max-w-3xl">
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary-200/40 via-teal-100/30 to-amber-100/20 blur-3xl rounded-3xl opacity-70 transform -translate-y-4" />

            {/* Main Central Simulator Card */}
            <div className="relative rounded-2xl border border-ink-200/80 bg-white/95 p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)] backdrop-blur-md text-left">
              {/* Card Header bar */}
              <div className="flex items-center justify-between border-b border-ink-100 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="flex h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="flex h-3 w-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                    INTERVIEW INTELLIGENCE LAB
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold text-primary-700 border border-primary-200/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
                  LIVE RECORDING
                </div>
              </div>

              {/* Case Prompt */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-primary-700">
                  PRODUCT SENSE CASE
                </div>
                <p className="font-serif text-lg sm:text-xl text-ink-900 leading-snug font-medium">
                  "You are a PM at Spotify. 30-day listening retention dropped from 45% to 31%. How do you diagnose the root cause and frame this problem?"
                </p>
              </div>

              {/* Competency Trackers */}
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-ink-100 pt-4">
                <div className="rounded-lg bg-ink-50/80 p-2.5">
                  <div className="text-[10px] font-semibold text-ink-400 uppercase">Clarification</div>
                  <div className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Solid
                  </div>
                </div>
                <div className="rounded-lg bg-ink-50/80 p-2.5">
                  <div className="text-[10px] font-semibold text-ink-400 uppercase">User Persona</div>
                  <div className="text-xs font-bold text-amber-700 mt-0.5 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> Gap Detected
                  </div>
                </div>
                <div className="rounded-lg bg-ink-50/80 p-2.5">
                  <div className="text-[10px] font-semibold text-ink-400 uppercase">Prioritization</div>
                  <div className="text-xs font-bold text-ink-600 mt-0.5">Pending Probe</div>
                </div>
              </div>

              {/* Behavioral Signal Progress Bar */}
              <div className="mt-5 rounded-xl border border-primary-100 bg-primary-50/40 p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary-600" />
                  <span className="text-xs font-bold text-ink-800">Behavioral Signal Strength:</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 sm:w-44 h-2 rounded-full bg-primary-200/60 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-teal-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                  <span className="font-mono text-xs font-bold text-primary-800">78%</span>
                </div>
              </div>
            </div>

            {/* Layered Floating Card 1: Top Right Evidence Snippet */}
            <div className="hidden sm:block absolute -top-8 -right-8 w-72 rounded-xl border border-amber-200 bg-white/95 p-3.5 shadow-lg backdrop-blur-md animate-float-slow text-left">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1">
                <span>EVIDENCE EXTRACTION</span>
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-900 font-mono">00:42</span>
              </div>
              <p className="text-xs font-medium text-ink-700 italic leading-snug">
                "You proposed a social listening leaderboard before establishing the primary churned user segment."
              </p>
            </div>

            {/* Layered Floating Card 2: Bottom Left Improvement Badge */}
            <div className="hidden sm:flex absolute -bottom-6 -left-8 items-center gap-3 rounded-xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md animate-float-reverse text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">MEASURABLE REATTEMPT</div>
                <div className="text-xs font-bold text-ink-900">+32% Structured Problem Framing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── The Practice Loop ─── */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-ink-200/50">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="section-label">THE PRACTICE LOOP</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-ink-900">
            A closed-loop system, not a question bank.
          </h2>
          <p className="mt-3 text-sm text-ink-500">
            Most prep tools give you 500 questions. We give you a clinical loop to isolate weaknesses, practice the exact behavior, and prove real improvement.
          </p>
        </div>

        {/* Connected Visual Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 relative">
          {PRACTICE_LOOP_STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="group relative rounded-2xl border border-ink-200/70 bg-white p-5 shadow-xs hover:border-primary-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-primary-700">{s.step}</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-700 group-hover:scale-110 transition-transform">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-ink-900">{s.label}</h3>
                  <p className="mt-1.5 text-xs text-ink-500 leading-relaxed">{s.desc}</p>
                </div>
                {idx < 5 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="h-4 w-4 text-ink-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Why This Is Different ─── */}
      <section className="py-20 bg-white/70 border-y border-ink-200/60 backdrop-blur-xs">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-2xl">
            <p className="section-label">DIAGNOSTIC RIGOR</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-ink-900">
              Not another AI interview score.
            </h2>
            <p className="mt-3 text-base text-ink-500 leading-relaxed">
              The goal isn't to tell you that you scored 72%. It's to show you what happened in the interview — and what to change.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {DIFFERENCE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.number}
                  className="rounded-2xl border border-ink-200/80 bg-gradient-to-b from-white to-ink-50/30 p-7 shadow-xs hover:border-primary-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-3xl font-light text-ink-300 tracking-tight">
                        {card.number}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-ink-900">{card.title}</h3>
                    <div className="text-xs font-semibold text-primary-700 mt-1 mb-3">
                      {card.tagline}
                    </div>
                    <p className="text-xs text-ink-600 leading-relaxed">{card.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Interview Intelligence Editorial Split ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <p className="section-label">BEHAVIORAL EXTRACTION</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-ink-900 leading-tight">
              Your interview is more than an answer.
            </h2>
            <p className="mt-4 text-base text-ink-600 leading-relaxed">
              Top hiring managers at Stripe, Google, and Meta don't evaluate whether you memorized a framework. They listen for how you handle ambiguity:
            </p>
            <ul className="mt-6 space-y-3.5 text-sm text-ink-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                <span><strong>Problem Framing before Ideation:</strong> Do you establish constraints before throwing out solutions?</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                <span><strong>User Empathy & Friction:</strong> Can you articulate the emotional state and behavior of the target persona?</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                <span><strong>Explicit Trade-offs:</strong> Do you name the counter-metrics and disadvantages of your selected path?</span>
              </li>
            </ul>
          </div>

          {/* Right Mockup */}
          <div className="rounded-2xl border border-ink-200/90 bg-white p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-700">
                COMPETENCY SIGNAL EXTRACTION
              </span>
              <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold border border-emerald-200">
                ATTEMPT 1 REPORT
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-ink-50/70 p-3">
                <span className="text-xs font-bold text-ink-800">CLARIFICATION & SCOPE</span>
                <span className="badge bg-emerald-100 text-emerald-800">Strong</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-amber-50/70 p-3 border border-amber-200/60">
                <div>
                  <span className="text-xs font-bold text-amber-900 block">STRUCTURING & PROBLEM DEFINITION</span>
                  <span className="text-[11px] text-amber-700">Jumped to feature proposal in minute 1</span>
                </div>
                <span className="badge bg-amber-200 text-amber-900 font-bold shrink-0">Needs Work</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-ink-50/70 p-3">
                <span className="text-xs font-bold text-ink-800">USER UNDERSTANDING</span>
                <span className="badge bg-emerald-100 text-emerald-800">Strong</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-ink-50/70 p-3">
                <span className="text-xs font-bold text-ink-800">PRIORITIZATION & TRADE-OFFS</span>
                <span className="badge bg-amber-100 text-amber-800">Needs Practice</span>
              </div>
            </div>

            {/* Evidence Callout */}
            <div className="rounded-xl border border-primary-200/80 bg-primary-50/50 p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-primary-800 mb-1">
                EXACT EVIDENCE QUOTE
              </div>
              <p className="font-serif text-sm text-ink-800 italic">
                "You moved to solutions before establishing the primary user segment."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom Call to Action ─── */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center border-t border-ink-200/60">
        <h2 className="font-serif text-3xl sm:text-4xl font-medium text-ink-900">
          Ready to test your Product Sense?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-500">
          Experience realistic interview pressure, uncover your cognitive blindspots, and see measurable improvement today.
        </p>
        <button
          onClick={onStart}
          className="btn-primary text-base px-9 py-4 mt-8 group cursor-pointer"
        >
          <span>Begin Practice Simulation</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </section>
    </div>
  );
}
