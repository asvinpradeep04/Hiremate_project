import type { CasePrompt, Domain, InterviewTrack, QuestionType } from '@/types';

export const CASES: CasePrompt[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. CORE PM: Product Sense / Design
  // ─────────────────────────────────────────────────────────────
  {
    id: 'core_product_sense_1',
    title: 'Designing a Collaborative Financial Health Hub for Gen-Z',
    prompt:
      'You are a Product Manager at a consumer fintech app with 3M active users. While transaction volume is healthy, Gen-Z users struggle to build sustainable savings habits and abandon the app after payday. Leadership wants to design a social/collaborative financial health feature. Apply the CIRCLES method to walk me through your target persona, acute pain points, prioritized solutions, and MVP tradeoffs.',
    domain: 'fintech',
    difficulty: 'Mid-Level PM',
    track: 'core_pm',
    questionType: 'product_sense',
    competencies: ['problem_framing', 'user_understanding', 'prioritization_tradeoffs', 'metrics_measurement'],
  },
  {
    id: 'core_product_sense_2',
    title: 'Designing an Asynchronous Collaboration Experience for Remote Teams',
    prompt:
      'You are a Product Manager at a B2B SaaS productivity suite. Distributed global teams report severe meeting fatigue and timezone friction. Leadership wants an asynchronous video/audio work-in-progress check-in experience. Walk me through how you would frame the problem, define distinct user personas, prioritize solutions, and measure success.',
    domain: 'saas',
    difficulty: 'Mid-Level PM',
    track: 'core_pm',
    questionType: 'product_sense',
    competencies: ['problem_framing', 'user_understanding', 'prioritization_tradeoffs', 'metrics_measurement'],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. CORE PM: Analytical & Metrics
  // ─────────────────────────────────────────────────────────────
  {
    id: 'core_analytical_metrics_1',
    title: 'Diagnosing a 18% Onboarding Funnel Conversion Drop in Marketplace',
    prompt:
      'You are the PM for Marketplace Liquidity. Over the last 14 days, new seller onboarding completion dropped by 18%, while top-of-funnel visitor traffic remained flat. The executive team is alarmed. Using a structured MECE root-cause diagnostic framework and the GAME methodology, how would you triage this drop, identify the cause, and define ongoing guardrail metrics?',
    domain: 'marketplace',
    difficulty: 'Mid to Senior PM',
    track: 'core_pm',
    questionType: 'analytical_metrics',
    competencies: ['metrics_measurement', 'problem_framing', 'prioritization_tradeoffs'],
  },
  {
    id: 'core_analytical_metrics_2',
    title: 'Defining the Metric Architecture & Guardrails for Short-Form Video',
    prompt:
      'You are the Growth PM for a short-form video streaming platform. The engineering team is launching a new algorithm that maximizes average watch time. Leadership wants a comprehensive metric framework. Walk me through your North Star metric, leading indicators, and critical ecosystem guardrail counter-metrics (such as user churn, ad fatigue, and content diversity).',
    domain: 'consumer',
    difficulty: 'Mid to Senior PM',
    track: 'core_pm',
    questionType: 'analytical_metrics',
    competencies: ['metrics_measurement', 'prioritization_tradeoffs', 'problem_framing'],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. CORE PM: Product Strategy
  // ─────────────────────────────────────────────────────────────
  {
    id: 'core_product_strategy_1',
    title: 'Enterprise Platform Defensibility & Moat Strategy against Big Tech',
    prompt:
      'You are the Principal PM for Product Strategy at an independent team collaboration SaaS (similar to Slack or Notion). A major cloud incumbent has announced they will bundle a competing tool for free into their enterprise software licenses. Walk me through your strategic evaluation using Porter’s 5 Forces, 3 Horizons, and defensive moat analysis (switching costs, network effects, and counter-positioning).',
    domain: 'saas',
    difficulty: 'Senior to Lead PM',
    track: 'core_pm',
    questionType: 'product_strategy',
    competencies: ['product_strategy', 'prioritization_tradeoffs', 'problem_framing'],
  },
  {
    id: 'core_product_strategy_2',
    title: 'Evaluating New Market Expansion & Vertical Integration in Fintech',
    prompt:
      'You are Head of Strategy at a B2B merchant payment gateway. The company is evaluating whether to build its own buy-now-pay-later (BNPL) lending balance sheet, partner with an established bank, or acquire a specialized credit startup. How would you evaluate the market opportunity, unit economics, regulatory risk, and strategic alignment?',
    domain: 'fintech',
    difficulty: 'Senior to Lead PM',
    track: 'core_pm',
    questionType: 'product_strategy',
    competencies: ['product_strategy', 'prioritization_tradeoffs', 'metrics_measurement'],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. CORE PM: Guesstimates & Market Sizing
  // ─────────────────────────────────────────────────────────────
  {
    id: 'core_guesstimates_1',
    title: 'Estimating Server Storage Capacity for Global Short Video Uploads',
    prompt:
      'You are a Technical Product Manager at a global video platform. Engineering is budgeting infrastructure for the upcoming fiscal year. Estimate the total petabytes of cloud storage required to store all user-uploaded short videos globally every 24 hours. Walk me through your formula, population assumptions, video bitrate/duration parameters, and run a sanity check on your final number.',
    domain: 'general',
    difficulty: 'All PM Levels',
    track: 'core_pm',
    questionType: 'guesstimates',
    competencies: ['guesstimates', 'metrics_measurement', 'problem_framing'],
  },
  {
    id: 'core_guesstimates_2',
    title: 'Estimating the US Market Size for Autonomous AI Coding Assistants',
    prompt:
      'You are evaluating a new venture investment or product line in developer tools. Estimate the Total Addressable Market (TAM) in annual recurring revenue (ARR) for AI-powered coding companions in the United States. Walk through your top-down or bottom-up segmentation, pricing tier assumptions, developer population sizing, and sensitivity analysis.',
    domain: 'saas',
    difficulty: 'All PM Levels',
    track: 'core_pm',
    questionType: 'guesstimates',
    competencies: ['guesstimates', 'product_strategy', 'metrics_measurement'],
  },

  // ─────────────────────────────────────────────────────────────
  // 5. CORE PM: Execution & Prioritization
  // ─────────────────────────────────────────────────────────────
  {
    id: 'core_execution_1',
    title: 'Managing Launch Blocker Trade-offs and Engineering Debt',
    prompt:
      'You are two weeks away from GA launch for a mission-critical checkout redesign. QA identifies a 3% latency regression and a 1.5% transaction failure rate on older mobile devices. Meanwhile, Marketing has spent $500k on committed launch campaigns. Walk me through your triage framework, stakeholder communication, RICE prioritization of fixes, and go/no-go rollback criteria.',
    domain: 'fintech',
    difficulty: 'Mid to Senior PM',
    track: 'core_pm',
    questionType: 'execution_prioritization',
    competencies: ['execution_prioritization', 'prioritization_tradeoffs', 'metrics_measurement'],
  },
  {
    id: 'core_execution_2',
    title: 'Quarterly Roadmap Prioritization Under 40% Bandwidth Constraints',
    prompt:
      'Your engineering lead informs you that 40% of next quarter’s capacity must be diverted to mandatory database compliance and security migrations. You have 8 high-priority feature requests from Enterprise Sales, Product Growth, and Customer Support. How do you apply RICE, sequence dependencies, manage stakeholder expectations, and protect product velocity?',
    domain: 'saas',
    difficulty: 'Mid to Senior PM',
    track: 'core_pm',
    questionType: 'execution_prioritization',
    competencies: ['execution_prioritization', 'prioritization_tradeoffs', 'problem_framing'],
  },

  // ─────────────────────────────────────────────────────────────
  // 6. AI PM: AI Product Sense & Guardrails
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ai_product_sense_1',
    title: 'Designing an Autonomous AI Clinical Documentation Assistant',
    prompt:
      'You are the Lead AI PM at a healthcare healthtech company. You are designing an ambient AI copilot that listens to doctor-patient conversations and automatically drafts EHR clinical notes and prescription orders. Doctors are time-constrained and patient safety is paramount. Walk me through your probabilistic UX design, confidence threshold routing, human-in-the-loop (HITL) confirmation flows, and hallucination containment guardrails.',
    domain: 'ai_tech',
    difficulty: 'AI PM / Senior AI PM',
    track: 'ai_pm',
    questionType: 'ai_product_sense',
    competencies: ['ai_product_sense', 'evaluation_systems', 'ai_behavioral_ethics'],
  },
  {
    id: 'ai_product_sense_2',
    title: 'Designing an Agentic Customer Resolution Assistant with Probabilistic UX',
    prompt:
      'You are the AI PM building an autonomous customer support agent for an airline. The agent has permissions to issue refunds, rebook cancelled flights, and modify reservations. How do you design the user experience when model confidence is low, handle latency during multi-tool execution, and ensure customers never feel trapped in an unhelpful AI loop?',
    domain: 'ai_tech',
    difficulty: 'AI PM / Senior AI PM',
    track: 'ai_pm',
    questionType: 'ai_product_sense',
    competencies: ['ai_product_sense', 'technical_architecture', 'evaluation_systems'],
  },

  // ─────────────────────────────────────────────────────────────
  // 7. AI PM: Technical & Architecture Depth
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ai_tech_arch_1',
    title: 'Architecting an Enterprise RAG Pipeline over Millions of Heterogeneous Docs',
    prompt:
      'You are the Technical AI PM building an enterprise knowledge intelligence assistant querying 5M+ confidential documents (PDFs, Notion pages, Slack threads, SQL schemas). Walk me through your technical architecture decisions: RAG vs fine-tuning, embedding model selection, semantic vs hybrid search, chunking strategies, vector database caching, and serving latency budgets (<800ms TTFT).',
    domain: 'ai_tech',
    difficulty: 'Technical AI PM',
    track: 'ai_pm',
    questionType: 'technical_architecture',
    competencies: ['technical_architecture', 'evaluation_systems', 'ai_product_sense'],
  },
  {
    id: 'ai_tech_arch_2',
    title: 'Optimizing Model Serving Latency vs Inference Cost for Realtime Voice Agents',
    prompt:
      'Your conversational voice AI agent currently suffers from an end-to-end response latency of 2.6 seconds (Speech-to-Text → LLM reasoning → Text-to-Speech), causing awkward conversational overlap. The target latency is under 600ms. Deconstruct the latency budget across the stack. What architectural trade-offs (speculative decoding, model quantization, edge vs cloud, streaming tokens) would you make?',
    domain: 'ai_tech',
    difficulty: 'Technical AI PM',
    track: 'ai_pm',
    questionType: 'technical_architecture',
    competencies: ['technical_architecture', 'prioritization_tradeoffs', 'metrics_measurement'],
  },

  // ─────────────────────────────────────────────────────────────
  // 8. AI PM: Evaluation Systems (Evals)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ai_evals_1',
    title: 'Building a Multi-Tier Continuous Evaluation Pipeline for Code Generation',
    prompt:
      'You are the AI PM leading the model evaluation team for an AI developer copilot. The engineering team frequently updates prompts, fine-tuned weights, and system instructions. How do you build a multi-tier eval pipeline (deterministic syntax/lint checks, LLM-as-a-judge rubrics, curated golden benchmark suites, and live user acceptance telemetry) to catch hallucinations and prevent regressions before shipping to production?',
    domain: 'ai_tech',
    difficulty: 'AI PM / Lead AI PM',
    track: 'ai_pm',
    questionType: 'evaluation_systems',
    competencies: ['evaluation_systems', 'technical_architecture', 'ai_product_sense'],
  },
  {
    id: 'ai_evals_2',
    title: 'Evaluating RAG Pipeline Accuracy and Calibrating LLM-as-a-Judge',
    prompt:
      'Your enterprise search RAG product is receiving user complaints about outdated answers. How do you implement the RAG Triad framework (Context Relevance, Groundedness, and Answer Relevance)? How do you calibrate your LLM-as-a-judge prompt to ensure it correlates with domain-expert human annotators (e.g. measuring Cohen’s Kappa or F1 correlation)?',
    domain: 'ai_tech',
    difficulty: 'AI PM / Lead AI PM',
    track: 'ai_pm',
    questionType: 'evaluation_systems',
    competencies: ['evaluation_systems', 'metrics_measurement', 'ai_product_sense'],
  },

  // ─────────────────────────────────────────────────────────────
  // 9. AI PM: AI Behavioral & Ethics
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ai_ethics_1',
    title: 'Auditing and Mitigating Algorithmic Bias in Automated Credit Underwriting',
    prompt:
      'You are the Product Manager for an AI credit-decisioning system. During internal validation, the data science team discovers the model has a 14% lower loan pre-approval rate for applicants from certain zip codes, despite equivalent income and credit history. Walk me through your responsible AI audit framework, PII masking protocols, bias mitigation techniques, and regulatory compliance strategy (e.g. Fair Housing Act / EU AI Act).',
    domain: 'fintech',
    difficulty: 'Senior / AI PM',
    track: 'ai_pm',
    questionType: 'ai_behavioral_ethics',
    competencies: ['ai_behavioral_ethics', 'problem_framing', 'metrics_measurement'],
  },
  {
    id: 'ai_ethics_2',
    title: 'Handling Jailbreaks, PII Leakage, and Sycophancy in Enterprise AI',
    prompt:
      'An enterprise generative AI assistant is found to be vulnerable to indirect prompt injection (e.g. malicious instructions embedded inside processed emails) and exhibits sycophancy (agreeing with dangerous user assumptions to be helpful). Walk me through your layered safety guardrails, PII redaction architecture, and your incident escalation response.',
    domain: 'ai_tech',
    difficulty: 'AI PM / Senior AI PM',
    track: 'ai_pm',
    questionType: 'ai_behavioral_ethics',
    competencies: ['ai_behavioral_ethics', 'ai_product_sense', 'technical_architecture'],
  },
];

// ─── Case Lookup Helpers ───

export function getCaseForTrackAndType(
  domain: Domain,
  attempt: 1 | 2,
  track?: InterviewTrack,
  questionType?: QuestionType
): CasePrompt {
  // 1. If a specific questionType is requested
  if (questionType && questionType !== 'all') {
    const typeCases = CASES.filter((c) => c.questionType === questionType);
    if (typeCases.length > 0) {
      const idx = Math.min(attempt - 1, typeCases.length - 1);
      return typeCases[idx];
    }
  }

  // 2. If an AI PM track is requested
  if (track === 'ai_pm') {
    const aiCases = CASES.filter((c) => c.track === 'ai_pm');
    if (aiCases.length > 0) {
      const idx = Math.min(attempt - 1, aiCases.length - 1);
      return aiCases[idx];
    }
  }

  // 3. If a Core PM track is requested
  if (track === 'core_pm') {
    const coreCases = CASES.filter((c) => c.track === 'core_pm' && (c.domain === domain || domain === 'general'));
    if (coreCases.length > 0) {
      const idx = Math.min(attempt - 1, coreCases.length - 1);
      return coreCases[idx];
    }
  }

  // 4. Domain match
  const domainCases = CASES.filter((c) => c.domain === domain);
  if (domainCases.length >= attempt) {
    return domainCases[attempt - 1];
  }

  // 5. Fallback to general or first case
  return CASES[attempt - 1] || CASES[0];
}

export function getCaseForDomain(domain: Domain, attempt: 1 | 2): CasePrompt {
  return getCaseForTrackAndType(domain, attempt);
}
