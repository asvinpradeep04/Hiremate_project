import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Target,
  TrendingDown,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Flag,
  PenLine,
  Zap,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { CompetencyBar, EvidenceCard } from '@/components/ui';
import { getCompetency, RATING_LABELS } from '@/data/rubric';
import type { Attempt, EvidenceItem, FeedbackItem, Rating } from '@/types';

interface DebriefProps {
  attempt: Attempt;
  onContinue: (insightText: string) => void;
  onExit: () => void;
}

export function Debrief({ attempt, onContinue, onExit }: DebriefProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [flaggedEvidence, setFlaggedEvidence] = useState<Set<string>>(new Set());
  const [insightText, setInsightText] = useState('');
  const [showInsightError, setShowInsightError] = useState(false);

  const strengths = attempt.feedback.filter((f) => f.type === 'strength');
  const gaps = attempt.feedback.filter((f) => f.type === 'gap');
  const overallRating = attempt.overallRating || 2;

  const [disputedFeedback, setDisputedFeedback] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFlag = (evidenceId: string) => {
    setFlaggedEvidence((prev) => {
      const next = new Set(prev);
      if (next.has(evidenceId)) next.delete(evidenceId);
      else next.add(evidenceId);
      return next;
    });
  };

  const handleDispute = async (feedbackId: string) => {
    setDisputedFeedback(prev => new Set(prev).add(feedbackId));
    try {
      await fetch(`/api/feedback/${feedbackId}/dispute`, { method: 'POST' });
    } catch (e) {
      console.warn('Dispute recording failed:', e);
    }
  };

  const handleContinue = async () => {
    if (insightText.trim().length < 10) {
      setShowInsightError(true);
      return;
    }

    try {
      await fetch(`/api/interviews/${attempt.attemptId}/insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ insightText: insightText.trim() }),
      });
    } catch (e) {
      console.warn('Insight persistence failed:', e);
    }

    onContinue(insightText.trim());
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] relative overflow-hidden">
      <Header
        onLogoClick={onExit}
        rightContent={
          <span className="badge bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Attempt {attempt.attemptNumber} Complete
          </span>
        }
      />

      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        {/* Header Section */}
        <div className="mb-10 animate-slide-up">
          <div className="section-label mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            AI REASONING AUDIT & EVALUATION
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
            Here's what the evidence shows.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Every assessment below is grounded in your actual spoken responses. Review the evidence, challenge any claim you disagree with, and isolate your target habit for practice.
          </p>
        </div>

        {/* Overall Readiness Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-6 sm:p-8 mb-8 shadow-2xl backdrop-blur-xl animate-slide-up relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none -z-0" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-teal-400">
                OVERALL READINESS CALIBRATION
              </p>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-serif text-5xl sm:text-6xl font-medium text-white tracking-tight">
                  {overallRating}
                </span>
                <span className="text-xl sm:text-2xl font-serif text-zinc-400 italic">
                  / 4 — {RATING_LABELS[overallRating as Rating]}
                </span>
              </div>
            </div>
            <div className="sm:text-right">
              <span className="font-mono text-[10px] text-zinc-500 block uppercase">SIMULATION CONTEXT</span>
              <p className="text-xs font-mono text-zinc-300 mt-0.5">{attempt.caseId}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-2.5 py-0.5 font-mono text-[10px] text-teal-300 border border-teal-500/25">
                <Zap className="h-3 w-3 text-teal-400" />
                Evidence-First Rubric v{attempt.rubricVersion || '1.0'}
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] p-3.5 relative z-10">
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              This reflects your performance in this simulation. It is not a generic hiring score, but a snapshot of your reasoning under real interview constraints.
            </p>
          </div>
        </div>

        {/* Competency Breakdown Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-6 sm:p-8 mb-8 shadow-2xl backdrop-blur-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-white tracking-wide">Competency Breakdown</h2>
            <span className="font-mono text-xs text-zinc-500">4 RUBRIC PILLARS</span>
          </div>

          <div className="space-y-6">
            {attempt.assessments.map((assessment) => {
              return (
                <div key={assessment.competencyId} className="space-y-2">
                  <CompetencyBar
                    competencyId={assessment.competencyId}
                    rating={assessment.rating}
                  />
                  <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 pt-1">
                    <span>
                      Evidence coverage: <strong className="text-teal-300">{Math.round(assessment.evidenceCoverage * 100)}%</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Confidence: <strong className="text-zinc-200">{Math.round(assessment.confidence * 100)}%</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '180ms' }}>
            <h2 className="mb-4 flex items-center gap-2.5 text-sm font-bold text-white tracking-wide">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              What you executed with conviction
            </h2>
            <div className="space-y-3.5">
              {strengths.map((strength) => (
                <FeedbackCard
                  key={strength.id}
                  item={strength}
                  evidence={attempt.evidence}
                  expanded={expandedCards.has(strength.id)}
                  onToggle={() => toggleCard(strength.id)}
                  flaggedEvidence={flaggedEvidence}
                  onFlagEvidence={toggleFlag}
                  isDisputed={disputedFeedback.has(strength.id)}
                  onDispute={handleDispute}
                  variant="strength"
                />
              ))}
            </div>
          </div>
        )}

        {/* Gaps */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '240ms' }}>
          <h2 className="mb-4 flex items-center gap-2.5 text-sm font-bold text-white tracking-wide">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Top {gaps.length} behavioral {gaps.length === 1 ? 'gap' : 'gaps'} to isolate & rewire
          </h2>
          <div className="space-y-3.5">
            {gaps.map((gap) => (
              <FeedbackCard
                key={gap.id}
                item={gap}
                evidence={attempt.evidence}
                expanded={expandedCards.has(gap.id)}
                onToggle={() => toggleCard(gap.id)}
                flaggedEvidence={flaggedEvidence}
                onFlagEvidence={toggleFlag}
                isDisputed={disputedFeedback.has(gap.id)}
                onDispute={handleDispute}
                variant="gap"
              />
            ))}
          </div>
        </div>

        {/* Practice Recommendation */}
        {attempt.practiceExercise && (
          <div className="rounded-3xl border border-teal-500/40 bg-gradient-to-b from-[#0F1414] to-[#0A0A0A] p-6 sm:p-8 mb-8 shadow-2xl animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <Target className="h-6 w-6 text-teal-300" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="section-label">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                  PRIORITIZED PRACTICE RECOMMENDATION
                </div>
                <h3 className="text-lg font-bold text-white">
                  {attempt.practiceExercise.targetGap}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {attempt.practiceExercise.exercisePrompt}
                </p>

                <div className="rounded-2xl bg-[#070707] p-4 border border-teal-500/30">
                  <span className="font-mono text-[10px] uppercase font-bold text-teal-300 block mb-1">
                    Framework to execute:
                  </span>
                  <p className="font-mono text-xs text-zinc-200">
                    {attempt.practiceExercise.frameworkLabel}
                  </p>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-zinc-400">Success condition:</span>
                    <p className="text-xs text-zinc-300 leading-relaxed mt-0.5">
                      {attempt.practiceExercise.successCondition}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insight Confirmation */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-6 sm:p-8 mb-8 shadow-2xl animate-slide-up" style={{ animationDelay: '360ms' }}>
          <div className="flex items-start gap-3.5">
            <PenLine className="mt-1 h-5 w-5 shrink-0 text-teal-400" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">
                What is the main behavior you will change in your next interview?
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Articulating this confirms you have isolated a concrete, actionable habit.
              </p>
              <textarea
                value={insightText}
                onChange={(e) => {
                  setInsightText(e.target.value);
                  if (showInsightError) setShowInsightError(false);
                }}
                placeholder="e.g., I will define the target user segment and their pain points before proposing any feature ideas..."
                rows={3}
                className="w-full mt-3 rounded-xl border border-white/10 bg-[#050505] p-3 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 font-sans leading-relaxed resize-none"
              />
              {showInsightError && (
                <p className="mt-2 text-xs font-mono text-rose-400">
                  Please write at least one sentence describing what you'll change.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="btn-primary w-full text-base py-4 shadow-[0_0_25px_rgba(45,212,191,0.5)]"
          data-cursor="explore"
        >
          <span>Continue to Targeted Practice</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

interface FeedbackCardProps {
  item: FeedbackItem;
  evidence: EvidenceItem[];
  expanded: boolean;
  onToggle: () => void;
  flaggedEvidence: Set<string>;
  onFlagEvidence: (id: string) => void;
  isDisputed: boolean;
  onDispute: (id: string) => void;
  variant: 'strength' | 'gap';
}

function FeedbackCard({
  item,
  evidence,
  expanded,
  onToggle,
  flaggedEvidence,
  onFlagEvidence,
  isDisputed,
  onDispute,
  variant,
}: FeedbackCardProps) {
  const itemEvidence = evidence.filter((e) => item.evidenceIds?.includes(e.evidenceId));
  const comp = getCompetency(item.competencyId);

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        variant === 'gap'
          ? 'border-amber-500/30 bg-[#0E0E0E]'
          : 'border-emerald-500/30 bg-[#0E0E0E]'
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-start gap-3.5 p-5 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            variant === 'gap'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
          }`}
        >
          {variant === 'gap' ? (
            <TrendingDown className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-400">{comp.name}</span>
            {isDisputed && (
              <span className="badge bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono text-[9px]">
                Dispute Saved
              </span>
            )}
          </div>
          <p className="mt-1 text-sm font-semibold text-white">{item.observation}</p>
          <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{item.whyItMattered}</p>
        </div>
        {expanded ? (
          <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
        ) : (
          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-white/[0.06] bg-black/40 px-5 py-5 animate-fade-in space-y-4">
          {/* Evidence */}
          {itemEvidence.length > 0 && (
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase font-bold text-teal-400">
                Supporting Spoken Evidence
              </p>
              <div className="space-y-3">
                {itemEvidence.map((ev) => (
                  <EvidenceCard
                    key={ev.evidenceId}
                    sourceText={ev.sourceText}
                    observedBehavior={ev.observedBehavior}
                    impact={ev.impact}
                    confidence={ev.confidence}
                    flagged={flaggedEvidence.has(ev.evidenceId)}
                    onFlag={() => onFlagEvidence(ev.evidenceId)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* What should change */}
          <div className="rounded-xl border border-teal-500/30 bg-teal-950/20 p-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-teal-300 block mb-1">
              Rewiring Recommendation:
            </span>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">{item.whatShouldChange}</p>
          </div>

          {/* Flag / Dispute Button */}
          {isDisputed ? (
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              You disputed this feedback (persisted to backend).
            </div>
          ) : (
            <button
              onClick={() => onDispute(item.id)}
              className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Flag className="h-3.5 w-3.5" />
              This feedback does not reflect my answer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
