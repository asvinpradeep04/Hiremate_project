import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { config } from './config';

// Ensure data folder exists
const dataDir = path.resolve(process.cwd(), '.data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'interview.db');
export const db = new DatabaseSync(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    experience_level TEXT NOT NULL DEFAULT '0-1',
    domain TEXT NOT NULL DEFAULT 'general',
    status TEXT NOT NULL DEFAULT 'active',
    current_screen TEXT NOT NULL DEFAULT 'landing',
    attempt1_id TEXT,
    attempt2_id TEXT,
    insight_text TEXT,
    insight_confirmed INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    case_id TEXT NOT NULL,
    case_title TEXT NOT NULL,
    case_prompt TEXT NOT NULL,
    domain TEXT NOT NULL DEFAULT 'general',
    status TEXT NOT NULL DEFAULT 'in_progress',
    current_competency_index INTEGER NOT NULL DEFAULT 0,
    follow_up_count INTEGER NOT NULL DEFAULT 0,
    total_follow_ups INTEGER NOT NULL DEFAULT 0,
    overall_rating INTEGER NOT NULL DEFAULT 1,
    rubric_version TEXT NOT NULL,
    model_version TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    case_version TEXT NOT NULL,
    started_at INTEGER NOT NULL,
    completed_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS responses (
    id TEXT PRIMARY KEY,
    attempt_id TEXT NOT NULL,
    competency_id TEXT NOT NULL,
    text TEXT NOT NULL,
    sequence_number INTEGER NOT NULL DEFAULT 1,
    classification TEXT NOT NULL DEFAULT 'ANSWER_PARTIAL',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transcripts (
    id TEXT PRIMARY KEY,
    attempt_id TEXT NOT NULL,
    speaker TEXT NOT NULL,
    text TEXT NOT NULL,
    competency_id TEXT,
    response_id TEXT,
    is_follow_up INTEGER NOT NULL DEFAULT 0,
    follow_up_purpose TEXT,
    timestamp INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS evidence (
    id TEXT PRIMARY KEY,
    attempt_id TEXT NOT NULL,
    response_id TEXT NOT NULL,
    competency TEXT NOT NULL,
    source_text TEXT NOT NULL,
    observed_behavior TEXT NOT NULL,
    impact TEXT NOT NULL,
    confidence REAL NOT NULL DEFAULT 0.8,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS competency_assessments (
    id TEXT PRIMARY KEY,
    attempt_id TEXT NOT NULL,
    competency_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    evidence_ids TEXT NOT NULL, -- JSON array
    evidence_coverage REAL NOT NULL DEFAULT 0.5,
    confidence REAL NOT NULL DEFAULT 0.8,
    recommendation TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS feedback_items (
    id TEXT PRIMARY KEY,
    attempt_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'strength' | 'gap'
    observation TEXT NOT NULL,
    why_it_mattered TEXT NOT NULL,
    what_should_change TEXT NOT NULL,
    competency_id TEXT NOT NULL,
    evidence_ids TEXT NOT NULL, -- JSON array
    disputed INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS practice_exercises (
    id TEXT PRIMARY KEY,
    attempt_id TEXT NOT NULL,
    target_gap TEXT NOT NULL,
    exercise_prompt TEXT NOT NULL,
    framework TEXT NOT NULL, -- JSON array
    framework_label TEXT NOT NULL,
    success_condition TEXT NOT NULL,
    evaluation_criteria TEXT NOT NULL, -- JSON array
    expected_behavior TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS practice_responses (
    id TEXT PRIMARY KEY,
    attempt_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    text TEXT NOT NULL,
    met INTEGER NOT NULL DEFAULT 0,
    met_criteria TEXT NOT NULL, -- JSON array
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attempt_comparisons (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    attempt1_id TEXT NOT NULL,
    attempt2_id TEXT NOT NULL,
    competency_deltas TEXT NOT NULL, -- JSON array
    behavioral_changes TEXT NOT NULL, -- JSON array
    overall_delta REAL NOT NULL,
    addressed_practice_goal INTEGER NOT NULL DEFAULT 0,
    summary TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    session_id TEXT,
    event_type TEXT NOT NULL,
    metadata TEXT, -- JSON object
    created_at INTEGER NOT NULL
  );
`);

// ─── Helpers ───

export function createSession(experienceLevel = '0-1', domain = 'general'): any {
  const id = crypto.randomUUID();
  const now = Date.now();
  db.prepare(`
    INSERT INTO sessions (id, experience_level, domain, status, current_screen, created_at, updated_at)
    VALUES (?, ?, ?, 'active', 'interview', ?, ?)
  `).run(id, experienceLevel, domain, now, now);
  return getSession(id);
}

export function getSession(id: string): any {
  const row: any = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
  if (!row) return null;
  return {
    ...row,
    insight_confirmed: Boolean(row.insight_confirmed),
  };
}

export function updateSession(id: string, updates: Record<string, any>) {
  const fields = Object.keys(updates);
  if (fields.length === 0) return;
  const setClauses = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => {
    const val = updates[f];
    if (typeof val === 'boolean') return val ? 1 : 0;
    if (typeof val === 'object' && val !== null) return JSON.stringify(val);
    return val;
  });
  db.prepare(`UPDATE sessions SET ${setClauses}, updated_at = ? WHERE id = ?`).run(...values, Date.now(), id);
}

export function createAttempt(data: {
  sessionId: string;
  attemptNumber: number;
  caseId: string;
  caseTitle: string;
  casePrompt: string;
  domain: string;
}): any {
  const id = crypto.randomUUID();
  const now = Date.now();
  db.prepare(`
    INSERT INTO attempts (
      id, session_id, attempt_number, case_id, case_title, case_prompt, domain,
      status, current_competency_index, follow_up_count, total_follow_ups,
      overall_rating, rubric_version, model_version, prompt_version, case_version,
      started_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'in_progress', 0, 0, 0, 1, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.sessionId,
    data.attemptNumber,
    data.caseId,
    data.caseTitle,
    data.casePrompt,
    data.domain,
    config.rubricVersion,
    config.evaluationModel,
    config.promptVersion,
    config.caseVersion,
    now
  );

  // Link attempt to session
  if (data.attemptNumber === 1) {
    updateSession(data.sessionId, { attempt1_id: id });
  } else {
    updateSession(data.sessionId, { attempt2_id: id });
  }

  return getAttempt(id);
}

export function getAttempt(id: string): any {
  const row: any = db.prepare('SELECT * FROM attempts WHERE id = ?').get(id);
  return row || null;
}

export function updateAttempt(id: string, updates: Record<string, any>) {
  const fields = Object.keys(updates);
  if (fields.length === 0) return;
  const setClauses = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => {
    const val = updates[f];
    if (typeof val === 'boolean') return val ? 1 : 0;
    return val;
  });
  db.prepare(`UPDATE attempts SET ${setClauses} WHERE id = ?`).run(...values, id);
}

export function addTranscript(data: {
  attemptId: string;
  speaker: 'interviewer' | 'candidate';
  text: string;
  competencyId?: string;
  responseId?: string;
  isFollowUp?: boolean;
  followUpPurpose?: string;
}): any {
  const id = crypto.randomUUID();
  const now = Date.now();
  db.prepare(`
    INSERT INTO transcripts (id, attempt_id, speaker, text, competency_id, response_id, is_follow_up, follow_up_purpose, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.attemptId || '',
    data.speaker || 'interviewer',
    data.text || '',
    data.competencyId || null,
    data.responseId || null,
    data.isFollowUp ? 1 : 0,
    data.followUpPurpose || null,
    now
  );
  return { id, ...data, text: data.text || '', timestamp: now };
}

export function getTranscripts(attemptId: string): any[] {
  const rows: any[] = db.prepare('SELECT * FROM transcripts WHERE attempt_id = ? ORDER BY timestamp ASC').all(attemptId);
  return rows.map(r => ({
    id: r.id,
    role: r.speaker,
    text: r.text,
    competencyId: r.competency_id,
    responseId: r.response_id,
    isFollowUp: Boolean(r.is_follow_up),
    followUpPurpose: r.follow_up_purpose,
    timestamp: r.timestamp,
  }));
}

export function addResponse(data: {
  attemptId: string;
  competencyId: string;
  text: string;
  sequenceNumber: number;
  classification: string;
}): any {
  const id = crypto.randomUUID();
  const now = Date.now();
  db.prepare(`
    INSERT INTO responses (id, attempt_id, competency_id, text, sequence_number, classification, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.attemptId || '',
    data.competencyId || 'problem_framing',
    data.text || '',
    typeof data.sequenceNumber === 'number' ? data.sequenceNumber : 1,
    data.classification || 'ANSWER_PARTIAL',
    now
  );
  return { id, ...data, text: data.text || '', createdAt: now };
}

export function getResponses(attemptId: string): any[] {
  const rows: any[] = db.prepare('SELECT * FROM responses WHERE attempt_id = ? ORDER BY sequence_number ASC').all(attemptId);
  return rows.map(r => ({
    responseId: r.id,
    attemptId: r.attempt_id,
    competencyId: r.competency_id,
    text: r.text,
    sequenceNumber: r.sequence_number,
    classification: r.classification,
    createdAt: r.created_at,
  }));
}

export function addEvidence(items: Array<{
  attemptId: string;
  responseId: string;
  competency: string;
  sourceText: string;
  observedBehavior: string;
  impact: string;
  confidence: number;
}>): any[] {
  const now = Date.now();
  const insert = db.prepare(`
    INSERT INTO evidence (id, attempt_id, response_id, competency, source_text, observed_behavior, impact, confidence, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const created: any[] = [];
  for (const item of items) {
    const id = crypto.randomUUID();
    insert.run(
      id,
      item.attemptId || '',
      item.responseId || '',
      item.competency || 'problem_framing',
      item.sourceText || '',
      item.observedBehavior || '',
      item.impact || '',
      typeof item.confidence === 'number' ? item.confidence : 0.85,
      now
    );
    created.push({ evidenceId: id, ...item, createdAt: now });
  }
  return created;
}

export function getEvidence(attemptId: string): any[] {
  const rows: any[] = db.prepare('SELECT * FROM evidence WHERE attempt_id = ? ORDER BY created_at ASC').all(attemptId);
  return rows.map(r => ({
    evidenceId: r.id,
    responseId: r.response_id,
    competency: r.competency,
    sourceText: r.source_text,
    observedBehavior: r.observed_behavior,
    impact: r.impact,
    confidence: r.confidence,
    createdAt: r.created_at,
  }));
}

export function saveEvaluation(data: {
  attemptId: string;
  overallRating: number;
  assessments: Array<{
    competencyId: string;
    rating: number;
    evidenceIds: string[];
    evidenceCoverage: number;
    confidence: number;
    recommendation: string;
  }>;
  feedback: Array<{
    type: 'strength' | 'gap';
    observation: string;
    whyItMattered: string;
    whatShouldChange: string;
    competencyId: string;
    evidenceIds: string[];
  }>;
  practiceExercise?: {
    targetGap: string;
    exercisePrompt: string;
    framework: string[];
    frameworkLabel: string;
    successCondition: string;
    evaluationCriteria: string[];
    expectedBehavior?: string;
  } | null;
}) {
  const now = Date.now();

  // Update attempt rating and completed_at
  updateAttempt(data.attemptId, {
    overall_rating: data.overallRating,
    status: 'completed',
    completed_at: now,
  });

  // Clear existing assessments & feedback for this attempt if any
  db.prepare('DELETE FROM competency_assessments WHERE attempt_id = ?').run(data.attemptId);
  db.prepare('DELETE FROM feedback_items WHERE attempt_id = ?').run(data.attemptId);
  db.prepare('DELETE FROM practice_exercises WHERE attempt_id = ?').run(data.attemptId);

  // Insert assessments
  const insertAssess = db.prepare(`
    INSERT INTO competency_assessments (id, attempt_id, competency_id, rating, evidence_ids, evidence_coverage, confidence, recommendation, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const a of data.assessments) {
    insertAssess.run(
      crypto.randomUUID(),
      data.attemptId,
      a.competencyId,
      a.rating,
      JSON.stringify(a.evidenceIds || []),
      a.evidenceCoverage,
      a.confidence,
      a.recommendation,
      now
    );
  }

  // Insert feedback
  const insertFeedback = db.prepare(`
    INSERT INTO feedback_items (id, attempt_id, type, observation, why_it_mattered, what_should_change, competency_id, evidence_ids, disputed, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
  `);
  for (const f of data.feedback) {
    insertFeedback.run(
      crypto.randomUUID(),
      data.attemptId,
      f.type,
      f.observation,
      f.whyItMattered,
      f.whatShouldChange,
      f.competencyId,
      JSON.stringify(f.evidenceIds || []),
      now
    );
  }

  // Insert practice exercise
  if (data.practiceExercise) {
    db.prepare(`
      INSERT INTO practice_exercises (id, attempt_id, target_gap, exercise_prompt, framework, framework_label, success_condition, evaluation_criteria, expected_behavior, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      data.attemptId,
      data.practiceExercise.targetGap,
      data.practiceExercise.exercisePrompt,
      JSON.stringify(data.practiceExercise.framework || []),
      data.practiceExercise.frameworkLabel,
      data.practiceExercise.successCondition,
      JSON.stringify(data.practiceExercise.evaluationCriteria || []),
      data.practiceExercise.expectedBehavior || data.practiceExercise.targetGap,
      now
    );
  }

  return getEvaluation(data.attemptId);
}

export function getEvaluation(attemptId: string): any {
  const attempt = getAttempt(attemptId);
  if (!attempt) return null;

  const assessRows: any[] = db.prepare('SELECT * FROM competency_assessments WHERE attempt_id = ?').all(attemptId);
  const assessments = assessRows.map(r => ({
    competencyId: r.competency_id,
    rating: r.rating,
    evidenceIds: JSON.parse(r.evidence_ids || '[]'),
    evidenceCoverage: r.evidence_coverage,
    confidence: r.confidence,
    recommendation: r.recommendation,
  }));

  const fbRows: any[] = db.prepare('SELECT * FROM feedback_items WHERE attempt_id = ?').all(attemptId);
  const feedback = fbRows.map(r => ({
    id: r.id,
    type: r.type,
    observation: r.observation,
    whyItMattered: r.why_it_mattered,
    whatShouldChange: r.what_should_change,
    competencyId: r.competency_id,
    evidenceIds: JSON.parse(r.evidence_ids || '[]'),
    disputed: Boolean(r.disputed),
  }));

  const practiceRow: any = db.prepare('SELECT * FROM practice_exercises WHERE attempt_id = ?').get(attemptId);
  let practiceExercise = null;
  if (practiceRow) {
    practiceExercise = {
      id: practiceRow.id,
      targetGap: practiceRow.target_gap,
      exercisePrompt: practiceRow.exercise_prompt,
      framework: JSON.parse(practiceRow.framework || '[]'),
      frameworkLabel: practiceRow.framework_label,
      successCondition: practiceRow.success_condition,
      evaluationCriteria: JSON.parse(practiceRow.evaluation_criteria || '[]'),
      expectedBehavior: practiceRow.expected_behavior,
    };
  }

  return {
    attemptId,
    overallRating: attempt.overall_rating,
    assessments,
    feedback,
    practiceExercise,
    modelVersion: attempt.model_version,
    rubricVersion: attempt.rubric_version,
    promptVersion: attempt.prompt_version,
  };
}

export function disputeFeedbackItem(feedbackId: string): boolean {
  const res = db.prepare('UPDATE feedback_items SET disputed = 1 WHERE id = ?').run(feedbackId);
  return res.changes > 0;
}

export function savePracticeResponse(data: {
  attemptId: string;
  exerciseId: string;
  text: string;
  met: boolean;
  metCriteria: string[];
}): any {
  const id = crypto.randomUUID();
  const now = Date.now();
  db.prepare(`
    INSERT INTO practice_responses (id, attempt_id, exercise_id, text, met, met_criteria, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.attemptId,
    data.exerciseId,
    data.text,
    data.met ? 1 : 0,
    JSON.stringify(data.metCriteria || []),
    now
  );
  return { id, ...data, createdAt: now };
}

export function saveComparison(data: {
  sessionId: string;
  attempt1Id: string;
  attempt2Id: string;
  competencyDeltas: any[];
  behavioralChanges: any[];
  overallDelta: number;
  addressedPracticeGoal: boolean;
  summary: string;
}): any {
  const id = crypto.randomUUID();
  const now = Date.now();
  db.prepare(`
    INSERT INTO attempt_comparisons (id, session_id, attempt1_id, attempt2_id, competency_deltas, behavioral_changes, overall_delta, addressed_practice_goal, summary, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.sessionId,
    data.attempt1Id,
    data.attempt2Id,
    JSON.stringify(data.competencyDeltas),
    JSON.stringify(data.behavioralChanges),
    data.overallDelta,
    data.addressedPracticeGoal ? 1 : 0,
    data.summary,
    now
  );
  return { id, ...data };
}

export function getComparisonBySession(sessionId: string): any {
  const row: any = db.prepare('SELECT * FROM attempt_comparisons WHERE session_id = ? ORDER BY created_at DESC LIMIT 1').get(sessionId);
  if (!row) return null;
  return {
    ...row,
    competencyDeltas: JSON.parse(row.competency_deltas || '[]'),
    behavioralChanges: JSON.parse(row.behavioral_changes || '[]'),
    addressedPracticeGoal: Boolean(row.addressed_practice_goal),
  };
}

export function recordEvent(sessionId: string | null, eventType: string, metadata: any = {}): any {
  const id = crypto.randomUUID();
  const now = Date.now();
  db.prepare(`
    INSERT INTO events (id, session_id, event_type, metadata, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, sessionId || null, eventType, JSON.stringify(metadata), now);
  return { id, sessionId, eventType, metadata, createdAt: now };
}
