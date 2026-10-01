import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Dumbbell,
  CheckCircle2,
  Circle,
  Target,
  Info,
  RotateCcw,
  Mic,
  Volume2,
  Loader2,
  Crosshair,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { AudioWaveform } from '@/components/AudioWaveform';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import type { Attempt } from '@/types';

interface PracticeProps {
  attempt: Attempt;
  onComplete: (practiceResponse: string) => void;
  onExit: () => void;
}

export function Practice({ attempt, onComplete, onExit }: PracticeProps) {
  const exercise: any = attempt.practiceExercise;
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    met: boolean;
    metCriteria: string[];
    feedback?: string;
  } | null>(null);

  const {
    isRecording,
    transcript,
    interimTranscript,
    frequencies,
    startRecording,
    stopRecording,
    speakText,
    isPlaying,
    stopSpeaking,
  } = useAudioRecorder();

  // Sync speech transcript into response state
  useEffect(() => {
    if (isRecording) {
      const full = (transcript + (interimTranscript ? ' ' + interimTranscript : '')).trim();
      if (full) setResponse(full);
    }
  }, [isRecording, transcript, interimTranscript]);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F5F5F5]">
        <Header onLogoClick={onExit} />
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <p className="font-mono text-zinc-500">No practice exercise available.</p>
          <button onClick={() => onComplete('')} className="btn-primary mt-6">
            Continue to Reattempt
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const handleStartVoice = async () => {
    stopSpeaking();
    await startRecording();
  };

  const handleStopVoice = async () => {
    const spoken = await stopRecording();
    if (spoken.trim()) {
      setResponse(spoken.trim());
    }
  };

  const handleSubmit = async () => {
    if (!response.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Submit to backend
      const res = await fetch(`/api/interviews/${attempt.attemptId}/practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responseText: response.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluation({
          met: data.evaluation?.met || false,
          metCriteria: data.evaluation?.met_criteria || data.evaluation?.metCriteria || [],
          feedback: data.evaluation?.feedback || '',
        });
      } else {
        throw new Error('Server evaluation failed');
      }
    } catch {
      // Fallback evaluation
      const criteria = exercise.evaluationCriteria || exercise.evaluation_criteria || [];
      const lower = response.toLowerCase();
      const met = criteria.filter((c: string) => {
        const words = c.toLowerCase().split(' ').filter(w => w.length > 3);
        return words.some(w => lower.includes(w));
      });
      setEvaluation({
        met: met.length >= Math.ceil(criteria.length * 0.5),
        metCriteria: met,
        feedback: 'Evaluation completed based on framework compliance.',
      });
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleContinue = () => {
    onComplete(response.trim());
  };

  const handleRetry = () => {
    setSubmitted(false);
    setEvaluation(null);
    setResponse('');
  };

  const targetGap = exercise.targetGap || exercise.target_gap;
  const exercisePrompt = exercise.exercisePrompt || exercise.exercise_prompt;
  const framework = exercise.framework || [];
  const frameworkLabel = exercise.frameworkLabel || exercise.framework_label;
  const successCondition = exercise.successCondition || exercise.success_condition;
  const criteriaList = exercise.evaluationCriteria || exercise.evaluation_criteria || [];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] relative overflow-hidden">
      <Header
        onLogoClick={onExit}
        rightContent={
          <span className="badge bg-teal-500/10 text-teal-300 border border-teal-500/30 font-mono text-xs">
            <Dumbbell className="h-3.5 w-3.5 text-teal-400" />
            Targeted Voice Practice
          </span>
        }
      />

      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        {/* Header Section */}
        <div className="mb-8 animate-slide-up">
          <div className="section-label mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            TARGETED COGNITIVE REWIRING
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
            Practice your weakest area.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 leading-relaxed">
            One focused exercise targeting your highest-impact gap from Attempt 1. Speak your answer aloud using the framework below.
          </p>
        </div>

        {/* Visual Focus Indicator around Target Weakness (HUD Reticle) */}
        <div className="rounded-3xl border border-teal-500/50 bg-gradient-to-r from-teal-950/30 via-[#0A0A0A] to-[#0A0A0A] p-6 sm:p-7 mb-8 shadow-[0_0_35px_rgba(20,184,166,0.15)] animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-15">
            <Crosshair className="h-28 w-28 text-teal-400" />
          </div>

          <div className="flex items-start gap-4 relative z-10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-[0_0_20px_rgba(45,212,191,0.4)]">
              <Crosshair className="h-6 w-6 text-teal-300 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-teal-300 tracking-widest">
                <span>TARGET GOAL</span>
                <span>•</span>
                <span>ISOLATION PROTOCOL</span>
              </div>
              <h2 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                {targetGap}
              </h2>
            </div>
          </div>
        </div>

        {/* Exercise Prompt & Listen button */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-6 sm:p-8 mb-6 shadow-2xl backdrop-blur-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-teal-400 font-bold">
                DRILL PROMPT
              </span>
              <p className="font-serif text-base sm:text-lg leading-relaxed text-zinc-100">
                "{exercisePrompt}"
              </p>
            </div>
            <button
              onClick={() => {
                if (isPlaying) stopSpeaking();
                else speakText(exercisePrompt);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#121212] px-3.5 py-2 text-xs font-mono font-medium text-zinc-300 hover:border-teal-400 hover:text-white shrink-0 cursor-pointer shadow-xs transition-all"
              title="Listen to exercise prompt"
            >
              <Volume2 className={`h-3.5 w-3.5 ${isPlaying ? 'text-teal-400 animate-pulse' : 'text-zinc-400'}`} />
              {isPlaying ? 'Listening...' : 'Listen'}
            </button>
          </div>
        </div>

        {/* Framework Guidance */}
        <div className="rounded-3xl border border-teal-500/30 bg-[#0E1414] p-6 sm:p-8 mb-6 shadow-xl animate-slide-up" style={{ animationDelay: '180ms' }}>
          <div className="flex items-start gap-3.5">
            <Info className="mt-1 h-5 w-5 shrink-0 text-teal-400" />
            <div className="flex-1 space-y-3">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-teal-300">
                Framework to execute:
              </p>
              <p className="font-mono text-xs text-zinc-200 bg-black/40 p-2.5 rounded-xl border border-teal-500/20">
                {frameworkLabel || framework.join(' → ')}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {framework.map((step: string, i: number) => (
                  <div key={step} className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-black font-mono">
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium text-zinc-300">{step}</span>
                    {i < framework.length - 1 && <span className="text-zinc-600 font-mono">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Success Condition */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-4.5 mb-8 shadow-md animate-slide-up" style={{ animationDelay: '240ms' }}>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <div>
              <p className="font-mono text-[10px] font-bold uppercase text-zinc-400">Success condition</p>
              <p className="mt-0.5 text-xs text-zinc-300 leading-relaxed">{successCondition}</p>
            </div>
          </div>
        </div>

        {/* Voice Recording / Response Input Area */}
        {!submitted ? (
          <div className="rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-6 sm:p-8 animate-slide-up space-y-5 shadow-2xl" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Mic className="h-4 w-4 text-teal-400" />
                Your Practice Response (Voice-first)
              </label>
              <span className="font-mono text-xs text-zinc-500">
                {response.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            {/* Voice Control Bar */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#070707] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {isRecording ? (
                  <button
                    onClick={handleStopVoice}
                    className="inline-flex items-center gap-2.5 rounded-full bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    Finish Speaking
                  </button>
                ) : (
                  <button
                    onClick={handleStartVoice}
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold shadow-[0_0_20px_rgba(45,212,191,0.5)] cursor-pointer"
                  >
                    <Mic className="h-4 w-4" />
                    Speak Response
                  </button>
                )}
                <span className="font-mono text-xs text-zinc-400">
                  {isRecording ? 'Listening to speech...' : 'Click to answer with voice'}
                </span>
              </div>

              {/* Waveform */}
              {isRecording && (
                <div className="w-full sm:w-48">
                  <AudioWaveform state="speaking" frequencies={frequencies} height={32} barCount={20} />
                </div>
              )}
            </div>

            {/* Editable Transcript Area */}
            <textarea
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="Your speech transcript will appear here. Speak naturally using the framework..."
              rows={6}
              className="w-full rounded-2xl border border-white/10 bg-[#050505] p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 font-sans leading-relaxed resize-y"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="font-mono text-[11px] text-zinc-500">
                Tip: Walk through the steps in order: User, Problem, Goal, Options, Trade-offs.
              </p>
              <button
                onClick={handleSubmit}
                disabled={!response.trim() || isSubmitting}
                className="btn-primary py-3 px-7 text-xs font-semibold disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  'Submit for Evaluation'
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Evaluation Results */
          <div className="animate-slide-up space-y-6">
            {/* Met Condition Card */}
            <div
              className={`rounded-3xl border p-6 sm:p-8 shadow-xl ${
                evaluation?.met
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-amber-500/40 bg-amber-950/20'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {evaluation?.met ? (
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />
                ) : (
                  <Target className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />
                )}
                <div>
                  <h3 className="text-base font-bold text-white">
                    {evaluation?.met
                      ? 'Success condition met ✓'
                      : 'Good progress — keep refining'}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-300 leading-relaxed">
                    {evaluation?.feedback ||
                      (evaluation?.met
                        ? 'Your response demonstrates the targeted behavior and established clear structure.'
                        : 'Your response showed parts of the framework, but make sure to fully define the user and problem before proposing solutions.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Criteria Checklist */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-6 shadow-xl">
              <p className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-teal-400">
                Evaluation Criteria Checklist
              </p>
              <div className="space-y-3">
                {criteriaList.map((criterion: string) => {
                  const isMet = evaluation?.metCriteria.some(
                    c =>
                      criterion.toLowerCase().includes(c.toLowerCase().slice(0, 10)) ||
                      c.toLowerCase().includes(criterion.toLowerCase().slice(0, 10))
                  );
                  return (
                    <div key={criterion} className="flex items-start gap-3 text-xs">
                      {isMet ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
                      )}
                      <span className={isMet ? 'font-medium text-zinc-100' : 'text-zinc-500'}>
                        {criterion}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Your Response */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#070707] p-6">
              <p className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                Your Spoken Practice Response
              </p>
              <p className="font-serif text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap italic">
                "{response}"
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleRetry}
                className="btn-secondary w-full sm:w-auto py-3.5 px-6 text-xs font-mono cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Practice Again
              </button>
              <button
                onClick={handleContinue}
                className="btn-primary w-full sm:flex-1 py-4 text-sm font-semibold cursor-pointer shadow-[0_0_30px_rgba(45,212,191,0.5)]"
                data-cursor="explore"
              >
                <span>Start Second Interview (Reattempt)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
