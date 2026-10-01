import { useState, useEffect } from 'react';
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
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { AudioWaveform } from '@/components/AudioWaveform';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import type { Attempt, PracticeExercise } from '@/types';

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
      <div className="min-h-screen bg-ink-50">
        <Header onLogoClick={onExit} />
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <p className="text-ink-500">No practice exercise available.</p>
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
    <div className="min-h-screen bg-ambient-light">
      <Header
        onLogoClick={onExit}
        rightContent={
          <span className="badge bg-accent-100 text-accent-800 border border-accent-200">
            <Dumbbell className="h-3.5 w-3.5" />
            Targeted Voice Practice
          </span>
        }
      />

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <p className="section-label">Targeted Practice</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink-900">
            Practice your weakest area with voice
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            One focused exercise targeting your highest-impact gap from Attempt 1. Speak your answer aloud using the framework below.
          </p>
        </div>

        {/* Target Gap */}
        <div className="card mb-6 animate-slide-up p-5" style={{ animationDelay: '60ms' }}>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-100">
              <Target className="h-5 w-5 text-accent-700" />
            </div>
            <div>
              <p className="section-label">Targeted Gap</p>
              <h3 className="mt-1 text-sm font-bold text-ink-900">{targetGap}</h3>
            </div>
          </div>
        </div>

        {/* Exercise Prompt & Listen button */}
        <div className="card mb-6 animate-slide-up p-6" style={{ animationDelay: '120ms' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-ink-800">Exercise Prompt</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{exercisePrompt}</p>
            </div>
            <button
              onClick={() => {
                if (isPlaying) stopSpeaking();
                else speakText(exercisePrompt);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50 shrink-0"
              title="Listen to exercise prompt"
            >
              <Volume2 className={`h-3.5 w-3.5 ${isPlaying ? 'text-primary-600 animate-pulse' : 'text-ink-500'}`} />
              {isPlaying ? 'Listening...' : 'Listen'}
            </button>
          </div>
        </div>

        {/* Framework Guidance */}
        <div className="card mb-6 animate-slide-up border-primary-200 bg-primary-50/30 p-6" style={{ animationDelay: '180ms' }}>
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                Framework to follow:
              </p>
              <p className="mt-1 font-mono text-xs font-semibold text-primary-900">
                {frameworkLabel || framework.join(' → ')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {framework.map((step: string, i: number) => (
                  <div key={step} className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium text-ink-700">{step}</span>
                    {i < framework.length - 1 && <span className="text-ink-300">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Success Condition */}
        <div className="card mb-6 animate-slide-up p-4" style={{ animationDelay: '240ms' }}>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div>
              <p className="text-xs font-semibold text-ink-700">Success condition</p>
              <p className="mt-0.5 text-xs text-ink-600">{successCondition}</p>
            </div>
          </div>
        </div>

        {/* Voice Recording / Response Input Area */}
        {!submitted ? (
          <div className="card p-6 animate-slide-up space-y-4" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-ink-800">
                Your Practice Response (Voice-first)
              </label>
              <span className="text-xs text-ink-400">
                {response.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            {/* Voice Control Bar */}
            <div className="rounded-xl border border-ink-200 bg-ink-50/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {isRecording ? (
                  <button
                    onClick={handleStopVoice}
                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition-all active:scale-95"
                  >
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    Finish Speaking
                  </button>
                ) : (
                  <button
                    onClick={handleStartVoice}
                    className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-700 transition-all active:scale-95"
                  >
                    <Mic className="h-4 w-4" />
                    Speak Response
                  </button>
                )}
                <span className="text-xs text-ink-500">
                  {isRecording ? 'Listening to your speech...' : 'Click to answer with voice'}
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
              className="input-field resize-y font-normal"
            />

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-ink-400">
                Tip: Walk through the steps in order: User, Problem, Goal, Options, Trade-off.
              </p>
              <button
                onClick={handleSubmit}
                disabled={!response.trim() || isSubmitting}
                className="btn-primary py-2.5 px-6 text-xs font-semibold"
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
          <div className="animate-slide-up space-y-5">
            {/* Met Condition Card */}
            <div
              className={`card p-6 border ${
                evaluation?.met
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : 'border-accent-300 bg-accent-50/40'
              }`}
            >
              <div className="flex items-start gap-3">
                {evaluation?.met ? (
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                ) : (
                  <Target className="mt-0.5 h-6 w-6 shrink-0 text-accent-600" />
                )}
                <div>
                  <h3 className="text-base font-bold text-ink-900">
                    {evaluation?.met
                      ? 'Success condition met ✓'
                      : 'Good progress — keep refining'}
                  </h3>
                  <p className="mt-1 text-sm text-ink-600 leading-relaxed">
                    {evaluation?.feedback ||
                      (evaluation?.met
                        ? 'Your response demonstrates the targeted behavior and established clear structure.'
                        : 'Your response showed parts of the framework, but make sure to fully define the user and problem before proposing solutions.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Criteria Checklist */}
            <div className="card p-5">
              <p className="mb-3 section-label">Evaluation Criteria Checklist</p>
              <div className="space-y-2.5">
                {criteriaList.map((criterion: string) => {
                  const isMet = evaluation?.metCriteria.some(
                    c =>
                      criterion.toLowerCase().includes(c.toLowerCase().slice(0, 10)) ||
                      c.toLowerCase().includes(criterion.toLowerCase().slice(0, 10))
                  );
                  return (
                    <div key={criterion} className="flex items-start gap-2.5 text-xs">
                      {isMet ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" />
                      )}
                      <span className={isMet ? 'font-medium text-ink-800' : 'text-ink-400'}>
                        {criterion}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Your Response */}
            <div className="card p-5 bg-ink-50/60">
              <p className="mb-2 section-label">Your Spoken Practice Response</p>
              <p className="text-xs leading-relaxed text-ink-700 whitespace-pre-wrap">
                "{response}"
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button onClick={handleRetry} className="btn-secondary py-3 px-5 text-xs">
                <RotateCcw className="h-4 w-4" />
                Practice Again
              </button>
              <button onClick={handleContinue} className="btn-primary flex-1 py-3 text-sm font-semibold">
                Start Second Interview (Reattempt)
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
