import type { CompetencyId, Rating } from '@/types';

export const RATING_LABELS: Record<Rating, string> = {
  1: 'Emerging',
  2: 'Developing',
  3: 'Solid',
  4: 'Strong',
};

const COMPETENCY_NAMES: Record<CompetencyId, string> = {
  problem_framing: 'Problem Framing',
  user_understanding: 'User Understanding',
  prioritization_tradeoffs: 'Prioritization & Trade-offs',
  metrics_measurement: 'Metrics & Measurement',
};

export function getCompetityName(id: CompetencyId): string {
  return COMPETENCY_NAMES[id] || id;
}
