import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Target,
  Sparkles,
  Building2,
  Briefcase,
  FileText,
  Volume2,
  CheckCircle2,
  Zap,
  Mic,
  Sliders,
  Layers,
  Check,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import type { ExperienceLevel, Domain, SetupData, InterviewMode } from '@/types';

interface SetupProps {
  onComplete: (data: SetupData) => void;
  onBack: () => void;
}

const ROLES = [
  {
    id: 'Associate Product Manager (APM)',
    title: 'Associate PM',
    tag: 'APM / Rotational',
    desc: 'Foundational problem structuring, user pain point identification, and execution clarity.',
    icon: Target,
  },
  {
    id: 'Product Manager (L4/L5)',
    title: 'Product Manager',
    tag: 'Core L4 / L5',
    desc: 'End-to-end product sense, ambiguous problem framing, metric trade-offs, and go-to-market.',
    icon: Briefcase,
  },
  {
    id: 'Senior Product Manager',
    title: 'Senior PM',
    tag: 'L6 / Lead',
    desc: 'Multi-year strategy, organizational alignment, non-obvious bets, and cross-functional leverage.',
    icon: Layers,
  },
  {
    id: 'Technical Product Manager (TPM)',
    title: 'Technical PM',
    tag: 'Platform & APIs',
    desc: 'Developer platforms, distributed architecture constraints, latency, and integration trade-offs.',
    icon: Sliders,
  },
  {
    id: 'Growth Product Manager',
    title: 'Growth PM',
    tag: 'Funnels & Retention',
    desc: 'Trial conversion, activation funnels, loops, referral mechanics, and churn mitigation.',
    icon: Zap,
  },
  {
    id: 'AI / ML Product Manager',
    title: 'AI / ML PM',
    tag: 'GenAI & Agents',
    desc: 'Model evaluation, hallucinations, latency vs accuracy trade-offs, and human-in-the-loop UX.',
    icon: Sparkles,
  },
];

const EXPERIENCE_STAGES: { value: ExperienceLevel; stage: string; years: string; desc: string }[] = [
  { value: '0-1', stage: 'NEW', years: '0–1 years', desc: 'Transitioning into PM or early rotational' },
  { value: '1-2', stage: 'EARLY', years: '1–2 years', desc: 'Shipped first features, aiming for mid-level' },
  { value: '2-3', stage: 'EXPERIENCED', years: '2–3 years', desc: 'Autonomous PM leading core workstreams' },
  { value: '3+', stage: 'ADVANCED', years: '3+ years', desc: 'Seasoned lead preparing for high-stakes interviews' },
];

const PRESET_COMPANIES = [
  {
    name: 'Stripe',
    domain: 'fintech' as Domain,
    services: 'Financial infrastructure & payments platform for internet businesses',
    jd: 'Lead merchant checkout conversion and authorization optimization across global markets.',
  },
  {
    name: 'Spotify',
    domain: 'consumer' as Domain,
    services: 'Audio streaming, personalized music discovery & podcast platform',
    jd: 'Lead Discovery & Personalization. Design algorithmic playlist experiences to boost 30-day retention.',
  },
  {
    name: 'Notion',
    domain: 'saas' as Domain,
    services: 'All-in-one collaborative workspace, docs, wikis & project tracking',
    jd: 'Drive collaborative activation for invited team members on collaborative workspaces.',
  },
  {
    name: 'Uber',
    domain: 'marketplace' as Domain,
    services: 'Global ridesharing, courier delivery, and freight logistics network',
    jd: 'Optimize marketplace liquidity during peak hours and minimize passenger cancellation rates.',
  },
];

const DOMAINS: { value: Domain; label: string; desc: string }[] = [
  { value: 'fintech', label: 'Fintech', desc: 'Payments, banking, fraud, crypto' },
  { value: 'saas', label: 'B2B SaaS', desc: 'Workflows, enterprise tools, collaboration' },
  { value: 'consumer', label: 'Consumer Tech', desc: 'Social, streaming, mobile apps' },
  { value: 'marketplace', label: 'Marketplace', desc: 'Two-sided supply & demand matching' },
  { value: 'general', label: 'General Product', desc: 'Broad product sense scenario' },
];

export function Setup({ onComplete, onBack }: SetupProps) {
  // Step Wizard State
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Configuration Fields
  const [role, setRole] = useState<string>(ROLES[1].id);
  const [experience, setExperience] = useState<ExperienceLevel>('1-2');
  const [interviewMode, setInterviewMode] = useState<InterviewMode>('general');
  const [domain, setDomain] = useState<Domain>('saas');

  // Company Tailored Details
  const [companyName, setCompanyName] = useState('');
  const [companyServices, setCompanyServices] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Audio Hook
  const { availableVoices, selectedVoiceName, setSelectedVoiceName, speakText } = useAudioRecorder();

  const handleApplyPreset = (preset: typeof PRESET_COMPANIES[0]) => {
    setCompanyName(preset.name);
    setDomain(preset.domain);
    setCompanyServices(preset.services);
    setJobDescription(preset.jd);
    setInterviewMode('company_tailored');
  };

  const handleTestVoice = () => {
    speakText('Hello! I am your AI interviewer today. I will adapt our discussion based on your background.');
  };

  const handleFinishSetup = () => {
    onComplete({
      experienceLevel: experience,
      domain,
      targetRole: role,
      interviewMode,
      companyName: interviewMode === 'company_tailored' ? companyName.trim() : undefined,
      companyServices: interviewMode === 'company_tailored' ? companyServices.trim() : undefined,
      jobDescription: interviewMode === 'company_tailored' ? jobDescription.trim() : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-ambient-light">
      <Header onLogoClick={onBack} />

      <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
        {/* Navigation & Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="btn-ghost -ml-3 mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-ink-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="section-label">TAILORED SIMULATION</p>
              <h1 className="mt-1.5 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink-900">
                Build your interview.
              </h1>
              <p className="mt-2 text-sm text-ink-500 max-w-xl leading-relaxed">
                Choose the context you want to practice. Your interviewer will adapt the case, follow-ups, and evaluation to match.
              </p>
            </div>

            {/* Step Wizard Badges */}
            <div className="flex items-center gap-2 border border-ink-200/80 bg-white/80 p-1.5 rounded-xl shadow-xs backdrop-blur-xs">
              {[
                { num: 1, label: '01 ROLE' },
                { num: 2, label: '02 EXPERIENCE' },
                { num: 3, label: '03 MODE' },
                { num: 4, label: '04 READY' },
              ].map(step => (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num as any)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    activeStep === step.num
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'text-ink-400 hover:text-ink-700'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Progressive Section Flow ─── */}
        <div className="space-y-8">
          {/* STEP 1: ROLE SELECTION */}
          <div className={`card p-6 sm:p-8 transition-all duration-300 ${activeStep === 1 ? 'ring-2 ring-primary-500/30 border-primary-400' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-primary-700">01</span>
                <h2 className="text-base font-bold text-ink-900">What role are you preparing for?</h2>
              </div>
              <span className="text-xs font-semibold text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
                {role}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ROLES.map(r => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      if (activeStep === 1) setActiveStep(2);
                    }}
                    className={`group relative rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/40 shadow-sm ring-1 ring-primary-500/30'
                        : 'border-ink-200/80 bg-white hover:border-ink-300 hover:-translate-y-0.5 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isSelected ? 'bg-primary-600 text-white' : 'bg-ink-100/70 text-ink-600 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {isSelected ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-ink-400">{r.tag}</span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-ink-900">{r.title}</div>
                    <p className="mt-1 text-xs text-ink-500 leading-relaxed line-clamp-2">{r.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: EXPERIENCE LEVEL PROGRESSION */}
          <div className={`card p-6 sm:p-8 transition-all duration-300 ${activeStep === 2 ? 'ring-2 ring-primary-500/30 border-primary-400' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-primary-700">02</span>
                <h2 className="text-base font-bold text-ink-900">How much PM experience do you have?</h2>
              </div>
              <span className="text-xs font-semibold text-ink-600">
                Calibrates interview difficulty
              </span>
            </div>

            {/* Horizontal Milestone Progression */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EXPERIENCE_STAGES.map((stage) => {
                const isSelected = experience === stage.value;
                return (
                  <button
                    key={stage.value}
                    onClick={() => {
                      setExperience(stage.value);
                      if (activeStep === 2) setActiveStep(3);
                    }}
                    className={`rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/50 shadow-sm ring-1 ring-primary-500/30'
                        : 'border-ink-200/80 bg-white hover:border-ink-300 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-primary-700">
                        {stage.stage}
                      </span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-primary-600" />}
                    </div>
                    <div className="mt-1 text-sm font-bold text-ink-900">{stage.years}</div>
                    <p className="mt-1 text-xs text-ink-400 line-clamp-2">{stage.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: INTERVIEW MODE & COMPANY CONTEXT */}
          <div className={`card p-6 sm:p-8 transition-all duration-300 ${activeStep === 3 ? 'ring-2 ring-primary-500/30 border-primary-400' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-primary-700">03</span>
                <h2 className="text-base font-bold text-ink-900">Choose simulation mode</h2>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 mb-6">
              <button
                onClick={() => setInterviewMode('general')}
                className={`rounded-xl border p-5 text-left transition-all cursor-pointer ${
                  interviewMode === 'general'
                    ? 'border-primary-500 bg-primary-50/40 shadow-sm ring-1 ring-primary-500/30'
                    : 'border-ink-200/80 bg-white hover:border-ink-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-ink-900">
                    <Mic className="h-4 w-4 text-primary-600" />
                    General PM Interview
                  </span>
                  {interviewMode === 'general' && <CheckCircle2 className="h-4 w-4 text-primary-600" />}
                </div>
                <p className="text-xs text-ink-500 leading-relaxed">
                  Calibrated Product Sense case tailored to your chosen industry domain. Recommended for broad interview preparation.
                </p>
              </button>

              <button
                onClick={() => setInterviewMode('company_tailored')}
                className={`rounded-xl border p-5 text-left transition-all cursor-pointer ${
                  interviewMode === 'company_tailored'
                    ? 'border-primary-500 bg-primary-50/40 shadow-sm ring-1 ring-primary-500/30'
                    : 'border-ink-200/80 bg-white hover:border-ink-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-ink-900">
                    <Building2 className="h-4 w-4 text-accent-600" />
                    Company & JD Tailored
                  </span>
                  {interviewMode === 'company_tailored' && <CheckCircle2 className="h-4 w-4 text-primary-600" />}
                </div>
                <p className="text-xs text-ink-500 leading-relaxed">
                  Gemini generates an authentic business case specific to a real company, product line, and job description requirements.
                </p>
              </button>
            </div>

            {/* Tailored Company Drawer */}
            {interviewMode === 'company_tailored' && (
              <div className="rounded-xl border border-accent-200/80 bg-accent-50/30 p-5 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-900 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-accent-600" />
                    1-Click Company Presets:
                  </span>
                  <span className="text-[11px] text-ink-400">Loads realistic business scenario</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PRESET_COMPANIES.map(p => (
                    <button
                      key={p.name}
                      onClick={() => handleApplyPreset(p)}
                      className="rounded-lg border border-accent-300/80 bg-white px-3 py-1 text-xs font-semibold text-ink-800 hover:bg-accent-100 transition-colors shadow-xs cursor-pointer"
                    >
                      ⚡ {p.name} ({p.domain.toUpperCase()})
                    </button>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-ink-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Stripe, Airbnb, Notion, Custom Startup"
                      className="w-full rounded-lg border border-ink-200 bg-white p-2.5 text-xs text-ink-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-700 mb-1">Company Services / Model</label>
                    <input
                      type="text"
                      value={companyServices}
                      onChange={e => setCompanyServices(e.target.value)}
                      placeholder="e.g. B2B payments, cloud storage, collaborative docs"
                      className="w-full rounded-lg border border-ink-200 bg-white p-2.5 text-xs text-ink-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Job Description or Specific Focus</label>
                  <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste job posting highlights or team focus area..."
                    rows={3}
                    className="w-full rounded-lg border border-ink-200 bg-white p-2.5 text-xs text-ink-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            {/* Domain Picker */}
            <div className="mt-6 pt-5 border-t border-ink-100">
              <label className="block text-xs font-bold text-ink-700 mb-2">Industry Domain</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {DOMAINS.map(d => (
                  <button
                    key={d.value}
                    onClick={() => setDomain(d.value)}
                    className={`rounded-lg border p-2.5 text-center transition-all cursor-pointer ${
                      domain === d.value
                        ? 'border-primary-500 bg-primary-50/60 font-bold text-primary-900'
                        : 'border-ink-200/80 bg-white text-ink-600 hover:border-ink-300 text-xs'
                    }`}
                  >
                    <div className="text-xs">{d.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 4: VOICE SETTINGS & LAUNCH CONFIRMATION */}
          <div className="card p-6 sm:p-8 bg-gradient-to-b from-white to-primary-50/20 border-primary-200/60 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-ink-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink-900">Interviewer Voice Profile</div>
                  <div className="text-xs text-ink-500">Natural neural voice synthesizer</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedVoiceName}
                  onChange={e => setSelectedVoiceName(e.target.value)}
                  className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-800 focus:outline-none focus:border-primary-500"
                >
                  {availableVoices.map(v => (
                    <option key={v.name} value={v.name}>
                      {v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online')
                        ? `⭐ ${v.name}`
                        : v.name}
                    </option>
                  ))}
                  {availableVoices.length === 0 && <option value="">Default High-Quality Voice</option>}
                </select>
                <button
                  onClick={handleTestVoice}
                  className="btn-secondary py-1.5 px-3 text-xs shrink-0 cursor-pointer"
                >
                  🔊 Test
                </button>
              </div>
            </div>

            {/* Summary Strip */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-lg bg-white p-3 border border-ink-100">
                <div className="text-ink-400 font-mono text-[10px] uppercase">Position</div>
                <div className="font-bold text-ink-900 mt-0.5 truncate">{role}</div>
              </div>
              <div className="rounded-lg bg-white p-3 border border-ink-100">
                <div className="text-ink-400 font-mono text-[10px] uppercase">Experience</div>
                <div className="font-bold text-ink-900 mt-0.5">{experience} years</div>
              </div>
              <div className="rounded-lg bg-white p-3 border border-ink-100">
                <div className="text-ink-400 font-mono text-[10px] uppercase">Mode</div>
                <div className="font-bold text-ink-900 mt-0.5 capitalize">{interviewMode.replace('_', ' ')}</div>
              </div>
              <div className="rounded-lg bg-white p-3 border border-ink-100">
                <div className="text-ink-400 font-mono text-[10px] uppercase">Domain</div>
                <div className="font-bold text-ink-900 mt-0.5 capitalize">{domain}</div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="mt-6">
              <button
                onClick={handleFinishSetup}
                className="btn-primary w-full text-base py-4 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <span>Launch Interview Simulation</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-2 text-center text-xs text-ink-400">
                Session state is automatically saved. Microphone access will be requested upon entering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
