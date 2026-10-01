import type { Rating, CompetencyId } from '@/types';
import { RATING_LABELS, RATING_COLORS, RATING_BAR_COLORS, getCompetency, getRubricLevel } from '@/data/rubric';
import { CompetencyIcon } from '@/components/CompetencyIcon';

export function RatingBadge({ rating, size = 'md' }: { rating: Rating; size?: 'sm' | 'md' }) {
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
  };
  return (
    <span className={`badge border ${RATING_COLORS[rating]} ${sizes[size]} font-mono font-medium backdrop-blur-xs`}>
      {rating} — {RATING_LABELS[rating]}
    </span>
  );
}

export function CompetencyBar({
  competencyId,
  rating,
  showLabel = true,
}: {
  competencyId: CompetencyId;
  rating: Rating;
  showLabel?: boolean;
}) {
  const comp = getCompetency(competencyId);

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CompetencyIcon name={comp.icon} className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-medium text-zinc-200">{comp.name}</span>
          </div>
          <RatingBadge rating={rating} size="sm" />
        </div>
      )}
      <div className="flex gap-1.5 p-1 rounded-lg bg-zinc-900/80 border border-white/[0.05]">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-md transition-all duration-300 ${
              level <= rating ? RATING_BAR_COLORS[rating] : 'bg-zinc-800/70'
            }`}
          />
        ))}
      </div>
      {showLabel && (
        <p className="text-xs text-zinc-400 font-normal leading-relaxed">{getRubricLevel(competencyId, rating).description}</p>
      )}
    </div>
  );
}

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = (current / total) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-zinc-800 border border-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 shadow-[0_0_10px_rgba(45,212,191,0.5)] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-mono font-medium text-zinc-400 tabular-nums">
        {current}/{total}
      </span>
    </div>
  );
}

export function EvidenceCard({
  sourceText,
  observedBehavior,
  impact,
  confidence,
  flagged,
  onFlag,
}: {
  sourceText: string;
  observedBehavior: string;
  impact: string;
  confidence: number;
  flagged?: boolean;
  onFlag?: () => void;
}) {
  const confidencePct = Math.round(confidence * 100);
  const confidenceLabel = confidencePct >= 85 ? 'High' : confidencePct >= 70 ? 'Medium' : 'Low';
  const confidenceColor =
    confidencePct >= 85
      ? 'text-teal-300 bg-teal-500/10 border border-teal-500/30'
      : confidencePct >= 70
      ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30'
      : 'text-rose-300 bg-rose-500/10 border border-rose-500/30';

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0E0E0E]/90 p-4 shadow-sm backdrop-blur-md">
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[10px] font-medium text-teal-300">
            {observedBehavior}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${confidenceColor} font-mono text-[10px]`}>Confidence: {confidenceLabel}</span>
          {onFlag && (
            <button
              onClick={onFlag}
              className={`text-xs font-medium transition-colors cursor-pointer ${
                flagged ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {flagged ? 'Flagged' : 'Flag'}
            </button>
          )}
        </div>
      </div>
      <blockquote className="mb-3 border-l-2 border-teal-500/60 pl-3 text-sm italic text-zinc-200 font-serif leading-relaxed">
        "{sourceText}"
      </blockquote>
      <div className="bg-white/[0.02] border-t border-white/[0.04] pt-2 mt-2">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">Impact Analysis</p>
        <p className="mt-1 text-xs text-zinc-300 leading-relaxed">{impact}</p>
      </div>
    </div>
  );
}
