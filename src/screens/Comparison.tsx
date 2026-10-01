import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  Minus,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Repeat,
  Home,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { CompetencyIcon } from '@/components/CompetencyIcon';
import { RatingBadge } from '@/components/ui';
import { COMPETENCIES, getCompetencyName, RATING_LABELS } from '@/data/rubric';
import type { Attempt, AttemptComparison, CompetencyDelta, Rating } from '@/types';

interface ComparisonProps {
  attempt1: Attempt;
  attempt2: Attempt;
  comparison: AttemptComparison;
  onRestart: () => void;
  onExit: () => void;
}

export function Comparison({
  attempt1,
  attempt2,
  comparison,
  onRestart,
  onExit,
}: ComparisonProps) {
  const overall1 = attempt1.overallRating || 2;
  const overall2 = attempt2.overallRating || 2;

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] relative overflow-hidden">
      <Header
        onLogoClick={onExit}
        rightContent={
          <span className="badge bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Both Attempts Complete
          </span>
        }
      />

      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        {/* Header Section */}
        <div className="mb-10 animate-slide-up">
          <div className="section-label mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            ATTEMPT 1 vs ATTEMPT 2 • TELEMETRY AUDIT
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
            SEE WHAT CHANGED.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
            {comparison.summary}
          </p>
        </div>

        {/* Practice Goal Met/Unmet Card */}
        <div
          className={`rounded-3xl border p-6 mb-8 shadow-2xl backdrop-blur-xl animate-slide-up ${
            comparison.addressedPracticeGoal
              ? 'border-emerald-500/40 bg-emerald-950/20'
              : 'border-amber-500/40 bg-amber-950/20'
          }`}
          style={{ animationDelay: '60ms' }}
        >
          <div className="flex items-start gap-4">
            {comparison.addressedPracticeGoal ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <AlertCircle className="h-5 w-5" />
              </div>
            )}
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-teal-400">
                PRACTICE GOAL VERIFICATION
              </span>
              <h3 className="mt-1 text-base font-bold text-white">
                {attempt1.practiceExercise?.targetGap}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {comparison.addressedPracticeGoal
                  ? 'You successfully addressed the targeted behavior in your second attempt. Spoken evidence demonstrates clearer structure and disciplined problem framing.'
                  : 'The second attempt did not fully address the practice goal. Cognitive habit changes often require multiple iterative practice cycles.'}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Score Delta Hero Visualization */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-6 sm:p-8 mb-8 shadow-2xl backdrop-blur-xl animate-slide-up relative overflow-hidden" style={{ animationDelay: '120ms' }}>
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-32 bg-teal-500/10 blur-[70px] rounded-full pointer-events-none -z-0" />

          <p className="font-mono text-xs uppercase tracking-widest text-teal-400 mb-6 text-center">
            OVERALL READINESS DELTA
          </p>

          <div className="flex items-center justify-center gap-8 sm:gap-16 relative z-10">
            <ScoreColumn
              label="Attempt 1"
              rating={overall1 as Rating}
              caseTitle={attempt1.caseId}
            />

            <div className="flex flex-col items-center">
              <DeltaArrow delta={comparison.overallDelta} />
              <span
                className={`mt-3 font-mono text-sm sm:text-base font-bold ${
                  comparison.overallDelta > 0
                    ? 'text-emerald-400 shadow-[0_0_10px_#34d399]'
                    : comparison.overallDelta < 0
                    ? 'text-rose-400'
                    : 'text-zinc-500'
                }`}
              >
                {comparison.overallDelta > 0
                  ? `+${comparison.overallDelta.toFixed(1)} Overall`
                  : `${comparison.overallDelta.toFixed(1)} Overall`}
              </span>
            </div>

            <ScoreColumn
              label="Attempt 2"
              rating={overall2 as Rating}
              caseTitle={attempt2.caseId}
            />
          </div>
        </div>

        {/* Competency Deltas */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-6 sm:p-8 mb-8 shadow-2xl backdrop-blur-xl animate-slide-up" style={{ animationDelay: '180ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-white tracking-wide">Competency Changes</h2>
            <span className="font-mono text-xs text-zinc-500">RUBRIC DELTA</span>
          </div>
          <div className="space-y-4">
            {comparison.competencyDeltas.map((delta) => (
              <CompetencyDeltaRow key={delta.competencyId} delta={delta} />
            ))}
          </div>
        </div>

        {/* Behavioral Observations */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-6 sm:p-8 mb-8 shadow-2xl backdrop-blur-xl animate-slide-up" style={{ animationDelay: '240ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2.5 text-base font-bold text-white tracking-wide">
              <TrendingUp className="h-4 w-4 text-teal-400" />
              Behavioral Observations
            </h2>
            <span className="font-mono text-xs text-teal-400">QUALITATIVE SHIFT</span>
          </div>
          <div className="space-y-3.5">
            {comparison.behavioralChanges.map((change, i) => (
              <div
                key={i}
                className={`rounded-2xl p-5 border transition-all ${
                  change.improved
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-[#0E0E0E] border-white/[0.07]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {change.improved ? (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                      <ArrowUp className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-zinc-500">
                      <Minus className="h-4 w-4" />
                    </div>
                  )}
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-teal-400">
                      {getCompetencyName(change.competencyId)}
                    </span>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">{change.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="mb-10 rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4.5 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <p className="font-mono text-[11px] leading-relaxed text-zinc-500">
            <strong className="text-zinc-300">Important:</strong> This comparison reflects observed improvement between two simulation rounds. It measures cognitive alignment with standard PM interview rubrics and provides verifiable behavioral telemetry.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{ animationDelay: '360ms' }}>
          <button
            onClick={onRestart}
            className="btn-primary w-full sm:flex-1 text-base py-4 shadow-[0_0_30px_rgba(45,212,191,0.5)] cursor-pointer"
            data-cursor="explore"
          >
            <Repeat className="h-5 w-5" />
            <span>Start a New Practice Cycle</span>
          </button>
          <button
            onClick={onExit}
            className="btn-secondary w-full sm:w-auto py-4 px-8 text-xs font-mono cursor-pointer"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreColumn({
  label,
  rating,
  caseTitle,
}: {
  label: string;
  rating: Rating;
  caseTitle: string;
}) {
  return (
    <div className="text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">{label}</p>
      <div className="mt-3 flex items-baseline justify-center gap-1">
        <span className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">{rating}</span>
        <span className="font-serif text-xl sm:text-2xl text-zinc-500 italic">/4</span>
      </div>
      <p className="mt-1 font-mono text-xs font-semibold text-teal-300">{RATING_LABELS[rating]}</p>
    </div>
  );
}

function DeltaArrow({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.5)]">
        <ArrowUp className="h-7 w-7" />
      </div>
    );
  } else if (delta < 0) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
        <ArrowDown className="h-7 w-7" />
      </div>
    );
  }
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-zinc-500">
      <Minus className="h-7 w-7" />
    </div>
  );
}

function CompetencyDeltaRow({ delta }: { delta: CompetencyDelta }) {
  const comp = COMPETENCIES.find((c) => c.id === delta.competencyId)!;
  const improved = delta.delta > 0;
  const declined = delta.delta < 0;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0E0E0E] p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20">
          <CompetencyIcon name={comp.icon} className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{comp.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <RatingBadge rating={delta.rating1} size="sm" />
            <span className="text-zinc-600 font-mono">→</span>
            <RatingBadge rating={delta.rating2} size="sm" />
          </div>
        </div>
      </div>

      <div
        className={`inline-flex items-center self-start sm:self-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-bold border ${
          improved
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
            : declined
            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            : 'bg-white/5 text-zinc-400 border-white/10'
        }`}
      >
        {improved && <ArrowUp className="h-3.5 w-3.5" />}
        {declined && <ArrowDown className="h-3.5 w-3.5" />}
        {!improved && !declined && <Minus className="h-3.5 w-3.5" />}
        {delta.delta > 0 ? `+${delta.delta.toFixed(1)}` : delta.delta.toFixed(1)}
      </div>
    </div>
  );
}
