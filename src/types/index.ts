// Core type definitions for the Interview Readiness prototype

export type Screen =
  | 'landing'
  | 'setup'
  | 'interview'
  | 'debrief'
  | 'practice'
  | 'reattempt-interview'
  | 'comparison';

export type ExperienceLevel = '0-1' | '1-2' | '2-3' | '3+';

export type Domain = 'fintech' | 'marketplace' | 'saas' | 'consumer' | 'general';

export type AttemptNumber = 1 | 2;

// ─── Competency Model ───

export type CompetencyId =
  | 'problem_framing'
  | 'user_understanding'
  | 'prioritization_tradeoffs'
  | 'metrics_measurement';

export interface Competency {
  id: CompetencyId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
}

export type Rating = 1 | 2 | 3 | 4;

export interface RubricLevel {
  rating: Rating;
  label: string;
  description: string;
}

export interface CompetencyRubric {
  competency: CompetencyId;
  levels: RubricLevel[];
}

// ─── Interview Cases ───

export interface CasePrompt {
  id: string;
  title: string;
  prompt: string;
  domain: Domain;
  difficulty: string;
  competencies: CompetencyId[];
}

// ─── Interview State Machine ───

export type InterviewState =
  | 'INTERVIEW_STARTED'
  | 'PROMPT_PRESENTED'
  | 'RESPONSE_RECEIVED'
  | 'RESPONSE_CLASSIFIED'
  | 'FOLLOW_UP_REQUIRED'
  | 'EVIDENCE_SUFFICIENT'
  | 'FOLLOW_UP_RECEIVED'
  | 'COMPETENCY_COMPLETE'
  | 'NEXT_COMPETENCY'
  | 'EVALUATION_READY'
  | 'FEEDBACK_PRESENTED';

export type ResponseClassification =
  | 'ANSWER_COMPLETE'
  | 'ANSWER_PARTIAL'
  | 'MISSING_STRUCTURE'
  | 'MISSING_EVIDENCE'
  | 'PREMATURE_SOLUTION'
  | 'UNSUPPORTED_ASSUMPTION'
  | 'NEEDS_DEPTH'
  | 'STRONG_RESPONSE'
  | 'UNCLEAR_RESPONSE';

// ─── Evidence ───

export interface EvidenceItem {
  evidenceId: string;
  responseId: string;
  competency: CompetencyId;
  sourceText: string;
  observedBehavior: string;
  impact: string;
  confidence: number;
  flagged?: boolean;
}

// ─── Messages ───

export type MessageRole = 'interviewer' | 'candidate';

export interface InterviewMessage {
  id: string;
  role: MessageRole;
  text: string;
  competencyId?: CompetencyId;
  isFollowUp?: boolean;
  followUpPurpose?: string;
  timestamp: number;
}

// ─── Responses ───

export interface CandidateResponse {
  responseId: string;
  attemptId: string;
  competencyId: CompetencyId;
  text: string;
  sequenceNumber: number;
  classification: ResponseClassification;
  createdAt: number;
}

// ─── Follow-up ───

export interface FollowUp {
  targetCompetency: CompetencyId;
  missingEvidence: string[];
  purpose: string;
  question: string;
  stopCondition: string;
}

// ─── Assessment ───

export interface CompetencyAssessment {
  competencyId: CompetencyId;
  rating: Rating;
  evidenceIds: string[];
  evidenceCoverage: number;
  confidence: number;
  recommendation: string;
}

// ─── Feedback ───

export interface FeedbackItem {
  id: string;
  type: 'strength' | 'gap';
  observation: string;
  whyItMattered: string;
  whatShouldChange: string;
  competencyId: CompetencyId;
  evidenceIds: string[];
}

export interface PracticeExercise {
  targetGap: string;
  exercisePrompt: string;
  framework: string[];
  frameworkLabel: string;
  successCondition: string;
  evaluationCriteria: string[];
}

// ─── Attempt ───

export interface Attempt {
  attemptId: string;
  attemptNumber: AttemptNumber;
  caseId: string;
  rubricVersion: string;
  modelVersion: string;
  status: 'in_progress' | 'completed';
  startedAt: number;
  completedAt: number | null;
  messages: InterviewMessage[];
  responses: CandidateResponse[];
  evidence: EvidenceItem[];
  assessments: CompetencyAssessment[];
  feedback: FeedbackItem[];
  practiceExercise: PracticeExercise | null;
  practiceResponse: string | null;
  overallRating: Rating | null;
}

// ─── Comparison ───

export interface CompetencyDelta {
  competencyId: CompetencyId;
  rating1: Rating;
  rating2: Rating;
  delta: number;
}

export interface BehavioralChange {
  competencyId: CompetencyId;
  description: string;
  improved: boolean;
}

export interface AttemptComparison {
  competencyDeltas: CompetencyDelta[];
  behavioralChanges: BehavioralChange[];
  overallDelta: number;
  addressedPracticeGoal: boolean;
  summary: string;
}

// ─── Setup ───

export interface SetupData {
  experienceLevel: ExperienceLevel;
  domain: Domain;
}

// ─── Events (analytics) ───

export type EventType =
  | 'landing_viewed'
  | 'start_clicked'
  | 'setup_completed'
  | 'interview_started'
  | 'interview_completed'
  | 'feedback_viewed'
  | 'insight_confirmed'
  | 'practice_started'
  | 'practice_completed'
  | 'reattempt_started'
  | 'reattempt_completed'
  | 'feedback_flagged';

export interface AnalyticsEvent {
  type: EventType;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// ─── Full Session ───

export interface SessionState {
  setup: SetupData | null;
  attempt1: Attempt | null;
  attempt2: Attempt | null;
  comparison: AttemptComparison | null;
  insightText: string | null;
  events: AnalyticsEvent[];
}
