import type { IncomingMessage, ServerResponse } from 'node:http';
import { config } from './config';
import * as db from './db';
import * as ai from './ai';

const DEFAULT_CORE_KEYS = [
  'problem_framing',
  'user_understanding',
  'prioritization_tradeoffs',
  'metrics_measurement',
];

const DEFAULT_AI_KEYS = [
  'ai_product_sense',
  'technical_architecture',
  'evaluation_systems',
  'ai_behavioral_ethics',
];

const COMPETENCY_KEYS = DEFAULT_CORE_KEYS;

const COMPETENCY_PROMPTS: Record<string, string> = {
  problem_framing:
    "To start — how would you frame the problem here? What is the core problem you're trying to solve, and who is most affected by it?",
  user_understanding:
    "Tell me more about the specific user segment you'd focus on. What do you know about their current behavior, pain points, and motivations?",
  prioritization_tradeoffs:
    'What approach would you take, and what alternatives did you consider? Walk me through your prioritization and the trade-offs involved.',
  metrics_measurement:
    'How would you measure success for this initiative? What metrics would tell you whether it is actually working?',
  product_strategy:
    'Now from a strategic lens: how does this initiative build durable competitive moats (switching costs, network effects) against competitors, and how does it fit into your 3-horizon bets?',
  guesstimates:
    'Let’s look at the numbers: what is your formula and structured Fermi breakdown to estimate the market size or capacity here? Walk me through your calculations.',
  execution_prioritization:
    'From an execution perspective: if bandwidth is constrained and you encounter launch blockers or regressions, how do you apply RICE scoring and what are your go/no-go rollback thresholds?',
  ai_product_sense:
    'To begin our AI product evaluation: how would you design the probabilistic UX, confidence-tier routing, and human-in-the-loop safeguards to handle model hallucinations and maintain user trust?',
  technical_architecture:
    'Let’s go deeper into the technical architecture: walk me through your technical design choices between RAG vs Fine-tuning, chunking strategy, latency budgets (TTFT), and token costs.',
  evaluation_systems:
    'How would you design a comprehensive evaluation system (multi-tier eval pyramid, LLM-as-a-judge, golden benchmark sets, and RAG Triad) to detect hallucinations and prevent prompt regressions?',
  ai_behavioral_ethics:
    'Finally, how do you address Responsible AI governance: auditing algorithmic bias across cohorts, preventing PII/data leakage, mitigating sycophancy, and handling safety incidents?',
};

const COMPETENCY_TRANSITIONS = [
  "Good. Now let's explore the user persona and acute workflow friction more specifically.",
  "Let's move on to how you would prioritize options, analyze architecture, and think through trade-offs.",
  "Now let's examine measurement, evaluation systems, and defensive guardrail metrics.",
  "That covers all the primary competency areas I wanted to explore. Let me compile the debrief evaluation.",
];

// In-memory case bank (synced with frontend cases)
const CASES: Record<string, any[]> = {
  saas: [
    {
      id: 'saas_activation_1',
      title: 'Improving Trial-to-Paid Conversion in a B2B SaaS Tool',
      prompt:
        'You are a PM at a B2B project management SaaS. Users sign up for a 14-day free trial, but only 8% convert to paid. The team believes the onboarding experience is the bottleneck. Walk me through how you would approach designing a solution to improve trial-to-paid conversion.',
      domain: 'saas',
      difficulty: 'Early-career',
      competencies: COMPETENCY_KEYS,
    },
    {
      id: 'saas_activation_2',
      title: 'Reducing Churn in a Team Collaboration Tool',
      prompt:
        'You are a PM at a team collaboration SaaS. Companies that adopt the tool show a 35% churn rate within 90 days. You suspect that teams are not reaching their "aha moment" quickly enough. Design an initiative to reduce early churn. Walk me through your thinking.',
      domain: 'saas',
      difficulty: 'Early-career',
      competencies: COMPETENCY_KEYS,
    },
  ],
  fintech: [
    {
      id: 'fintech_retention_1',
      title: 'Improving Retention for a Consumer Fintech App',
      prompt:
        'You are a PM at a consumer fintech app with 2M monthly active users. Over the past quarter, 30-day retention has dropped from 45% to 31%. The executive team is concerned. Walk me through how you would approach designing a feature or initiative to improve retention.',
      domain: 'fintech',
      difficulty: 'Early-career',
      competencies: COMPETENCY_KEYS,
    },
    {
      id: 'fintech_retention_2',
      title: 'Re-engaging Lapsed Users in a Budgeting App',
      prompt:
        'You are a PM at a personal budgeting app. Users who download the app set up a budget in the first session, but 60% never return after day 7. Design an approach to re-engage these lapsed users. Walk me through your thinking.',
      domain: 'fintech',
      difficulty: 'Early-career',
      competencies: COMPETENCY_KEYS,
    },
  ],
  marketplace: [
    {
      id: 'marketplace_supply_1',
      title: 'Growing Supply in a Local Services Marketplace',
      prompt:
        'You are a PM at a marketplace connecting homeowners with local service professionals. On the supply side, professional sign-ups have slowed and active listings are declining. How would you design an initiative to grow and retain supply?',
      domain: 'marketplace',
      difficulty: 'Early-career',
      competencies: COMPETENCY_KEYS,
    },
    {
      id: 'marketplace_supply_2',
      title: 'Improving Match Quality in a Freelancer Marketplace',
      prompt:
        'You are a PM at a freelancer marketplace. Clients post projects but 40% never receive a proposal from a qualified freelancer. Design an approach to improve match quality and increase the proposal rate.',
      domain: 'marketplace',
      difficulty: 'Early-career',
      competencies: COMPETENCY_KEYS,
    },
  ],
  consumer: [
    {
      id: 'consumer_engagement_1',
      title: 'Deepening Engagement in a Health Tracking App',
      prompt:
        'You are a PM at a consumer health tracking app. Users log their meals and workouts for the first week, but daily active usage drops sharply after that. Design a feature or initiative to deepen long-term engagement.',
      domain: 'consumer',
      difficulty: 'Early-career',
      competencies: COMPETENCY_KEYS,
    },
    {
      id: 'consumer_engagement_2',
      title: 'Increasing Content Discovery in a Short-Video App',
      prompt:
        'You are a PM at a short-form video app. New users browse for a few minutes but many leave without following any creators or returning. Design an approach to improve content discovery and first-session retention.',
      domain: 'consumer',
      difficulty: 'Early-career',
      competencies: COMPETENCY_KEYS,
    },
  ],
  general: [
    {
      id: 'general_product_1',
      title: 'Designing a Notification Strategy for a Mobile App',
      prompt:
        'You are a PM at a mobile app with 500K daily active users. Leadership wants to increase DAU by improving the notification strategy. Walk me through how you would approach designing a notification system that drives engagement without alienating users.',
      domain: 'general',
      difficulty: 'Early-career',
      competencies: COMPETENCY_KEYS,
    },
    {
      id: 'general_product_2',
      title: 'Designing an Onboarding Flow for a New Feature',
      prompt:
        'You are a PM at a productivity app. Your team is launching a new AI-powered task suggestion feature. Adoption of new features has historically been low. Walk me through how you would design the onboarding experience to maximize adoption.',
      domain: 'general',
      difficulty: 'Early-career',
      competencies: COMPETENCY_KEYS,
    },
  ],
};

function getCase(domain: string, attemptNumber: number) {
  const domainCases = CASES[domain] || CASES.general;
  const idx = Math.min(Math.max(attemptNumber - 1, 0), domainCases.length - 1);
  return domainCases[idx];
}

// ─── JSON Response Helper ───
function sendJson(res: ServerResponse, data: any, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safeguard against very large payloads
      if (body.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// ─── API Router ───
export async function handleApiRoute(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string
): Promise<boolean> {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return true;
  }

  try {
    // 1. GET /api/health
    if (pathname === '/api/health' && req.method === 'GET') {
      sendJson(res, {
        status: 'ok',
        aiConfigured: config.isConfigured,
        realtimeModel: config.realtimeModel,
        evaluationModel: config.evaluationModel,
        rubricVersion: config.rubricVersion,
      });
      return true;
    }

    // 2. GET /api/setup/status
    if (pathname === '/api/setup/status' && req.method === 'GET') {
      sendJson(res, {
        configured: config.isConfigured,
        realtimeModel: config.realtimeModel,
        evaluationModel: config.evaluationModel,
        message: config.isConfigured
          ? 'AI Gateway credentials detected in server environment.'
          : 'AI_GATEWAY_API_KEY is missing from .env.local. Add your key to .env.local to enable live AI features.',
      });
      return true;
    }

    // 3. POST /api/verify
    if (pathname === '/api/verify' && req.method === 'POST') {
      const result = await ai.verifyAiGateway();
      sendJson(res, result);
      return true;
    }

    // 4. POST /api/realtime/token
    if (pathname === '/api/realtime/token' && req.method === 'POST') {
      try {
        const tokenData = await ai.mintRealtimeToken();
        sendJson(res, tokenData);
      } catch (err: any) {
        sendJson(res, {
          error: err.message || 'Failed to mint realtime token',
          code: 'REALTIME_TOKEN_FAILED',
        }, 500);
      }
      return true;
    }

    // 5. POST /api/interviews (Start new interview session and attempt 1)
    if (pathname === '/api/interviews' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const experienceLevel = body.experienceLevel || '0-1';
      const domain = body.domain || 'saas';
      const attemptNumber = body.attemptNumber || 1;

      let session = body.sessionId ? db.getSession(body.sessionId) : null;
      if (!session) {
        session = db.createSession(experienceLevel, domain);
      }

      let caseData = getCase(domain, attemptNumber);
      const isAITrack = body.track === 'ai_pm' || (body.targetRole && (body.targetRole.includes('AI') || body.targetRole.includes('ML')));
      const activeCompetencies = isAITrack ? DEFAULT_AI_KEYS : DEFAULT_CORE_KEYS;

      // If company details, JD, or custom track provided, generate tailored custom case
      if (body.companyName || body.jobDescription || body.interviewMode === 'company_tailored' || body.track || body.questionType) {
        try {
          const custom = await ai.generateCustomCasePrompt({
            targetRole: body.targetRole,
            companyName: body.companyName,
            companyServices: body.companyServices,
            jobDescription: body.jobDescription,
            domain,
            experienceLevel,
            track: body.track,
            questionType: body.questionType,
            targetFrameworks: body.targetFrameworks,
          });
          caseData = {
            id: custom.id,
            title: custom.title,
            prompt: custom.prompt,
            domain: (custom.domain as any) || domain,
            difficulty: 'Early-career to Mid',
            competencies: custom.competencies || activeCompetencies,
          };
        } catch (e) {
          console.warn('Could not generate custom prompt, using default case:', e);
        }
      }

      const attempt = db.createAttempt({
        sessionId: session.id,
        attemptNumber,
        caseId: caseData.id,
        caseTitle: caseData.title,
        casePrompt: caseData.prompt,
        domain,
      });

      // Record interview_started event
      db.recordEvent(session.id, attemptNumber === 1 ? 'interview_started' : 'reattempt_started', {
        attemptId: attempt.id,
        domain,
        caseId: caseData.id,
        targetRole: body.targetRole,
        companyName: body.companyName,
        track: body.track,
        questionType: body.questionType,
      });

      const firstComp = (caseData.competencies && caseData.competencies[0]) || activeCompetencies[0];
      const promptSuffix = COMPETENCY_PROMPTS[firstComp] || COMPETENCY_PROMPTS.problem_framing;

      // Add initial interviewer greeting / prompt to transcript
      const initialPrompt = `${caseData.prompt}\n\n${promptSuffix}`;
      const transcript = db.addTranscript({
        attemptId: attempt.id,
        speaker: 'interviewer',
        text: initialPrompt,
        competencyId: firstComp,
      });

      sendJson(res, {
        session,
        attempt,
        case: caseData,
        initialQuestion: initialPrompt,
        transcripts: [transcript],
      });
      return true;
    }

    // 6. GET /api/interviews/:id (Restore interview state after refresh)
    const interviewMatch = pathname.match(/^\/api\/interviews\/([^/]+)$/);
    if (interviewMatch && req.method === 'GET') {
      const attemptId = interviewMatch[1];
      const attempt = db.getAttempt(attemptId);
      if (!attempt) {
        sendJson(res, { error: 'Attempt not found' }, 404);
        return true;
      }

      const session = db.getSession(attempt.session_id);
      const transcripts = db.getTranscripts(attemptId);
      const responses = db.getResponses(attemptId);
      const evidence = db.getEvidence(attemptId);
      const currentCompetency = COMPETENCY_KEYS[attempt.current_competency_index] || 'problem_framing';

      sendJson(res, {
        session,
        attempt,
        transcripts,
        responses,
        evidence,
        currentCompetency,
        case: {
          id: attempt.case_id,
          title: attempt.case_title,
          prompt: attempt.case_prompt,
          domain: attempt.domain,
          competencies: COMPETENCY_KEYS,
        },
      });
      return true;
    }

    // 7. POST /api/interviews/:id/responses (Candidate speaks -> save -> classify -> follow-up or advance)
    const responseMatch = pathname.match(/^\/api\/interviews\/([^/]+)\/responses$/);
    if (responseMatch && req.method === 'POST') {
      const attemptId = responseMatch[1];
      const attempt = db.getAttempt(attemptId);
      if (!attempt) {
        sendJson(res, { error: 'Attempt not found' }, 404);
        return true;
      }

      const body = await parseJsonBody(req);
      const responseText = (body.responseText || body.text || '').trim();
      const currentCompIndex = attempt.current_competency_index;
      const attemptKeys = attempt.case_id?.includes('ai') || attempt.domain === 'ai_tech' ? DEFAULT_AI_KEYS : DEFAULT_CORE_KEYS;
      const competencyId = body.competencyId || attemptKeys[currentCompIndex] || attemptKeys[0];

      if (!responseText) {
        sendJson(res, { error: 'Empty response text' }, 400);
        return true;
      }

      // Step 1: NEVER lose a candidate's response. Save it immediately!
      const existingResponses = db.getResponses(attemptId);
      const responseRecord = db.addResponse({
        attemptId,
        competencyId,
        text: responseText,
        sequenceNumber: existingResponses.length + 1,
        classification: 'ANSWER_PARTIAL',
      });

      // Save candidate turn in transcript
      db.addTranscript({
        attemptId,
        speaker: 'candidate',
        text: responseText,
        competencyId,
        responseId: responseRecord.id,
      });

      // Step 2: Classify response & extract evidence
      const existingEvidence = db.getEvidence(attemptId);
      const classificationResult = await ai.classifyAndExtract(responseText, competencyId, {
        caseTitle: attempt.case_title,
        followUpCount: attempt.follow_up_count,
        totalFollowUps: attempt.total_follow_ups,
        previousEvidenceCount: existingEvidence.length,
      });

      // Update response classification in database
      db.updateAttempt(attemptId, {}); // touch
      // Store extracted evidence items in database
      const newEvidenceItems = (classificationResult.evidence || []).map(ev => ({
        attemptId,
        responseId: responseRecord.id,
        competency: ev.competency || competencyId,
        sourceText: ev.source_text || responseText.slice(0, 120),
        observedBehavior: ev.observed_behavior || classificationResult.observed_behaviors[0] || 'Articulated perspective',
        impact: ev.impact || 'Observed in candidate reasoning',
        confidence: ev.confidence || 0.85,
      }));
      db.addEvidence(newEvidenceItems);

      // Step 3: Decide: Follow up or Advance?
      const shouldProbe =
        classificationResult.should_follow_up &&
        attempt.follow_up_count < config.maxFollowUpsPerCompetency &&
        attempt.total_follow_ups < config.maxTotalFollowUps;

      if (shouldProbe) {
        // Generate targeted follow-up question
        const followUp = await ai.generateFollowUp(
          competencyId,
          classificationResult.missing_evidence || [],
          responseText,
          attempt.follow_up_count
        );

        // Store follow-up in transcript
        const followUpTranscript = db.addTranscript({
          attemptId,
          speaker: 'interviewer',
          text: followUp.question,
          competencyId,
          isFollowUp: true,
          followUpPurpose: followUp.purpose,
        });

        // Update attempt follow-up counts
        db.updateAttempt(attemptId, {
          follow_up_count: attempt.follow_up_count + 1,
          total_follow_ups: attempt.total_follow_ups + 1,
        });

        sendJson(res, {
          type: 'follow_up',
          question: followUp.question,
          followUpPurpose: followUp.purpose,
          classification: classificationResult.classification,
          responseId: responseRecord.id,
          followUpCount: attempt.follow_up_count + 1,
          transcript: followUpTranscript,
        });
        return true;
      }

      const isLastCompetency = currentCompIndex >= attemptKeys.length - 1;

      if (isLastCompetency) {
        // Interview complete!
        const transitionMsg = COMPETENCY_TRANSITIONS[3];
        const completionTranscript = db.addTranscript({
          attemptId,
          speaker: 'interviewer',
          text: transitionMsg,
        });

        db.updateAttempt(attemptId, {
          status: 'completed',
          completed_at: Date.now(),
        });

        db.recordEvent(attempt.session_id, attempt.attempt_number === 1 ? 'interview_completed' : 'reattempt_completed', {
          attemptId,
        });

        sendJson(res, {
          type: 'complete',
          transitionMessage: transitionMsg,
          classification: classificationResult.classification,
          responseId: responseRecord.id,
          transcript: completionTranscript,
        });
        return true;
      }

      // Advance to next competency
      const nextIndex = currentCompIndex + 1;
      const nextCompetency = attemptKeys[nextIndex];
      const transitionText = COMPETENCY_TRANSITIONS[Math.min(currentCompIndex, COMPETENCY_TRANSITIONS.length - 2)];
      const promptText = COMPETENCY_PROMPTS[nextCompetency] || COMPETENCY_PROMPTS.problem_framing;
      const fullNextMessage = `${transitionText} ${promptText}`;

      const advanceTranscript = db.addTranscript({
        attemptId,
        speaker: 'interviewer',
        text: fullNextMessage,
        competencyId: nextCompetency,
      });

      db.updateAttempt(attemptId, {
        current_competency_index: nextIndex,
        follow_up_count: 0,
      });

      sendJson(res, {
        type: 'advance',
        nextCompetency,
        nextIndex,
        transitionMessage: transitionText,
        nextPrompt: promptText,
        fullNextMessage,
        classification: classificationResult.classification,
        responseId: responseRecord.id,
        transcript: advanceTranscript,
      });
      return true;
    }

    // 8. GET /api/interviews/:id/transcript
    const transcriptMatch = pathname.match(/^\/api\/interviews\/([^/]+)\/transcript$/);
    if (transcriptMatch && req.method === 'GET') {
      const attemptId = transcriptMatch[1];
      const transcripts = db.getTranscripts(attemptId);
      sendJson(res, { transcripts });
      return true;
    }

    // 9. POST /api/interviews/:id/evaluate (Generate debrief evaluation)
    const evalMatch = pathname.match(/^\/api\/interviews\/([^/]+)\/evaluate$/);
    if (evalMatch && req.method === 'POST') {
      const attemptId = evalMatch[1];
      const attempt = db.getAttempt(attemptId);
      if (!attempt) {
        sendJson(res, { error: 'Attempt not found' }, 404);
        return true;
      }

      const responses = db.getResponses(attemptId);
      const evidence = db.getEvidence(attemptId);

      const evaluation = await ai.evaluateAttempt(attempt.case_title, responses, evidence);

      // Save evaluation to database
      const saved = db.saveEvaluation({
        attemptId,
        overallRating: evaluation.overall_rating,
        assessments: evaluation.assessments.map(a => ({
          competencyId: a.competency_id,
          rating: a.rating,
          evidenceIds: evidence.filter(e => e.competency === a.competency_id).map(e => e.evidenceId),
          evidenceCoverage: a.evidence_coverage,
          confidence: a.confidence,
          recommendation: a.recommendation,
        })),
        feedback: evaluation.feedback.map(f => ({
          type: f.type,
          observation: f.observation,
          whyItMattered: f.why_it_mattered,
          whatShouldChange: f.what_should_change,
          competencyId: f.competency_id,
          evidenceIds: evidence.filter(e => e.competency === f.competency_id).map(e => e.evidenceId),
        })),
        practiceExercise: evaluation.practice_exercise ? {
          targetGap: evaluation.practice_exercise.target_gap,
          exercisePrompt: evaluation.practice_exercise.exercise_prompt,
          framework: evaluation.practice_exercise.framework,
          frameworkLabel: evaluation.practice_exercise.framework_label,
          successCondition: evaluation.practice_exercise.success_condition,
          evaluationCriteria: evaluation.practice_exercise.evaluation_criteria,
          expectedBehavior: evaluation.practice_exercise.expected_behavior,
        } : null,
      });

      db.recordEvent(attempt.session_id, 'feedback_viewed', { attemptId });

      sendJson(res, saved);
      return true;
    }

    // 10. GET /api/interviews/:id/evaluation
    const getEvalMatch = pathname.match(/^\/api\/interviews\/([^/]+)\/evaluation$/);
    if (getEvalMatch && req.method === 'GET') {
      const attemptId = getEvalMatch[1];
      const evaluation = db.getEvaluation(attemptId);
      if (!evaluation) {
        sendJson(res, { error: 'Evaluation not found' }, 404);
        return true;
      }
      sendJson(res, evaluation);
      return true;
    }

    // 11. POST /api/interviews/:id/insight (Save understanding event)
    const insightMatch = pathname.match(/^\/api\/interviews\/([^/]+)\/insight$/);
    if (insightMatch && req.method === 'POST') {
      const attemptId = insightMatch[1];
      const attempt = db.getAttempt(attemptId);
      if (!attempt) {
        sendJson(res, { error: 'Attempt not found' }, 404);
        return true;
      }

      const body = await parseJsonBody(req);
      const insightText = (body.insightText || '').trim();

      db.updateSession(attempt.session_id, {
        insight_text: insightText,
        insight_confirmed: 1,
      });

      db.recordEvent(attempt.session_id, 'insight_confirmed', {
        attemptId,
        insightText,
      });

      sendJson(res, { success: true, insightText, insightConfirmed: true });
      return true;
    }

    // 12. GET /api/interviews/:id/practice
    const getPracticeMatch = pathname.match(/^\/api\/interviews\/([^/]+)\/practice$/);
    if (getPracticeMatch && req.method === 'GET') {
      const attemptId = getPracticeMatch[1];
      const evaluation = db.getEvaluation(attemptId);
      sendJson(res, { practiceExercise: evaluation?.practiceExercise || null });
      return true;
    }

    // 13. POST /api/interviews/:id/practice (Submit practice speech / text)
    const postPracticeMatch = pathname.match(/^\/api\/interviews\/([^/]+)\/practice$/);
    if (postPracticeMatch && req.method === 'POST') {
      const attemptId = postPracticeMatch[1];
      const attempt = db.getAttempt(attemptId);
      if (!attempt) {
        sendJson(res, { error: 'Attempt not found' }, 404);
        return true;
      }

      const body = await parseJsonBody(req);
      const responseText = (body.responseText || '').trim();
      const evaluation = db.getEvaluation(attemptId);
      const exercise = evaluation?.practiceExercise;

      if (!exercise) {
        sendJson(res, { error: 'Practice exercise not found' }, 404);
        return true;
      }

      const evalResult = await ai.evaluatePracticeResponse(exercise, responseText);
      const savedResp = db.savePracticeResponse({
        attemptId,
        exerciseId: exercise.id,
        text: responseText,
        met: evalResult.met,
        metCriteria: evalResult.met_criteria || [],
      });

      db.recordEvent(attempt.session_id, 'practice_completed', {
        attemptId,
        met: evalResult.met,
      });

      sendJson(res, {
        evaluation: evalResult,
        practiceResponse: savedResp,
      });
      return true;
    }

    // 14. POST /api/reattempts (Start comparable attempt 2)
    if (pathname === '/api/reattempts' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const sessionId = body.sessionId;
      const domain = body.domain || 'saas';

      const session = db.getSession(sessionId);
      if (!session) {
        sendJson(res, { error: 'Session not found' }, 404);
        return true;
      }

      const caseData = getCase(domain, 2);
      const attempt2 = db.createAttempt({
        sessionId,
        attemptNumber: 2,
        caseId: caseData.id,
        caseTitle: caseData.title,
        casePrompt: caseData.prompt,
        domain,
      });

      db.recordEvent(sessionId, 'reattempt_started', {
        attemptId: attempt2.id,
        domain,
        caseId: caseData.id,
      });

      const initialPrompt = `${caseData.prompt}\n\n${COMPETENCY_PROMPTS.problem_framing}`;
      const transcript = db.addTranscript({
        attemptId: attempt2.id,
        speaker: 'interviewer',
        text: initialPrompt,
        competencyId: 'problem_framing',
      });

      sendJson(res, {
        attempt: attempt2,
        case: caseData,
        initialQuestion: initialPrompt,
        transcripts: [transcript],
      });
      return true;
    }

    // 15. GET /api/attempts/:id/comparison
    const compMatch = pathname.match(/^\/api\/attempts\/([^/]+)\/comparison$/);
    if (compMatch && req.method === 'GET') {
      const attemptId = compMatch[1];
      const attempt2 = db.getAttempt(attemptId);
      if (!attempt2) {
        sendJson(res, { error: 'Attempt 2 not found' }, 404);
        return true;
      }

      const session = db.getSession(attempt2.session_id);
      if (!session || !session.attempt1_id) {
        sendJson(res, { error: 'Attempt 1 not found in session' }, 404);
        return true;
      }

      const attempt1 = db.getAttempt(session.attempt1_id);
      const eval1 = db.getEvaluation(session.attempt1_id);
      const eval2 = db.getEvaluation(attempt2.id);

      const responses1 = db.getResponses(session.attempt1_id);
      const responses2 = db.getResponses(attempt2.id);

      const comparison = await ai.compareAttempts(
        {
          caseTitle: attempt1.case_title,
          overallRating: eval1?.overallRating || 2,
          assessments: eval1?.assessments || [],
          responses: responses1,
          practiceGoal: eval1?.practiceExercise?.targetGap || 'Premature solution selection',
        },
        {
          caseTitle: attempt2.case_title,
          overallRating: eval2?.overallRating || 3,
          assessments: eval2?.assessments || [],
          responses: responses2,
        }
      );

      const savedComp = db.saveComparison({
        sessionId: session.id,
        attempt1Id: session.attempt1_id,
        attempt2Id: attempt2.id,
        competencyDeltas: comparison.competency_deltas,
        behavioralChanges: comparison.behavioral_changes,
        overallDelta: comparison.overall_delta,
        addressedPracticeGoal: comparison.addressed_practice_goal,
        summary: comparison.summary,
      });

      db.recordEvent(session.id, 'reattempt_completed', {
        attempt1Id: session.attempt1_id,
        attempt2Id: attempt2.id,
      });

      sendJson(res, {
        comparison: savedComp,
        attempt1: {
          id: attempt1.id,
          overallRating: eval1?.overallRating || 2,
          caseTitle: attempt1.case_title,
          assessments: eval1?.assessments || [],
          practiceExercise: eval1?.practiceExercise,
        },
        attempt2: {
          id: attempt2.id,
          overallRating: eval2?.overallRating || 3,
          caseTitle: attempt2.case_title,
          assessments: eval2?.assessments || [],
        },
      });
      return true;
    }

    // 16. POST /api/feedback/:id/dispute (Save disputed feedback)
    const disputeMatch = pathname.match(/^\/api\/feedback\/([^/]+)\/dispute$/);
    if (disputeMatch && req.method === 'POST') {
      const feedbackId = disputeMatch[1];
      const success = db.disputeFeedbackItem(feedbackId);
      db.recordEvent(null, 'feedback_disputed', { feedbackId });
      sendJson(res, { success, feedback_disputed: true });
      return true;
    }

    // 17. POST /api/events (Analytics tracker)
    if (pathname === '/api/events' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const event = db.recordEvent(body.sessionId || null, body.eventType || 'unknown', body.metadata || {});
      sendJson(res, { success: true, event });
      return true;
    }

    return false;
  } catch (err: any) {
    sendJson(res, { error: err.message || 'Internal server error' }, 500);
    return true;
  }
}
