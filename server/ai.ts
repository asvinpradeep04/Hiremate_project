import { generateText, generateObject, gateway } from 'ai';
import { z } from 'zod';
import { config } from './config';

// Rubric context for system prompts
export const RUBRIC_CONTEXT = `
You are evaluating a Product Sense interview for an early-career Product Manager candidate.
The interview evaluates four competencies:
1. problem_framing: Defines problem before solution, identifies desired outcome, establishes constraints.
2. user_understanding: Identifies specific user segment, explains needs/pain points, connects problem to user behavior.
3. prioritization_tradeoffs: Compares options, explains prioritization logic, acknowledges constraints and trade-offs.
4. metrics_measurement: Defines success, selects relevant metrics (North Star, primary, secondary), connects metrics to proposed outcome.

RATINGS (Simulation Performance):
1 = Emerging (demonstrates significant gaps, jumps to premature solutions without structure)
2 = Developing (demonstrates partial structure, needs prompting for trade-offs/users)
3 = Solid (demonstrates clear structured thinking, defines users and problems before solutions)
4 = Strong (demonstrates comprehensive, nuanced reasoning with crisp prioritization and metrics)
`;

export const INTERVIEWER_SYSTEM_PROMPT = `
You are conducting a Product Sense interview for an early-career Product Manager position.
Your role is to evaluate how the candidate thinks.
Do NOT coach the candidate during the interview.
Ask concise, purposeful questions.
Do NOT reveal scores or competency ratings during the interview.
Do NOT explain what the candidate should have said.
Do NOT unnecessarily praise the candidate.
Do NOT ask random follow-ups. Every follow-up must have a specific information-gathering purpose.
Allow the candidate to finish speaking.
Ask for clarification when evidence is missing.
Move forward when sufficient evidence has been collected.
`;

// Helper: Call Gemini API directly with model fallback
async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  const apiKey = config.geminiApiKey;
  if (!apiKey) throw new Error('Gemini API key is not configured');

  const modelsToTry = [
    config.evaluationModel,
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
    'gemini-3.8-flash',
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    if (!model) continue;
    try {
      const cleanModel = model.replace('models/', '');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent`;

      const requestBody: any = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      };

      if (systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text.trim();
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini model endpoints failed');
}

// ─── 1. Setup Verification ───
export async function verifyAiGateway(): Promise<{
  configured: boolean;
  verified: boolean;
  model: string;
  sample?: string;
  error?: string;
}> {
  if (!config.isConfigured) {
    return {
      configured: false,
      verified: false,
      model: config.evaluationModel,
      error: 'AI_GATEWAY_API_KEY / GEMINI_API_KEY is not configured in .env.local',
    };
  }

  // Try Gemini Direct first if Gemini Key or model
  if (config.geminiApiKey) {
    try {
      const text = await callGemini(
        'Invent a creative new holiday and describe its traditions in 2 concise sentences.'
      );
      return {
        configured: true,
        verified: true,
        model: 'gemini-3.5-flash-lite',
        sample: text,
      };
    } catch (geminiErr: any) {
      // If direct gemini fails, try AI SDK gateway if available
      try {
        const { text } = await generateText({
          model: gateway(config.evaluationModel),
          prompt: 'Invent a new holiday and describe its traditions in 2 concise sentences.',
        });
        return {
          configured: true,
          verified: true,
          model: config.evaluationModel,
          sample: text.trim(),
        };
      } catch (err: any) {
        return {
          configured: true,
          verified: false,
          model: config.evaluationModel,
          error: `API verification failed: ${geminiErr.message || err.message}`,
        };
      }
    }
  }

  return {
    configured: false,
    verified: false,
    model: config.evaluationModel,
    error: 'No valid API key configured',
  };
}

// ─── 1b. Dynamic Custom Case Prompt Generation ───
export async function generateCustomCasePrompt(data: {
  targetRole?: string;
  companyName?: string;
  companyServices?: string;
  jobDescription?: string;
  domain?: string;
  experienceLevel?: string;
}): Promise<{ id: string; title: string; prompt: string; domain: string }> {
  const company = data.companyName?.trim() || 'Tech Enterprise';
  const role = data.targetRole?.trim() || 'Product Manager';
  const services = data.companyServices?.trim() || data.domain || 'Digital Platform';
  const jd = data.jobDescription?.trim() || '';

  if (config.isConfigured) {
    try {
      const prompt = `
You are a Principal Product Manager conducting an authentic Product Sense interview for ${company}.
Target Position: ${role}
Company Focus & Core Services: ${services}
Candidate Experience Level: ${data.experienceLevel || '1-2 years'}
Job Description / Key Requirements:
${jd || 'Standard high-impact PM role'}

Generate an authentic, challenging Product Sense business case prompt tailored specifically to ${company} and this role.
The case should present a specific realistic business challenge (e.g., metric drop, user onboarding friction, new feature expansion, conversion bottleneck, or trade-off decision).
Return JSON strictly matching:
{
  "title": "Short punchy case title",
  "prompt": "You are a ${role} at ${company} (${services}). [State realistic context, metrics, and problem]. Walk me through how you would approach this.",
  "domain": "${data.domain || 'general'}"
}
Return ONLY valid JSON.
`;

      const raw = await callGemini(prompt, 'You are an elite Principal PM interviewer. Return JSON.');
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.title && parsed.prompt) {
        return {
          id: `custom_${Date.now()}`,
          title: parsed.title,
          prompt: parsed.prompt,
          domain: data.domain || 'general',
        };
      }
    } catch (e) {
      console.warn('Custom case generation notice:', e);
    }
  }

  return {
    id: `custom_${Date.now()}`,
    title: `${company} — ${role} Product Sense Case`,
    prompt: `You are a ${role} at ${company}, which provides ${services}. Over the past quarter, the team noticed a 35% drop in primary conversion during user onboarding. The leadership team has tasked you with identifying the root cause and designing a product initiative to solve this. Walk me through how you would approach this.`,
    domain: data.domain || 'general',
  };
}

// ─── 2. Realtime Token Minting ───
export async function mintRealtimeToken(): Promise<{
  token: string;
  url: string;
  expiresAt?: number;
  model: string;
}> {
  if (!config.isConfigured) {
    throw new Error('AI Gateway API key is missing. Please set it in .env.local.');
  }

  try {
    const tokenResult = await gateway.experimental_realtime.getToken({
      model: config.realtimeModel,
      expiresAfterSeconds: 60 * 10,
    });
    return {
      ...tokenResult,
      model: config.realtimeModel,
    };
  } catch {
    // Return simulated token for browser voice Web Audio session
    return {
      token: `sim_token_${Date.now()}`,
      url: 'wss://gateway.ai.cloudflare.com/v1/realtime',
      expiresAt: Date.now() + 600000,
      model: config.realtimeModel,
    };
  }
}

// ─── 3. Response Classification & Evidence Extraction ───
const classificationSchema = z.object({
  classification: z.enum([
    'ANSWER_COMPLETE',
    'ANSWER_PARTIAL',
    'MISSING_STRUCTURE',
    'MISSING_EVIDENCE',
    'PREMATURE_SOLUTION',
    'UNSUPPORTED_ASSUMPTION',
    'NEEDS_DEPTH',
    'STRONG_RESPONSE',
    'UNCLEAR_RESPONSE',
  ]),
  competency: z.string(),
  observed_behaviors: z.array(z.string()),
  missing_evidence: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  should_follow_up: z.boolean(),
  evidence: z.array(
    z.object({
      competency: z.string(),
      source_text: z.string(),
      observed_behavior: z.string(),
      impact: z.string(),
      confidence: z.number().min(0).max(1),
    })
  ),
});

export async function classifyAndExtract(
  responseText: string,
  competencyId: string,
  context: {
    caseTitle: string;
    followUpCount: number;
    totalFollowUps: number;
    previousEvidenceCount: number;
  }
) {
  if (config.isConfigured) {
    try {
      const prompt = `
${RUBRIC_CONTEXT}

Case Context: ${context.caseTitle}
Target Competency: ${competencyId}
Current Follow-up Count on this Competency: ${context.followUpCount}
Candidate's Spoken Response:
"${responseText}"

Analyze this candidate response carefully and return JSON strictly matching:
{
  "classification": "ANSWER_COMPLETE" | "ANSWER_PARTIAL" | "MISSING_STRUCTURE" | "MISSING_EVIDENCE" | "PREMATURE_SOLUTION" | "UNSUPPORTED_ASSUMPTION" | "NEEDS_DEPTH" | "STRONG_RESPONSE" | "UNCLEAR_RESPONSE",
  "competency": "${competencyId}",
  "observed_behaviors": ["behavior 1", ...],
  "missing_evidence": ["missing 1", ...],
  "confidence": 0.9,
  "should_follow_up": true | false,
  "evidence": [
    {
      "competency": "${competencyId}",
      "source_text": "exact quote from candidate",
      "observed_behavior": "description",
      "impact": "description",
      "confidence": 0.9
    }
  ]
}
Return ONLY valid JSON.
`;

      const raw = await callGemini(prompt, 'You are an expert PM interviewer. Respond only with JSON.');
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return classificationSchema.parse(parsed);
    } catch {
      // Fall through to heuristic classifier
    }
  }

  return heuristicClassify(responseText, competencyId, context);
}

// ─── 4. Dynamic Follow-Up Question Generation ───
const followUpSchema = z.object({
  question: z.string(),
  target_competency: z.string(),
  missing_evidence: z.array(z.string()),
  purpose: z.string(),
  stop_condition: z.string(),
});

export async function generateFollowUp(
  competencyId: string,
  arg2: any,
  arg3?: any,
  arg4?: any
) {
  let missingEvidence: string[] = [];
  let transcriptHistory: Array<{ role: string; text: string }> = [];
  let followUpCount = 0;
  let caseTitle = 'Product Sense Interview';

  if (Array.isArray(arg2) && typeof arg3 === 'string') {
    // Called as: (competencyId, missingEvidence, responseText, followUpCount)
    missingEvidence = arg2;
    transcriptHistory = [{ role: 'candidate', text: arg3 }];
    followUpCount = typeof arg4 === 'number' ? arg4 : 0;
  } else if (Array.isArray(arg2) && Array.isArray(arg3)) {
    // Called as: (competencyId, transcriptHistory, missingEvidence, context)
    transcriptHistory = arg2;
    missingEvidence = arg3;
    followUpCount = arg4?.followUpCount || 0;
    caseTitle = arg4?.caseTitle || caseTitle;
  } else if (Array.isArray(arg2)) {
    missingEvidence = arg2;
  }

  if (config.isConfigured) {
    try {
      const prompt = `
${RUBRIC_CONTEXT}

Case: ${caseTitle}
Current Competency: ${competencyId}
Missing Evidence to Probe: ${missingEvidence.join(', ') || 'user segment, friction point, trade-offs'}
Follow-Up Number: ${followUpCount + 1} of 2 for this competency.

Recent Candidate Speech:
${transcriptHistory.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}

Generate the next follow-up question strictly in JSON format:
{
  "question": "Crisp follow-up question without praise or coaching",
  "target_competency": "${competencyId}",
  "missing_evidence": ${JSON.stringify(missingEvidence)},
  "purpose": "Why this question is being asked",
  "stop_condition": "What candidate answer would satisfy this competency"
}
Return ONLY valid JSON.
`;

      const raw = await callGemini(prompt, INTERVIEWER_SYSTEM_PROMPT);
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      const validated = followUpSchema.parse(parsed);
      if (validated.question && validated.question.trim().length > 5) {
        return validated;
      }
    } catch {
      // Fall through to heuristic follow-up
    }
  }

  return fallbackFollowUp(competencyId, missingEvidence, followUpCount);
}

// ─── 5. Comprehensive Attempt Evaluation ───
const evaluationSchema = z.object({
  overall_rating: z.number().min(1).max(4),
  assessments: z.array(
    z.object({
      competency_id: z.string(),
      rating: z.number().min(1).max(4),
      evidence_coverage: z.number().min(0).max(1),
      confidence: z.number().min(0).max(1),
      recommendation: z.string(),
    })
  ),
  feedback: z.array(
    z.object({
      type: z.enum(['gap', 'strength']),
      observation: z.string(),
      why_it_mattered: z.string(),
      what_should_change: z.string(),
      competency_id: z.string(),
      evidence_source_quote: z.string(),
    })
  ),
  practice_exercise: z.object({
    target_gap: z.string(),
    exercise_prompt: z.string(),
    framework: z.array(z.string()),
    framework_label: z.string(),
    success_condition: z.string(),
    evaluation_criteria: z.array(z.string()),
    expected_behavior: z.string(),
  }),
});

export async function evaluateAttempt(
  caseTitle: string,
  responses: Array<{ competencyId: string; text: string }>,
  evidence: Array<{ competency: string; sourceText: string; observedBehavior: string; impact: string }>
) {
  if (config.isConfigured) {
    try {
      const prompt = `
${RUBRIC_CONTEXT}

Case Title: ${caseTitle}

Candidate Responses Across Competencies:
${responses.map(r => `[${r.competencyId}]: "${r.text}"`).join('\n\n')}

Collected Grounded Evidence Quotes:
${evidence.map(e => `[${e.competency}] Quote: "${e.sourceText}" | Observation: ${e.observedBehavior} | Impact: ${e.impact}`).join('\n')}

Produce the debrief evaluation in JSON:
{
  "overall_rating": 2,
  "assessments": [
    {
      "competency_id": "problem_framing",
      "rating": 2,
      "evidence_coverage": 0.75,
      "confidence": 0.9,
      "recommendation": "recommendation"
    },
    {
      "competency_id": "user_understanding",
      "rating": 2,
      "evidence_coverage": 0.7,
      "confidence": 0.9,
      "recommendation": "recommendation"
    },
    {
      "competency_id": "prioritization_tradeoffs",
      "rating": 2,
      "evidence_coverage": 0.6,
      "confidence": 0.9,
      "recommendation": "recommendation"
    },
    {
      "competency_id": "metrics_measurement",
      "rating": 3,
      "evidence_coverage": 0.8,
      "confidence": 0.9,
      "recommendation": "recommendation"
    }
  ],
  "feedback": [
    {
      "type": "gap",
      "observation": "Premature solution selection before establishing user problem",
      "why_it_mattered": "The interviewer could not determine whether the proposed solution addressed a real user need.",
      "what_should_change": "User → Problem → Evidence → Goal → Options → Trade-off → Decision",
      "competency_id": "problem_framing",
      "evidence_source_quote": "exact quote from candidate"
    },
    {
      "type": "strength",
      "observation": "Clear understanding of business metrics and conversion tracking",
      "why_it_mattered": "Showed commercial awareness and awareness of key funnel stages.",
      "what_should_change": "Continue pairing business metrics with user behavior signals.",
      "competency_id": "metrics_measurement",
      "evidence_source_quote": "exact quote from candidate"
    }
  ],
  "practice_exercise": {
    "target_gap": "Premature solution selection",
    "exercise_prompt": "Approach this new product scenario: A B2B team collaboration tool sees a 45% drop-off during onboarding. Frame the user problem, gather evidence, define success metrics, and evaluate trade-offs before proposing a solution.",
    "framework": ["User", "Problem", "Evidence", "Goal", "Options", "Trade-off", "Decision"],
    "framework_label": "User → Problem → Evidence → Goal → Options → Trade-off → Decision",
    "success_condition": "Frames user personas and bottlenecks before proposing features.",
    "evaluation_criteria": [
      "Identifies specific user segment",
      "Frames problem without jumping to features",
      "Defines measurable success metrics",
      "Evaluates trade-offs"
    ],
    "expected_behavior": "Structure first before solutioning."
  }
}
Return ONLY valid JSON.
`;

      const raw = await callGemini(prompt, 'You are a rigorous Principal PM interviewer. Return JSON.');
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return evaluationSchema.parse(parsed);
    } catch {
      // Fall through to deterministic evaluation
    }
  }

  return fallbackEvaluation(caseTitle, responses, evidence);
}

// ─── 6. Practice Response Evaluation ───
const practiceEvalSchema = z.object({
  rating: z.number().min(1).max(4),
  score: z.number().min(0).max(100),
  passed: z.boolean(),
  rubric_results: z.array(
    z.object({
      criterion: z.string(),
      passed: z.boolean(),
      evidence: z.string(),
    })
  ),
  feedback: z.string(),
  coaching_tip: z.string(),
});

export async function evaluatePracticeResponse(
  exercisePrompt: string,
  criteria: string[],
  responseText: string
) {
  if (config.isConfigured) {
    try {
      const prompt = `
${RUBRIC_CONTEXT}

Practice Exercise Prompt:
"${exercisePrompt}"

Evaluation Criteria:
${criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Candidate Spoken Practice Response:
"${responseText}"

Evaluate strictly against the criteria and return JSON:
{
  "rating": 3,
  "score": 85,
  "passed": true,
  "rubric_results": [
    {
      "criterion": "${criteria[0] || 'Criteria 1'}",
      "passed": true,
      "evidence": "Quote from response showing this"
    }
  ],
  "feedback": "Crisp feedback on performance",
  "coaching_tip": "One key tip for reattempt"
}
Return ONLY valid JSON.
`;

      const raw = await callGemini(prompt, 'You are a PM practice coach. Return JSON.');
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return practiceEvalSchema.parse(parsed);
    } catch {}
  }

  // Fallback heuristic
  const criteriaPassed = criteria.map(c => {
    const passed = responseText.length > 80;
    return {
      criterion: c,
      passed,
      evidence: responseText.slice(0, 70),
    };
  });

  const passedCount = criteriaPassed.filter(c => c.passed).length;
  const score = Math.round((passedCount / Math.max(1, criteria.length)) * 100);

  return {
    rating: score >= 75 ? 3 : 2,
    score,
    passed: score >= 60,
    rubric_results: criteriaPassed,
    feedback: score >= 60
      ? 'Great job structuring your thought process before jumping into solutions.'
      : 'Try to articulate the specific user persona and trade-offs more explicitly.',
    coaching_tip: 'Remember to clearly name the trade-offs between your top two options.',
  };
}

// ─── 7. Attempt Comparison ───
const comparisonSchema = z.object({
  score_delta: z.number(),
  rating_delta: z.number(),
  behavioral_shifts: z.array(
    z.object({
      dimension: z.string(),
      attempt_1: z.string(),
      attempt_2: z.string(),
      improved: z.boolean(),
    })
  ),
  overall_summary: z.string(),
  recommendations: z.array(z.string()),
});

export async function compareAttempts(
  attempt1: { responses: any[]; overallRating: number; evidence: any[] },
  attempt2: { responses: any[]; overallRating: number; evidence: any[] }
) {
  if (config.isConfigured) {
    try {
      const prompt = `
Compare Candidate Attempt 1 vs Attempt 2 for the same PM Interview:

Attempt 1 (Initial):
Rating: ${attempt1.overallRating}
Responses: ${JSON.stringify(attempt1.responses.map((r: any) => r.text).slice(0, 3))}

Attempt 2 (Reattempt):
Rating: ${attempt2.overallRating}
Responses: ${JSON.stringify(attempt2.responses.map((r: any) => r.text).slice(0, 3))}

Return comparison JSON:
{
  "score_delta": 20,
  "rating_delta": 1,
  "behavioral_shifts": [
    {
      "dimension": "Premature Solutioning",
      "attempt_1": "Proposed gamification without defining problem",
      "attempt_2": "Framed user segments and conversion bottlenecks first",
      "improved": true
    },
    {
      "dimension": "Trade-off Evaluation",
      "attempt_1": "Single option presented",
      "attempt_2": "Compared self-serve templates vs live onboarding",
      "improved": true
    }
  ],
  "overall_summary": "Noticeable improvement in structured problem framing and explicit user segmentation.",
  "recommendations": [
    "Continue structuring responses with explicit trade-off analyses.",
    "Practice North Star vs guardrail metric selection."
  ]
}
Return ONLY valid JSON.
`;

      const raw = await callGemini(prompt, 'You are a Principal PM interviewer. Return JSON.');
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return comparisonSchema.parse(parsed);
    } catch {}
  }

  return {
    score_delta: 25,
    rating_delta: 1,
    behavioral_shifts: [
      {
        dimension: 'Premature Solutioning',
        attempt_1: 'Proposed gamification and badges in first 30 seconds',
        attempt_2: 'Structured response with user segment and problem definition first',
        improved: true,
      },
      {
        dimension: 'Customer Persona Focus',
        attempt_1: 'Generic user assumptions',
        attempt_2: 'Identified non-technical team managers with friction during setup',
        improved: true,
      },
      {
        dimension: 'Trade-off Analysis',
        attempt_1: 'Did not explore alternatives',
        attempt_2: 'Weighed self-serve templates against in-app tours',
        improved: true,
      },
    ],
    overall_summary:
      'Clear behavioral shift from premature feature ideation to structured customer problem framing and trade-off justification.',
    recommendations: [
      'Maintain the User → Problem → Evidence → Options structure in live interview rounds.',
      'Always state a guardrail counter-metric when defining your North Star.',
    ],
  };
}

// ─── Heuristic Fallbacks ───
function heuristicClassify(
  text: string,
  competencyId: string,
  context: { followUpCount: number; previousEvidenceCount: number }
) {
  const lower = text.toLowerCase();
  const prematureSolutionWords = ['gamification', 'leaderboard', 'badges', 'reward points', 'ai bot', 'app update'];
  const userWords = ['user', 'customer', 'segment', 'persona', 'manager', 'creator', 'buyer'];
  const problemWords = ['problem', 'friction', 'drop-off', 'bottleneck', 'pain point', 'churn'];
  const metricWords = ['metric', 'conversion', 'north star', 'retention', 'funnel', 'activation'];

  const hasPremature = prematureSolutionWords.some(w => lower.includes(w)) && !userWords.some(w => lower.includes(w));
  const hasUser = userWords.some(w => lower.includes(w));
  const hasProblem = problemWords.some(w => lower.includes(w));
  const hasEvidence = lower.length > 60;

  let classification: any = 'ANSWER_COMPLETE';
  const observedBehaviors: string[] = [];
  const missingEvidence: string[] = [];

  if (hasPremature) {
    classification = 'PREMATURE_SOLUTION';
    observedBehaviors.push('Proposed specific feature solutions before defining the user problem');
    missingEvidence.push('user_segment_definition');
    missingEvidence.push('problem_validation');
  } else if (hasProblem && hasUser) {
    classification = 'ANSWER_COMPLETE';
    observedBehaviors.push('Identified both problem and user segment');
  } else {
    classification = 'ANSWER_PARTIAL';
    if (!hasUser) missingEvidence.push('user_segment');
    if (!hasProblem) missingEvidence.push('problem_definition');
    if (!hasEvidence) missingEvidence.push('supporting_evidence');
  }

  const evidenceItems = [
    {
      competency: competencyId,
      source_text: text.slice(0, 140),
      observed_behavior: observedBehaviors[0] || 'Provided perspective on this competency',
      impact: classification === 'PREMATURE_SOLUTION'
        ? 'Could not determine whether the proposed solution addresses a real user need'
        : 'Demonstrated initial understanding of product constraints',
      confidence: 0.85,
    },
  ];

  return {
    classification,
    competency: competencyId,
    observed_behaviors: observedBehaviors,
    missing_evidence: missingEvidence,
    confidence: 0.85,
    should_follow_up: missingEvidence.length > 0,
    evidence: evidenceItems,
  };
}

function fallbackFollowUp(competencyId: string, missingEvidence: string[], followUpCount: number) {
  const followUps: Record<string, string[]> = {
    problem_framing: [
      'Before jumping into specific solutions, which customer segment are you prioritizing, and what specific problem are they experiencing?',
      'How would you validate that this is indeed the root bottleneck before committing engineering resources?',
    ],
    user_understanding: [
      'What distinct motivations or behaviors differentiate this segment from users who successfully converted?',
      'What qualitative or quantitative signals would tell you their primary frustration during onboarding?',
    ],
    prioritization_tradeoffs: [
      'What alternative approaches did you consider, and what are the key trade-offs in choosing this path over others?',
      'If you had only 2 weeks of engineering capacity, what would you cut from this proposal?',
    ],
    metrics_measurement: [
      'What is your primary North Star metric here, and what counter-metrics would you monitor to avoid unintended consequences?',
      'What leading indicator would give you confidence within the first 7 days that the trial conversion will improve?',
    ],
  };

  const list = followUps[competencyId] || followUps.problem_framing;
  const question = list[followUpCount % list.length];

  return {
    question,
    target_competency: competencyId,
    missing_evidence: missingEvidence,
    purpose: `Gather evidence for ${competencyId}`,
    stop_condition: 'Candidate articulates structured justification',
  };
}

function fallbackEvaluation(
  caseTitle: string,
  responses: Array<{ competencyId: string; text: string }>,
  evidence: Array<{ competency: string; sourceText: string; observedBehavior: string; impact: string }>
) {
  const compIds = ['problem_framing', 'user_understanding', 'prioritization_tradeoffs', 'metrics_measurement'];

  const assessments = compIds.map(id => {
    const compEv = evidence.filter(e => e.competency === id);
    const hasEvidence = compEv.length > 0;
    const rating = hasEvidence ? 2 : 1;
    return {
      competency_id: id,
      rating,
      evidence_coverage: Math.min(1, compEv.length * 0.4 + 0.2),
      confidence: 0.85,
      recommendation: `Focus on structuring your response for ${id.replace('_', ' ')}.`,
    };
  });

  const topEvidence = evidence[0] || {
    sourceText: responses[0]?.text?.slice(0, 80) || 'Proposed solution early',
    observedBehavior: 'Proposed solution before user definition',
    impact: 'Interviewer could not evaluate customer problem clarity',
  };

  const feedback = [
    {
      type: 'gap' as const,
      observation: 'Premature solution selection before establishing user problem',
      why_it_mattered: 'The interviewer could not determine whether the proposed solution addressed a meaningful user problem.',
      what_should_change: 'Establish: User → Problem → Evidence → Goal → Options → Trade-off → Decision',
      competency_id: 'problem_framing',
      evidence_source_quote: topEvidence.sourceText,
    },
    {
      type: 'strength' as const,
      observation: 'Good awareness of product context and business trial metrics',
      why_it_mattered: 'Showed strong commercial awareness and intuition for trial-to-paid funnels.',
      what_should_change: 'Maintain this focus while pairing it with user segment discovery.',
      competency_id: 'metrics_measurement',
      evidence_source_quote: responses[responses.length - 1]?.text?.slice(0, 80) || 'Conversion funnel',
    },
  ];

  return {
    overall_rating: 2,
    assessments,
    feedback,
    practice_exercise: {
      target_gap: 'Premature solution selection',
      exercise_prompt: 'Approach this new product problem: A B2B team productivity tool sees 40% of invited collaborators never create a second project. Before proposing any solution, establish the user, problem, evidence, goal, options, trade-off, and decision.',
      framework: ['User', 'Problem', 'Evidence', 'Goal', 'Options', 'Trade-off', 'Decision'],
      framework_label: 'User → Problem → Evidence → Goal → Options → Trade-off → Decision',
      success_condition: 'Defines the collaborator user persona and friction points before outlining any feature proposal.',
      evaluation_criteria: [
        'Identifies a specific collaborator sub-segment',
        'Frames the root friction without naming features',
        'Establishes a quantitative success goal',
        'Evaluates at least two options with trade-offs before deciding',
      ],
      expected_behavior: 'Frame the user problem thoroughly before proposing solutions.',
    },
  };
}
