import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Target,
  Sparkles,
  Building2,
  Briefcase,
  Volume2,
  CheckCircle2,
  Zap,
  Mic,
  Sliders,
  Layers,
  Check,
  Keyboard,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { AudioWaveform } from '@/components/AudioWaveform';
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
    desc: 'Foundational problem structuring, user pain points, and execution clarity.',
    icon: Target,
    signal: 'STRUCTURING + EMPATHY',
  },
  {
    id: 'Product Manager (L4/L5)',
    title: 'Product Manager',
    tag: 'Core L4 / L5',
    desc: 'End-to-end product sense, ambiguous framing, metric trade-offs, and GTM.',
    icon: Briefcase,
    signal: 'TRADE-OFFS + PRIORITIZATION',
  },
  {
    id: 'Senior Product Manager',
    title: 'Senior PM',
    tag: 'L6 / Lead',
    desc: 'Multi-year strategy, organizational alignment, non-obvious bets, and cross-functional leverage.',
    icon: Layers,
    signal: 'STRATEGY + IMPACT',
  },
  {
    id: 'Technical Product Manager (TPM)',
    title: 'Technical PM',
    tag: 'Platform & APIs',
    desc: 'Developer platforms, distributed architecture, latency, and integration trade-offs.',
    icon: Sliders,
    signal: 'LATENCY + ARCHITECTURE',
  },
  {
    id: 'Growth Product Manager',
    title: 'Growth PM',
    tag: 'Funnels & Retention',
    desc: 'Trial conversion, activation funnels, loops, referral mechanics, and churn mitigation.',
    signal: 'RETENTION + FUNNELS',
    icon: Zap,
  },
  {
    id: 'AI / ML Product Manager',
    title: 'AI / ML PM',
    tag: 'GenAI & Agents',
    desc: 'Model evaluation, hallucinations, latency vs accuracy trade-offs, and human-in-the-loop UX.',
    signal: 'EVALS + HUMAN-IN-LOOP',
    icon: Sparkles,
  },
];

const EXPERIENCE_STAGES: { value: ExperienceLevel; stage: string; years: string; desc: string }[] = [
  { value: '0-1', stage: '01', years: '0–1 yrs', desc: 'Transitioning or rotational' },
  { value: '1-2', stage: '02', years: '1–2 yrs', desc: 'Shipped features, targeting mid-level' },
  { value: '2-3', stage: '03', years: '2–3 yrs', desc: 'Autonomous PM leading workstreams' },
  { value: '3+', stage: '04', years: '3+ yrs', desc: 'Seasoned lead preparing for high-stakes bars' },
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

const DOMAINS: { value: Domain; label: string }[] = [
  { value: 'fintech', label: 'Fintech' },
  { value: 'saas', label: 'B2B SaaS' },
  { value: 'consumer', label: 'Consumer Tech' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'general', label: 'General Product' },
];

export function Setup({ onComplete, onBack }: SetupProps) {
  // Configuration Fields
  const [role, setRole] = useState<string>(ROLES[1].id);
  const [experience, setExperience] = useState<ExperienceLevel>('1-2');
  const [interviewMode, setInterviewMode] = useState<InterviewMode>('general');
  const [domain, setDomain] = useState<Domain>('saas');

  // Company Tailored Details
  const [companyName, setCompanyName] = useState('');
  const [companyServices, setCompanyServices] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Cinematic Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    setIsTransitioning(true);
    setTimeout(() => {
      onComplete({
        experienceLevel: experience,
        domain,
        targetRole: role,
        interviewMode,
        companyName: interviewMode === 'company_tailored' ? companyName.trim() : undefined,
        companyServices: interviewMode === 'company_tailored' ? companyServices.trim() : undefined,
        jobDescription: interviewMode === 'company_tailored' ? jobDescription.trim() : undefined,
      });
    }, 450);
  };

  const selectedRoleObj = ROLES.find((r) => r.id === role) || ROLES[1];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F2] selection:bg-teal-500/25 selection:text-teal-200">
      <Header onLogoClick={onBack} />

      {/* Cinematic Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center animate-fade-in">
          <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#19D3C5] to-transparent shadow-[0_0_20px_#19D3C5] animate-pulse" />
          <div className="mt-6 flex items-center gap-3 font-mono text-xs text-teal-300">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />
            INITIALIZING SIMULATION ENVIRONMENT...
          </div>
        </div>
      )}

      {/* Main 2-Column Responsive Layout */}
      <main className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        {/* Top Breadcrumb Navigation */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>RETURN TO OVERVIEW</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ────────────────────────────────────────────────────────
              LEFT COLUMN: STICKY EDITORIAL & TELEMETRY HUD (5 COLS)
              Linear / Apple / Stripe style pinned summary
          ──────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-7 text-left">
            <div>
              <div className="section-label mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                SIMULATION CALIBRATION
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#F5F5F2] leading-[1.12]">
                Calibrate your
                <br />
                <span className="text-[#19D3C5] italic">simulation.</span>
              </h1>
              <p className="mt-3 text-sm text-[#8A8F98] leading-relaxed">
                The AI interviewer adapts its probing depth, rubric strictness, and follow-ups to your target role.
              </p>
            </div>

            {/* Live Telemetry Summary HUD Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_6px_#19D3C5]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
                    CALIBRATION TELEMETRY
                  </span>
                </div>
                <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest bg-teal-950/40 px-2 py-0.5 rounded border border-teal-500/20">
                  READY
                </span>
              </div>

              {/* Key Values */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase">Target Role:</span>
                  <span className="font-bold text-white text-right truncate max-w-[200px]">{selectedRoleObj.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase">Rubric Focus:</span>
                  <span className="text-teal-300 font-semibold">{selectedRoleObj.signal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase">Experience:</span>
                  <span className="text-zinc-200">{experience} Years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase">Mode:</span>
                  <span className="text-zinc-200 capitalize">
                    {interviewMode === 'company_tailored' ? (companyName ? companyName : 'Custom Company') : 'General Case'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase">Domain:</span>
                  <span className="text-zinc-200 capitalize">{domain}</span>
                </div>
              </div>

              {/* Voice Synthesizer Selector Inside HUD */}
              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-teal-400" />
                    <span>AI Voice Profile</span>
                  </span>
                  <button
                    onClick={handleTestVoice}
                    className="text-teal-300 hover:text-white transition-colors cursor-pointer text-[10px] uppercase font-bold"
                  >
                    🔊 Test Voice
                  </button>
                </div>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-teal-400 font-sans cursor-pointer"
                >
                  {availableVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online')
                        ? `⭐ ${v.name}`
                        : v.name}
                    </option>
                  ))}
                  {availableVoices.length === 0 && <option value="">Default High-Quality Neural Voice</option>}
                </select>
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="space-y-2">
              <button
                onClick={handleFinishSetup}
                className="btn-primary w-full text-sm py-4 group shadow-[0_0_30px_rgba(25,211,197,0.4)]"
                data-cursor="explore"
              >
                <span>Launch Interview Simulation</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </button>
              <p className="text-center font-mono text-[11px] text-zinc-500">
                No signup required · 15–20 minutes · Voice & text
              </p>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────
              RIGHT COLUMN: SEAMLESS CONFIGURATION FORM (7 COLS)
              Zero nested box-in-box chaos, elegant editorial dividers
          ──────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-12 text-left">
            {/* ─── SECTION 01: TARGET ROLE ─── */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <span className="font-mono text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
                    01 · TARGET ROLE
                  </span>
                  <h2 className="text-base font-bold text-white tracking-wide mt-0.5">
                    What role are you targeting?
                  </h2>
                </div>
                <span className="font-mono text-xs font-semibold text-teal-300">
                  {selectedRoleObj.title}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-[#19D3C5] bg-[#0A1616] shadow-[0_0_20px_rgba(25,211,197,0.2)]'
                          : 'border-white/[0.07] bg-[#0A0A0A] hover:border-white/20 hover:bg-[#111111]'
                      }`}
                      data-cursor="view"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-teal-500 text-black shadow-[0_0_10px_#19D3C5]'
                              : 'bg-white/5 text-zinc-400'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        {isSelected ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-400 text-black shadow-[0_0_6px_#19D3C5]">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="font-mono text-[9px] text-zinc-500 uppercase">{r.tag}</span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-white">{r.title}</div>
                      <p className="mt-1 text-xs text-[#8A8F98] leading-relaxed line-clamp-2">{r.desc}</p>
                      <div className="mt-2.5 pt-2 border-t border-white/[0.04]">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-teal-400/90 font-semibold">
                          {r.signal}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ─── SECTION 02: PM EXPERIENCE LEVEL ─── */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <span className="font-mono text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
                    02 · PM EXPERIENCE LEVEL
                  </span>
                  <h2 className="text-base font-bold text-white tracking-wide mt-0.5">
                    Experience Level Progression
                  </h2>
                </div>
                <span className="font-mono text-xs text-zinc-400">Calibrates rubric strictness</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {EXPERIENCE_STAGES.map((stage) => {
                  const isSelected = experience === stage.value;
                  return (
                    <button
                      key={stage.value}
                      onClick={() => setExperience(stage.value)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-[#19D3C5] bg-[#0A1616] shadow-[0_0_20px_rgba(25,211,197,0.2)]'
                          : 'border-white/[0.07] bg-[#0A0A0A] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-mono text-[10px] font-bold uppercase ${
                            isSelected ? 'text-teal-300' : 'text-zinc-500'
                          }`}
                        >
                          {stage.stage}
                        </span>
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#19D3C5]" />}
                      </div>
                      <div className="mt-2 text-sm font-bold text-white">{stage.years}</div>
                      <p className="mt-0.5 text-[11px] text-[#8A8F98] leading-tight line-clamp-2">{stage.desc}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ─── SECTION 03: SIMULATION MODE ─── */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <span className="font-mono text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
                    03 · SIMULATION MODE
                  </span>
                  <h2 className="text-base font-bold text-white tracking-wide mt-0.5">
                    Choose simulation mode
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* General Case */}
                <button
                  onClick={() => setInterviewMode('general')}
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
                    interviewMode === 'general'
                      ? 'border-[#19D3C5] bg-[#0A1616] shadow-[0_0_20px_rgba(25,211,197,0.2)]'
                      : 'border-white/[0.07] bg-[#0A0A0A] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                      <Mic className="h-4 w-4 text-teal-400" />
                      LIVE GENERAL PM CASE
                    </span>
                    {interviewMode === 'general' && <CheckCircle2 className="h-4 w-4 text-teal-400" />}
                  </div>
                  <p className="text-xs text-[#8A8F98] leading-relaxed mb-3">
                    Adaptive Product Sense case tailored to your chosen industry domain. Recommended for broad interview preparation.
                  </p>
                  <div className="rounded-lg border border-white/[0.05] bg-black/50 p-2">
                    <AudioWaveform state="playing" height={24} barCount={18} />
                  </div>
                </button>

                {/* Company & JD Tailored */}
                <button
                  onClick={() => setInterviewMode('company_tailored')}
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
                    interviewMode === 'company_tailored'
                      ? 'border-[#19D3C5] bg-[#0A1616] shadow-[0_0_20px_rgba(25,211,197,0.2)]'
                      : 'border-white/[0.07] bg-[#0A0A0A] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-cyan-400" />
                      COMPANY & JD TAILORED
                    </span>
                    {interviewMode === 'company_tailored' && <CheckCircle2 className="h-4 w-4 text-teal-400" />}
                  </div>
                  <p className="text-xs text-[#8A8F98] leading-relaxed mb-3">
                    Gemini generates an authentic business case specific to a real company, product line, and job description requirements.
                  </p>
                  <div className="rounded-lg border border-white/[0.05] bg-black/50 p-2.5 font-mono text-[10px] text-teal-300 flex items-center gap-2">
                    <Keyboard className="h-3 w-3 text-cyan-400" />
                    <span>SYNTHESIZING REAL-WORLD JD SCENARIO...</span>
                  </div>
                </button>
              </div>

              {/* Tailored Company Drawer when active */}
              {interviewMode === 'company_tailored' && (
                <div className="rounded-xl border border-teal-500/30 bg-[#0E1515] p-5 space-y-4 animate-fade-in mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                      1-CLICK COMPANY PRESETS:
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">Loads authentic scenario</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {PRESET_COMPANIES.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => handleApplyPreset(p)}
                        className="rounded-lg border border-white/10 bg-[#141414] px-3 py-1.5 text-xs font-mono font-semibold text-zinc-200 hover:border-teal-400 hover:text-teal-300 hover:bg-teal-950/20 transition-all cursor-pointer"
                      >
                        ⚡ {p.name} ({p.domain.toUpperCase()})
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 pt-1">
                    <div>
                      <label className="block text-xs font-mono font-bold text-zinc-300 mb-1 uppercase">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Stripe, Airbnb, Notion, Startup"
                        className="w-full rounded-lg border border-white/10 bg-[#121212] p-2.5 text-xs text-white focus:border-teal-400 focus:outline-none font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-zinc-300 mb-1 uppercase">
                        Company Services / Model
                      </label>
                      <input
                        type="text"
                        value={companyServices}
                        onChange={(e) => setCompanyServices(e.target.value)}
                        placeholder="e.g. B2B payments, cloud storage, collaborative docs"
                        className="w-full rounded-lg border border-white/10 bg-[#121212] p-2.5 text-xs text-white focus:border-teal-400 focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-zinc-300 mb-1 uppercase">
                      Job Description or Specific Focus
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste job posting highlights or team focus area..."
                      rows={2}
                      className="w-full rounded-lg border border-white/10 bg-[#121212] p-2.5 text-xs text-white focus:border-teal-400 focus:outline-none font-sans"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* ─── SECTION 04: INDUSTRY DOMAIN ─── */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <span className="font-mono text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
                    04 · INDUSTRY DOMAIN
                  </span>
                  <h2 className="text-base font-bold text-white tracking-wide mt-0.5">
                    Target Industry Domain
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {DOMAINS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDomain(d.value)}
                    className={`rounded-xl border p-3 text-center transition-all cursor-pointer ${
                      domain === d.value
                        ? 'border-[#19D3C5] bg-[#0A1616] font-bold text-teal-300 shadow-[0_0_15px_rgba(25,211,197,0.2)]'
                        : 'border-white/[0.07] bg-[#0A0A0A] text-zinc-400 hover:border-white/20 hover:text-white text-xs'
                    }`}
                  >
                    <div className="text-xs font-medium">{d.label}</div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
