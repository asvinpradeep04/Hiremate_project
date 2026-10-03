import type {
  Competency,
  CompetencyId,
  CompetencyRubric,
  Rating,
  QuestionTypeDefinition,
} from '@/types';

// ─── Complete Competencies Catalog (Core PM + AI PM) ───

export const COMPETENCIES: Competency[] = [
  // ─── Core PM Competencies ───
  {
    id: 'problem_framing',
    name: 'Problem Framing & CIRCLES',
    shortName: 'Framing',
    description: 'Defines ambiguous user problem before proposing solutions using structured inquiry',
    icon: 'Target',
  },
  {
    id: 'user_understanding',
    name: 'User Personas & JTBD',
    shortName: 'Users',
    description: 'Identifies acute user segment pain points, motivations, and behavioral drop-offs',
    icon: 'Users',
  },
  {
    id: 'prioritization_tradeoffs',
    name: 'Prioritization & Trade-offs',
    shortName: 'Trade-offs',
    description: 'Compares options systematically and articulates trade-off criteria',
    icon: 'Scale',
  },
  {
    id: 'metrics_measurement',
    name: 'Analytical & Metrics (GAME)',
    shortName: 'Metrics',
    description: 'Defines North Star, secondary diagnostics, and ecosystem guardrail metrics',
    icon: 'BarChart3',
  },
  {
    id: 'product_strategy',
    name: 'Product Strategy & Moats',
    shortName: 'Strategy',
    description: 'Evaluates long-term defensibility, 3-horizon bets, and competitive platform flywheels',
    icon: 'Compass',
  },
  {
    id: 'guesstimates',
    name: 'Guesstimates & Market Sizing',
    shortName: 'Guesstimates',
    description: 'Deconstructs quantitative uncertainty with MECE top-down/bottom-up Fermi estimation',
    icon: 'Calculator',
  },
  {
    id: 'execution_prioritization',
    name: 'Execution & Prioritization',
    shortName: 'Execution',
    description: 'Navigates engineering trade-offs, roadmap blockers, RICE ranking, and rollback plans',
    icon: 'Sliders',
  },

  // ─── AI PM Competencies ───
  {
    id: 'ai_product_sense',
    name: 'AI Product Sense & Guardrails',
    shortName: 'AI Sense',
    description: 'Designs probabilistic UX, human-in-the-loop escalation, and trust/safety boundaries',
    icon: 'Sparkles',
  },
  {
    id: 'technical_architecture',
    name: 'Technical & Architecture Depth',
    shortName: 'AI Arch',
    description: 'Evaluates RAG vs fine-tuning, latency/token budgets, context windows, and vector retrieval',
    icon: 'Cpu',
  },
  {
    id: 'evaluation_systems',
    name: 'Evaluation Systems (Evals)',
    shortName: 'Evals',
    description: 'Establishes multi-tier evals (LLM-as-a-judge, RAG triad, golden benchmarks, CI/CD)',
    icon: 'CheckSquare',
  },
  {
    id: 'ai_behavioral_ethics',
    name: 'AI Behavioral & Ethics',
    shortName: 'AI Ethics',
    description: 'Identifies algorithmic bias, IP/PII exposure, sycophancy, and dual-use safety risks',
    icon: 'ShieldCheck',
  },
];

// ─── Rubrics per Competency ───

export const RUBRIC: Record<CompetencyId, CompetencyRubric> = {
  problem_framing: {
    competency: 'problem_framing',
    levels: [
      {
        rating: 1,
        label: 'Emerging',
        description: 'Jumps straight into feature ideas with zero definition of user context or root problem.',
      },
      {
        rating: 2,
        label: 'Developing',
        description: 'Identifies a broad problem area but lacks specificity, constraints, or boundary validation.',
      },
      {
        rating: 3,
        label: 'Solid',
        description: 'Defines target user, root friction, clear outcome goal, and explicitly checks key assumptions.',
      },
      {
        rating: 4,
        label: 'Strong',
        description: 'Elite boundary framing: separates symptoms from causes, establishes constraints, and applies CIRCLES rigour.',
      },
    ],
  },
  user_understanding: {
    competency: 'user_understanding',
    levels: [
      {
        rating: 1,
        label: 'Emerging',
        description: 'Speaks of "users" generically without segmenting motivations or behavioral stages.',
      },
      {
        rating: 2,
        label: 'Developing',
        description: 'Names a user segment but relies on superficial demographics rather than acute JTBD friction.',
      },
      {
        rating: 3,
        label: 'Solid',
        description: 'Identifies a clear persona, details experiential drop-offs, and connects problem to workflow triggers.',
      },
      {
        rating: 4,
        label: 'Strong',
        description: 'Paints vivid persona behaviors, quantifies emotional and functional jobs-to-be-done with grounded empathy.',
      },
    ],
  },
  prioritization_tradeoffs: {
    competency: 'prioritization_tradeoffs',
    levels: [
      {
        rating: 1,
        label: 'Emerging',
        description: 'Proposes a single static option without considering alternatives, costs, or tradeoffs.',
      },
      {
        rating: 2,
        label: 'Developing',
        description: 'Mentions alternatives briefly but fails to provide structured criteria for why one was selected.',
      },
      {
        rating: 3,
        label: 'Solid',
        description: 'Compares options against reach, effort, and risk; articulates clear trade-offs and rationale.',
      },
      {
        rating: 4,
        label: 'Strong',
        description: 'Multidimensional evaluation matrix: defensible trade-offs, edge-case mitigation, and resource leverage.',
      },
    ],
  },
  metrics_measurement: {
    competency: 'metrics_measurement',
    levels: [
      {
        rating: 1,
        label: 'Emerging',
        description: 'Fails to define measurable success or only offers vague vanity numbers (e.g. "more users").',
      },
      {
        rating: 2,
        label: 'Developing',
        description: 'Names generic KPIs (DAU/MAU) without connecting them to feature adoption or root customer value.',
      },
      {
        rating: 3,
        label: 'Solid',
        description: 'Applies GAME framework: primary North Star, leading indicators, and explicit guardrail counter-metrics.',
      },
      {
        rating: 4,
        label: 'Strong',
        description: 'Comprehensive metric architecture: primary driver, secondary diagnostics, cannibalization guardrails, and instrumentation.',
      },
    ],
  },
  product_strategy: {
    competency: 'product_strategy',
    levels: [
      {
        rating: 1,
        label: 'Emerging',
        description: 'Treats strategy as a tactical feature roadmap; ignores market dynamics, competition, and defensibility.',
      },
      {
        rating: 2,
        label: 'Developing',
        description: 'Acknowledges competitors but lacks a clear moat, differentiation thesis, or economic rationale.',
      },
      {
        rating: 3,
        label: 'Solid',
        description: 'Articulates competitive positioning, flywheel dynamics, and sustainable moats (network effects, switching costs).',
      },
      {
        rating: 4,
        label: 'Strong',
        description: 'Executive-grade strategic synthesis: 3-horizon allocation, ecosystem leverage, build vs buy, and counter-positioning.',
      },
    ],
  },
  guesstimates: {
    competency: 'guesstimates',
    levels: [
      {
        rating: 1,
        label: 'Emerging',
        description: 'Guesses a final number randomly without structuring the math or breaking down variables.',
      },
      {
        rating: 2,
        label: 'Developing',
        description: 'Attempts a formula but gets lost in arithmetic, double-counts segments, or fails to sanity-check.',
      },
      {
        rating: 3,
        label: 'Solid',
        description: 'Uses clear top-down or bottom-up MECE breakdown, rational benchmark assumptions, and checks boundary limits.',
      },
      {
        rating: 4,
        label: 'Strong',
        description: 'Flawless Fermi architecture: states assumptions crisply, segments appropriately, runs sensitivity checks, and interprets business meaning.',
      },
    ],
  },
  execution_prioritization: {
    competency: 'execution_prioritization',
    levels: [
      {
        rating: 1,
        label: 'Emerging',
        description: 'Panics under resource constraints; cannot sequence dependencies or establish rollback criteria.',
      },
      {
        rating: 2,
        label: 'Developing',
        description: 'Sequences items but struggles to balance engineering debt, regulatory blockers, and stakeholder conflicts.',
      },
      {
        rating: 3,
        label: 'Solid',
        description: 'Applies RICE/MoSCoW framework, defines MVP scope, plans for launch blockers, and sets go/no-go criteria.',
      },
      {
        rating: 4,
        label: 'Strong',
        description: 'High-velocity execution mastery: triages production crises, establishes graceful degradation, and optimizes cross-functional velocity.',
      },
    ],
  },

  // ─── AI PM Rubric Levels ───
  ai_product_sense: {
    competency: 'ai_product_sense',
    levels: [
      {
        rating: 1,
        label: 'Emerging',
        description: 'Treats AI as a magic black box; assumes 100% deterministic accuracy with no fallback design.',
      },
      {
        rating: 2,
        label: 'Developing',
        description: 'Recognizes model fallibility but provides weak UX mitigations when hallucinations or high latency occur.',
      },
      {
        rating: 3,
        label: 'Solid',
        description: 'Designs probabilistic UX: confidence-tier routing, human-in-the-loop confirmations, and graceful fallback.',
      },
      {
        rating: 4,
        label: 'Strong',
        description: 'State-of-the-art AI product design: proactive friction discovery, steerability controls, trust calibration, and safety guardrails.',
      },
    ],
  },
  technical_architecture: {
    competency: 'technical_architecture',
    levels: [
      {
        rating: 1,
        label: 'Emerging',
        description: 'Cannot articulate difference between prompting, RAG, and fine-tuning; ignores latency and token cost economics.',
      },
      {
        rating: 2,
        label: 'Developing',
        description: 'Knows buzzwords (embeddings, vector DBs) but cannot evaluate technical trade-offs between speed, cost, and accuracy.',
      },
      {
        rating: 3,
        label: 'Solid',
        description: 'Makes principled architecture choices: RAG vs Fine-tuning decision matrix, chunking strategies, and TTFT/cost budgets.',
      },
      {
        rating: 4,
        label: 'Strong',
        description: 'Deep technical leadership: agentic loops, tool calling protocols, model quantization, hybrid search, and distributed serving limits.',
      },
    ],
  },
  evaluation_systems: {
    competency: 'evaluation_systems',
    levels: [
      {
        rating: 1,
        label: 'Emerging',
        description: 'Evaluates models solely by "eyeballing" a couple prompts manually; no systematic test dataset.',
      },
      {
        rating: 2,
        label: 'Developing',
        description: 'Relies solely on standard academic benchmarks (MMLU) rather than domain-specific test suites.',
      },
      {
        rating: 3,
        label: 'Solid',
        description: 'Implements multi-tier eval stack: LLM-as-a-judge, RAG triad (relevance, groundedness), and curated golden sets.',
      },
      {
        rating: 4,
        label: 'Strong',
        description: 'Continuous CI/CD eval pipeline: automated regression alerts, human annotator calibration, edit-distance telemetry, and safety gates.',
      },
    ],
  },
  ai_behavioral_ethics: {
    competency: 'ai_behavioral_ethics',
    levels: [
      {
        rating: 1,
        label: 'Emerging',
        description: 'Ignores bias, data leakage, copyright, or safety issues; dismisses ethical concerns as purely legal issues.',
      },
      {
        rating: 2,
        label: 'Developing',
        description: 'Acknowledges bias or PII risks but proposes superficial disclaimers rather than systemic pipeline controls.',
      },
      {
        rating: 3,
        label: 'Solid',
        description: 'Integrates Responsible AI governance: PII redaction, bias auditing, alignment mitigation, and incident escalation paths.',
      },
      {
        rating: 4,
        label: 'Strong',
        description: 'Pioneering ethical AI governance: dual-use risk containment, alignment fine-tuning, adversarial jailbreak defense, and compliance (EU AI Act).',
      },
    ],
  },
};

// ─── Comprehensive Question Types & Frameworks Catalog ───

export const QUESTION_TYPES_CATALOG: QuestionTypeDefinition[] = [
  // ─── Core PM Types ───
  {
    id: 'product_sense',
    track: 'core_pm',
    title: 'Product Sense & Design',
    shortTitle: 'Product Sense',
    subtitle: 'From Ambiguous Need to Beloved Experience',
    description: 'Evaluates how you deconstruct broad, ambiguous user problems, segment user behaviors, isolate acute pain points, and craft high-leverage product solutions under real-world constraints.',
    competencyId: 'problem_framing',
    frameworks: [
      {
        name: 'CIRCLES Method',
        acronym: 'CIRCLES',
        summary: 'Gold standard for product design & problem solving.',
        steps: [
          'Comprehend Context (Goals, Constraints, Why now)',
          'Identify Persona (Segment users by acute behaviors)',
          'Report Customer Needs (Prioritize top pain points)',
          'Cut Through Prioritization (Pick the highest-leverage friction)',
          'List Creative Solutions (Brainstorm 3 distinct approaches)',
          'Evaluate Trade-offs (Weigh pros, cons, and feasibility)',
          'Summarize Recommendation (Provide executive synthesis)',
        ],
      },
      {
        name: 'Jobs-to-be-Done (JTBD)',
        acronym: 'JTBD',
        summary: 'Focuses on the functional, emotional, and social job users hire the product to do.',
        steps: ['Core Functional Job', 'Emotional Trigger', 'Current Workaround Friction', 'Desired Outcome State'],
      },
      {
        name: '5 W’s & H Inquiry',
        acronym: '5W1H',
        summary: 'Rapid boundary clarification framework before premature solutioning.',
        steps: ['Who is the user?', 'What is the goal?', 'Why does it matter?', 'When does it occur?', 'Where is the friction?', 'How do we solve it?'],
      },
    ],
    sampleQuestions: [
      'Design a collaborative travel planning experience for multigenerational families.',
      'How would you improve the seller onboarding experience on Airbnb?',
      'Design an ATM experience for elderly or visually impaired users.',
      'Google Maps wants to expand into local weekend activities. What would you build?',
    ],
    interviewerPOV: 'I want to see if the candidate can resist immediately proposing a shiny feature and instead deeply understand the target user, root bottleneck, and strategic boundaries.',
    evaluationSignals: [
      'Clarifies constraints before jumping into solutions',
      'Selects a distinct persona instead of "everyone"',
      'Articulates why existing solutions fail',
      'Weighs feasibility and MVP tradeoffs explicitly',
    ],
    redFlags: [
      'Pitches a gamified leaderboard or AI feature in the first 30 seconds',
      'Treats all users as identical personas',
      'Cannot justify why their solution is superior to simple alternatives',
    ],
  },
  {
    id: 'analytical_metrics',
    track: 'core_pm',
    title: 'Analytical & Metrics',
    shortTitle: 'Metrics & Analytics',
    subtitle: 'Data-Driven Diagnosis & Ecosystem Measurement',
    description: 'Tests your quantitative intuition, metric tree structuring, root-cause triage when key numbers drop, A/B test interpretation, and ecosystem guardrail defense.',
    competencyId: 'metrics_measurement',
    frameworks: [
      {
        name: 'GAME Framework',
        acronym: 'GAME',
        summary: 'End-to-end framework for product metrics definition.',
        steps: [
          'Goals (Align business objective with customer value)',
          'Actions (Map user actions leading to the goal)',
          'Metrics (North Star, primary driver, secondary diagnostics)',
          'Evaluations (Guardrails, counter-metrics, cannibalization checks)',
        ],
      },
      {
        name: 'MECE Metric Root Cause Tree',
        acronym: 'MECE Tree',
        summary: 'Systematically diagnose a sudden metric drop.',
        steps: [
          'Clarify & Validate (Data bug vs seasonal vs global drop)',
          'External Factors (Holidays, competitor action, PR, outage)',
          'Internal Splits (Platform iOS/Android, geo, app version, user tier)',
          'Funnel Decomposition (Metric = Volume × Conversion × Retention)',
          'Actionable Root Cause Hypothesis & Remediation',
        ],
      },
      {
        name: 'AARRR Pirate Funnel',
        acronym: 'AARRR',
        summary: 'Full-lifecycle product health measurement.',
        steps: ['Acquisition', 'Activation', 'Retention', 'Referral', 'Revenue'],
      },
    ],
    sampleQuestions: [
      'Netflix observes a 12% drop in completion rates for 30-minute comedy series. Diagnose why.',
      'What are the North Star and guardrail metrics for Instagram Reels?',
      'Uber rides are up 20% in Chicago, but driver earnings are down 8%. How do you investigate?',
      'How would you evaluate the success of Spotify AI DJ?',
    ],
    interviewerPOV: 'I look for candidates who avoid vanity metrics, pair primary metrics with defensive counter-metrics, and demonstrate rigorous MECE root-cause diagnostic intuition.',
    evaluationSignals: [
      'Connects North Star directly to real user value creation',
      'Defines explicit guardrail counter-metrics to prevent ecosystem harm',
      'Deconstructs metrics into mathematical component trees',
      'Distinguishes statistical significance from practical business impact',
    ],
    redFlags: [
      'Lists 10 random metrics without identifying the primary North Star',
      'Forgets guardrail metrics (e.g. optimizing clicks while unsubscribes skyrocket)',
      'Guesses one isolated cause during a metric drop investigation without MECE structuring',
    ],
  },
  {
    id: 'product_strategy',
    track: 'core_pm',
    title: 'Product Strategy',
    shortTitle: 'Product Strategy',
    subtitle: 'Market Defensibility, Moats & 3-Horizon Bets',
    description: 'Evaluates your long-term business judgment, competitive counter-positioning, platform ecosystem flywheels, monetization model shifts, and build vs buy decisions.',
    competencyId: 'product_strategy',
    frameworks: [
      {
        name: '3 Horizons Framework',
        acronym: '3 Horizons',
        summary: 'Balances core profitability with long-term disruptive bets.',
        steps: [
          'Horizon 1: Defend and extend core revenue engine (Now)',
          'Horizon 2: Build emerging business models and adjacent lines (Next)',
          'Horizon 3: Seed disruptive, asymmetric long-term bets (Future)',
        ],
      },
      {
        name: 'Moat & Flywheel Analysis',
        acronym: 'Moats',
        summary: 'Evaluates durable competitive advantage.',
        steps: [
          'Network Effects (2-sided liquidity, viral sharing)',
          'Switching Costs (Data lock-in, workflow integration)',
          'Scale Economies (Infrastructure cost advantage)',
          'Counter-Positioning (New model competitors cannot copy without hurting core revenue)',
        ],
      },
      {
        name: 'Porter’s 5 Forces for Tech',
        acronym: '5 Forces',
        summary: 'Analyzes industry structure, supplier leverage, and substitution threats.',
        steps: ['Buyer Power', 'Supplier Leverage', 'Threat of Substitutes', 'Barriers to Entry', 'Competitive Rivalry'],
      },
    ],
    sampleQuestions: [
      'Should Shopify launch its own logistics and delivery network, or rely on 3PL partners?',
      'If you were Head of Product at YouTube, how would you respond to TikTok in emerging markets?',
      'How should Slack defend against Microsoft Teams bundled into enterprise Office 365?',
      'Should Duolingo expand into math and music education, or double down on languages?',
    ],
    interviewerPOV: 'I want to see non-obvious business insight, deep understanding of economic flywheels, and the courage to make hard strategic trade-offs rather than doing everything.',
    evaluationSignals: [
      'Analyzes company strengths and distribution advantages realistically',
      'Considers competitor incentives and retaliatory dynamics',
      'Differentiates short-term feature copycats from durable structural moats',
      'Articulates clear strategic tradeoffs (what NOT to do)',
    ],
    redFlags: [
      'Answers strategic questions purely with UI/UX feature ideas',
      'Ignores monetization and unit economic reality',
      'Fails to recognize competitive advantages of platform incumbents',
    ],
  },
  {
    id: 'guesstimates',
    track: 'core_pm',
    title: 'Guesstimates & Sizing',
    shortTitle: 'Guesstimates',
    subtitle: 'Fermi Estimation & Structured Quantitative Reasoning',
    description: 'Tests your comfort with quantitative ambiguity, market sizing, capacity planning, and your ability to structure complex mathematical breakdowns without panicking.',
    competencyId: 'guesstimates',
    frameworks: [
      {
        name: 'Top-Down Fermi Estimation',
        acronym: 'Top-Down',
        summary: 'Breaks down total population or market into target cohorts.',
        steps: [
          'Total Addressable Population (e.g., 330M US / 8B Global)',
          'Demographic Filtering (Age, income, internet penetration)',
          'Household / Device Multiplier',
          'Penetration & Adoption Percentage',
          'Unit Price / Annual Frequency',
        ],
      },
      {
        name: 'Bottom-Up Demand/Supply Modeling',
        acronym: 'Bottom-Up',
        summary: 'Estimates from local operational units and scales upward.',
        steps: [
          'Single Unit Capacity (e.g. seats in a restaurant, hours in a day)',
          'Utilization Rate & Turnover',
          'Operating Days / Hours per Year',
          'Aggregate Fleet / Venue Count',
        ],
      },
      {
        name: 'Sanity Check & Sensitivity Range',
        acronym: 'Sanity Check',
        summary: 'Verifies realism through upper/lower boundary benchmarks.',
        steps: ['Cross-check with known industry benchmarks', 'Vary highest-uncertainty variable by ±30%', 'State executive conclusion'],
      },
    ],
    sampleQuestions: [
      'Estimate the daily storage capacity needed for YouTube Shorts uploaded in 24 hours.',
      'What is the annual market size for AI note-taking applications in the US?',
      'How many electric vehicle charging sessions take place daily in California?',
      'Estimate the total annual revenue of the NYC subway system.',
    ],
    interviewerPOV: 'I care far more about the candidate’s structure, transparency of assumptions, and arithmetic sanity checks than getting the exact decimal place right.',
    evaluationSignals: [
      'States formula upfront before calculating numbers',
      'Uses clean round numbers for frictionless arithmetic',
      'Identifies edge cases and seasonality factors',
      'Sanity-checks the final result against known real-world anchors',
    ],
    redFlags: [
      'Guesses a final number without showing structured breakdown',
      'Gets bogged down in complex mental math without simplifying',
      'Accepts an absurd final number (e.g. trillions for a local market) without sanity checking',
    ],
  },
  {
    id: 'execution_prioritization',
    track: 'core_pm',
    title: 'Execution & Prioritization',
    shortTitle: 'Execution',
    subtitle: 'Navigating Blockers, Crisis Triage & Roadmap Scoping',
    description: 'Tests your day-to-day PM leadership: resolving roadmap conflicts under tight engineering bandwidth, launch risk triage, rollback governance, and MVP scoping.',
    competencyId: 'execution_prioritization',
    frameworks: [
      {
        name: 'RICE Prioritization',
        acronym: 'RICE',
        summary: 'Standard scoring framework for roadmap trade-offs.',
        steps: [
          'Reach (Number of users impacted in time window)',
          'Impact (Massive: 3x, High: 2x, Medium: 1x, Low: 0.5x)',
          'Confidence (Data-backed: 100%, Qualitative: 80%, Guess: 50%)',
          'Effort (Person-months / sprint points)',
          'Score = (Reach × Impact × Confidence) / Effort',
        ],
      },
      {
        name: 'Crisis Triage & Rollback Protocol',
        acronym: 'Triage',
        summary: 'Decision-making during production fires or launch roadblocks.',
        steps: [
          'Severity Assessment & Impact Scope (P0 vs P2)',
          'Immediate Containment (Feature flag disable, rollback)',
          'Root Cause Post-Mortem & Stakeholder Communication',
          'Permanent Systemic Prevention',
        ],
      },
      {
        name: 'MoSCoW Scoping',
        acronym: 'MoSCoW',
        summary: 'Defines crisp release cutlines.',
        steps: ['Must Have (Core value broken without it)', 'Should Have', 'Could Have', 'Won’t Have (Explicitly deferred)'],
      },
    ],
    sampleQuestions: [
      'You are 2 weeks from launching a major checkout redesign, and QA finds a 2% crash rate on older Android devices. What do you do?',
      'Engineering capacity has been cut by 50% next quarter due to infra migration. How do you re-prioritize your roadmap?',
      'Sales demands custom enterprise features, while Design insists on technical debt cleanup. How do you decide?',
      'Define the go / no-go launch criteria for an autonomous order cancellation feature.',
    ],
    interviewerPOV: 'I look for candidates with bias for action, clear prioritization criteria, empathy for engineering trade-offs, and structured crisis communication.',
    evaluationSignals: [
      'Uses objective criteria rather than emotional or political arguments',
      'Defines crisp MVP cutlines and phased release gates',
      'Includes telemetry and rollback contingencies',
      'Communicates clearly with cross-functional stakeholders',
    ],
    redFlags: [
      'Tries to please everyone by squeezing all features in',
      'Ignores engineering debt or architectural constraints',
      'Lacks launch risk containment or rollback plans',
    ],
  },

  // ─── AI PM Types ───
  {
    id: 'ai_product_sense',
    track: 'ai_pm',
    title: 'AI Product Sense & Guardrails',
    shortTitle: 'AI Product Sense',
    subtitle: 'Probabilistic UX, Trust Calibration & HITL Design',
    description: 'Evaluates your ability to build user-facing AI products where models are probabilistic, latency is variable, hallucinations occur, and user trust is fragile.',
    competencyId: 'ai_product_sense',
    frameworks: [
      {
        name: 'Probabilistic UX Hierarchy',
        acronym: 'Probabilistic UX',
        summary: 'Designing for model uncertainty instead of deterministic state.',
        steps: [
          'Confidence Routing: High confidence (>95%) auto-execute, Medium (70-95%) suggest, Low (<70%) ask clarification',
          'Inline Steerability: Allow users to edit, regenerate, or adjust temperature/prompts',
          'Explainability: Highlight source citations and confidence rationale',
          'Graceful Degradation: Fallback to rules/heuristics when model times out or fails',
        ],
      },
      {
        name: 'Human-in-the-Loop (HITL) Protocol',
        acronym: 'HITL',
        summary: 'Balances automation velocity with risk containment.',
        steps: [
          'Low-Stakes: Full automation with user undo',
          'Medium-Stakes: AI drafts, human confirms before sending/publishing',
          'High-Stakes: Human executes, AI acts as asynchronous reviewer/validator',
        ],
      },
      {
        name: 'Safety & Moderation Guardrails',
        acronym: 'Guardrails',
        summary: 'Layered defenses against jailbreaks, hallucinations, and harmful outputs.',
        steps: ['Input Sanitize & PII Masking', 'System Prompt Boundary Enforcement', 'Output Classification Guard', 'Canary Rate-Limiting'],
      },
    ],
    sampleQuestions: [
      'Design an AI clinical note assistant for emergency room doctors. How do you handle hallucinations and latency?',
      'Google Docs wants to add an autonomous AI co-writer. How do you design user trust, undo, and confidence signals?',
      'How would you design a multimodal AI shopping assistant for fashion recommendations?',
      'When should a customer support product use an LLM agent vs traditional deterministic decision trees?',
    ],
    interviewerPOV: 'I want to see if the candidate recognizes that AI is inherently probabilistic. Do they design for failure, manage user trust, and establish clear human-in-the-loop escalation paths?',
    evaluationSignals: [
      'Designs explicit confidence tiers and fallback experiences',
      'Balances generative creativity with strict safety guardrails',
      'Identifies the exact moments where hallucinations cause catastrophic harm',
      'Gives users intuitive control over model steering and corrections',
    ],
    redFlags: [
      'Treats AI like traditional software where accuracy is 100% assumed',
      'No latency management (lets users stare at a blank spinner for 8 seconds)',
      'Ignores high-stakes edge cases where hallucinated data causes regulatory or physical harm',
    ],
  },
  {
    id: 'technical_architecture',
    track: 'ai_pm',
    title: 'Technical & Architecture Depth',
    shortTitle: 'AI Architecture',
    subtitle: 'RAG, Fine-Tuning, Latency Budgets & Vector Pipelines',
    description: 'Assesses your ability to collaborate with ML/AI researchers and engineers: selecting model tiers, structuring RAG pipelines, managing token economics, and designing agent loops.',
    competencyId: 'technical_architecture',
    frameworks: [
      {
        name: 'RAG vs Fine-Tuning vs Prompting Decision Matrix',
        acronym: 'RAG vs FT',
        summary: 'Determines the right technical intervention for a given problem.',
        steps: [
          'Prompt Engineering: Dynamic task instructions on frontier models (Fastest, zero training cost)',
          'RAG (Retrieval-Augmented Generation): Fast-updating knowledge, private enterprise docs, citeable sources',
          'Fine-Tuning: Custom vocabulary, strict tone/format compliance, lower inference latency on smaller open models',
          'Pre-training from scratch: Rare, only for domain-specific foundational modalities',
        ],
      },
      {
        name: 'Latency & Token Budgeting',
        acronym: 'Latency Budget',
        summary: 'Architecting for real-time responsiveness.',
        steps: [
          'Time to First Token (TTFT) vs Generation Throughput (tokens/sec)',
          'Chunking & Semantic Vector Search Latency (<150ms)',
          'Speculative Decoding & Model Quantization (4-bit/8-bit)',
          'Prompt Caching & Edge vs Cloud routing',
        ],
      },
      {
        name: 'Agentic Tool-Use Loops (ReAct / Function Calling)',
        acronym: 'Agent Loops',
        summary: 'Structuring autonomous multi-step reasoning.',
        steps: ['Thought → Tool Call Selection → Observation Validation → Final Response Synthesis'],
      },
    ],
    sampleQuestions: [
      'Architect an enterprise search assistant over 10M internal Notion & Google Drive docs. Walk me through the retrieval and generation pipeline.',
      'How would you choose between fine-tuning an open-source Llama model vs calling GPT-4o / Claude 3.5 via API for a legal contract analysis tool?',
      'Your AI voice assistant has an end-to-end latency of 2.8 seconds, but the target is under 800ms. How do you deconstruct and optimize the pipeline?',
      'How do you design vector database chunking and hybrid search (BM25 + Dense embeddings) for technical developer documentation?',
    ],
    interviewerPOV: 'I want to ensure the AI PM has enough technical depth to push back on engineering estimates, understand cost/latency trade-offs, and make sound architectural bets.',
    evaluationSignals: [
      'Makes crisp, justified choices between RAG and Fine-tuning based on data volatility and latency',
      'Breaks down latency budgets systematically (STT → Vector DB → TTFT → Generation → TTS)',
      'Understands embedding models, chunk size trade-offs, and context window limits',
      'Articulates token cost economics at scale',
    ],
    redFlags: [
      'Suggests fine-tuning a frontier model just to ingest company PDF documents',
      'Ignores token pricing and server compute costs',
      'Cannot explain the difference between semantic vector search and keyword search',
    ],
  },
  {
    id: 'evaluation_systems',
    track: 'ai_pm',
    title: 'Evaluation Systems (Evals)',
    shortTitle: 'AI Evals',
    subtitle: 'Multi-Tier Eval Pyramids, LLM-as-a-Judge & CI/CD Benchmarks',
    description: 'Tests your mastery of measuring AI performance: building domain-specific eval datasets, tracking hallucination and drift, using LLM-as-a-judge with human calibration, and preventing model regressions.',
    competencyId: 'evaluation_systems',
    frameworks: [
      {
        name: 'Multi-Tier Evaluation Pyramid',
        acronym: 'Eval Pyramid',
        summary: 'Layered evaluation stack from fast automated to deep human review.',
        steps: [
          'Tier 1: Deterministic Heuristics (Regex, JSON schema validity, latency, token count, banned terms)',
          'Tier 2: Model-Based Judges (LLM-as-a-judge with calibrated rubrics & few-shot examples)',
          'Tier 3: Offline Golden Benchmark Datasets (Curated 500+ edge-case QA pairs with human ground truth)',
          'Tier 4: Live Telemetry & Implicit Feedback (User thumbs up/down, edit distance, acceptance rate, copy/paste)',
        ],
      },
      {
        name: 'RAG Triad Evaluation',
        acronym: 'RAG Triad',
        summary: 'Isolating root causes of RAG pipeline failures.',
        steps: [
          'Context Relevance: Is the retrieved chunk relevant to user query?',
          'Groundedness: Is the generated answer strictly backed by the context (no hallucination)?',
          'Answer Relevance: Does the generated answer directly solve user query?',
        ],
      },
      {
        name: 'CI/CD Regression Eval Gateways',
        acronym: 'CI/CD Evals',
        summary: 'Automated testing for prompt changes and model upgrades.',
        steps: ['PR prompt diff → Run golden eval suite → Compare delta score → Block deploy if accuracy drops >1%'],
      },
    ],
    sampleQuestions: [
      'How would you build an evaluation pipeline for an AI coding copilot to measure code quality and prevent security vulnerabilities?',
      'You are updating the system prompt of your customer service bot. How do you ensure the change does not cause regressions across edge cases?',
      'How do you calibrate an LLM-as-a-judge to ensure its ratings correlate closely with expert human annotators?',
      'Design an evaluation framework for a medical patient symptom triaging LLM.',
    ],
    interviewerPOV: 'A world-class AI PM lives and dies by their evaluation system. If you cannot measure model quality and regressions rigorously, you cannot ship reliably.',
    evaluationSignals: [
      'Combines automated evals with calibrated human golden sets',
      'Applies the RAG triad to separate retrieval issues from generation hallucinations',
      'Defines task-specific metrics instead of relying on generic BLEU/ROUGE',
      'Builds continuous regression testing into the deployment pipeline',
    ],
    redFlags: [
      'Thinks evaluation just means reading 10 sample outputs manually',
      'Uses LLM-as-a-judge without validating its agreement rate with human experts',
      'Cannot articulate how to detect model drift over time',
    ],
  },
  {
    id: 'ai_behavioral_ethics',
    track: 'ai_pm',
    title: 'AI Behavioral & Ethics',
    shortTitle: 'AI Ethics & Safety',
    subtitle: 'Algorithmic Bias, PII Protection & Dual-Use Governance',
    description: 'Evaluates your ethical judgment and risk management: addressing demographic bias, preventing PII/data leakage, mitigating sycophancy, and handling high-stakes AI safety incidents.',
    competencyId: 'ai_behavioral_ethics',
    frameworks: [
      {
        name: 'Responsible AI Principles & Audit Protocol',
        acronym: 'Responsible AI',
        summary: 'Core ethical tenets for production AI systems.',
        steps: [
          'Fairness & Bias Audit: Stratified testing across demographic, geographic, and socioeconomic cohorts',
          'Privacy & IP Governance: Scrubbing PII, preventing training data extraction, honoring copyright',
          'Transparency & Steerability: Clear disclosures that content is AI-generated, explainable decision factors',
          'Safety & Dual-Use Defense: Preventing malicious exploitation, biological/cyber threats, jailbreaks',
        ],
      },
      {
        name: 'Sycophancy & Alignment Mitigation',
        acronym: 'Alignment',
        summary: 'Preventing the AI from blindly agreeing with user misconceptions or biases.',
        steps: [
          'Reward modeling for truthfulness over user pleasing',
          'Calibration on controversial or factual queries',
          'Safety boundary refusal protocols without sounding preachy',
        ],
      },
      {
        name: 'AI Incident Escalation Framework',
        acronym: 'Incident Response',
        summary: 'Action plan when an AI model causes an ethical or safety breach.',
        steps: ['Immediate Kill-Switch / Rate Throttle → Containment → Patch System Guardrails → Transparent Public Disclosure'],
      },
    ],
    sampleQuestions: [
      'Your AI loan approval model shows a 14% lower approval rate for applicants in minority zip codes despite similar credit scores. How do you address this?',
      'How would you ensure an enterprise generative AI tool does not accidentally leak sensitive customer PII or confidential company source code?',
      'How should an AI conversational agent handle users expressing suicidal ideation or asking for dangerous weapon instructions?',
      'How do you manage the trade-off between model helpfulness and safety guardrails to avoid annoying over-refusals?',
    ],
    interviewerPOV: 'I want to see if the candidate takes proactive responsibility for ethical downstream effects rather than treating safety as an afterthought or legal obstacle.',
    evaluationSignals: [
      'Proactively audits model performance across minority or sensitive cohorts',
      'Designs end-to-end PII masking and data isolation pipelines',
      'Demonstrates mature judgment balancing safety boundaries with user helpfulness',
      'Has clear incident response protocols for catastrophic safety failures',
    ],
    redFlags: [
      'Dismisses ethical concerns as "the legal team’s problem"',
      'Believes disclaimers in terms of service solve algorithmic discrimination',
      'Cannot explain how bias enters training data or reward models',
    ],
  },
];

// ─── Rating Helpers ───

export const RATING_LABELS: Record<Rating, string> = {
  1: 'Emerging',
  2: 'Developing',
  3: 'Solid',
  4: 'Strong',
};

export const RATING_COLORS: Record<Rating, string> = {
  1: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  2: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  3: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  4: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

export const RATING_BAR_COLORS: Record<Rating, string> = {
  1: 'bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.4)]',
  2: 'bg-amber-400/85 shadow-[0_0_8px_rgba(251,191,36,0.4)]',
  3: 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]',
  4: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]',
};

export function getCompetency(id: CompetencyId): Competency {
  const found = COMPETENCIES.find((c) => c.id === id);
  if (!found) {
    return {
      id: id as CompetencyId,
      name: id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      shortName: id.split('_')[0],
      description: 'Competency evaluation',
      icon: 'Target',
    };
  }
  return found;
}

export function getRubricLevel(competencyId: CompetencyId, rating: Rating) {
  const rubric = RUBRIC[competencyId];
  if (!rubric) {
    return {
      rating,
      label: RATING_LABELS[rating],
      description: `Performance level ${rating} for ${competencyId}`,
    };
  }
  return rubric.levels.find((l) => l.rating === rating) || rubric.levels[0];
}

export function getCompetencyName(id: CompetencyId): string {
  return getCompetency(id).name;
}

export function getQuestionTypeDefinition(id: string): QuestionTypeDefinition | undefined {
  return QUESTION_TYPES_CATALOG.find((q) => q.id === id);
}
