import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Square,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Edit3,
  Send,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { CompetencyIcon } from '@/components/CompetencyIcon';
import { AudioWaveform } from '@/components/AudioWaveform';
import { InterviewerAvatar } from '@/components/InterviewerAvatar';
import { TranscriptDrawer } from '@/components/TranscriptDrawer';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { COMPETENCIES } from '@/data/rubric';
import type {
  Attempt,
  AttemptNumber,
  CasePrompt,
  InterviewMessage,
  CandidateResponse,
  EvidenceItem,
  SetupData,
} from '@/types';

interface InterviewProps {
  setup: SetupData;
  casePrompt: CasePrompt;
  attemptNumber: AttemptNumber;
  existingAttemptId?: string;
  onComplete: (attempt: Attempt) => void;
  onExit: () => void;
}

type InterviewPhase =
  | 'interviewer_speaking'
  | 'idle_listening'
  | 'candidate_speaking'
  | 'processing'
  | 'transitioning'
  | 'complete';

export function Interview({
  setup,
  casePrompt,
  attemptNumber,
  existingAttemptId,
  onComplete,
  onExit,
}: InterviewProps) {
  // Backend identifiers
  const [attemptId, setAttemptId] = useState<string | null>(existingAttemptId || null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Interview state
  const [phase, setPhase] = useState<InterviewPhase>('interviewer_speaking');
  const [currentCompetencyIndex, setCurrentCompetencyIndex] = useState(0);
  const [followUpCount, setFollowUpCount] = useState(0);
  const [totalFollowUps, setTotalFollowUps] = useState(0);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [currentQuestionText, setCurrentQuestionText] = useState<string>(casePrompt.prompt);

  // Candidate Response State (Voice + Type Fallback)
  const [candidateText, setCandidateText] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  // Timers
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [speakingSeconds, setSpeakingSeconds] = useState(0);

  // UI state
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Audio Hook
  const {
    isRecording,
    isPlaying,
    transcript,
    interimTranscript,
    frequencies,
    volumeLevel,
    speakerVolume,
    isMuted,
    error: micError,
    hasPermission,
    requestPermission,
    startRecording,
    stopRecording,
    cancelRecording,
    speakText,
    stopSpeaking,
    replayLastSpeech,
    setSpeakerVolume,
    toggleMute,
  } = useAudioRecorder();

  // Sync voice transcription into candidateText in real time
  useEffect(() => {
    if (isRecording) {
      const full = (transcript + (interimTranscript ? ' ' + interimTranscript : '')).trim();
      if (full) {
        setCandidateText(full);
        setSpeechNotice(null);
      }
    }
  }, [isRecording, transcript, interimTranscript]);

  // Elapsed interview timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Candidate speaking duration timer
  useEffect(() => {
    let timer: any = null;
    if (phase === 'candidate_speaking') {
      timer = setInterval(() => {
        setSpeakingSeconds(s => s + 1);
      }, 1000);
    } else {
      setSpeakingSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase]);

  // ─── Initialize or Restore Interview State from Backend ───
  useEffect(() => {
    let isMounted = true;

    async function initInterview() {
      try {
        setConnectionError(null);

        // Check if there's a cached attemptId in sessionStorage
        const cachedAttemptId = attemptId || sessionStorage.getItem(`active_attempt_${attemptNumber}`);

        if (cachedAttemptId) {
          // Attempt to restore existing attempt state (survives refresh!)
          const res = await fetch(`/api/interviews/${cachedAttemptId}`);
          if (res.ok) {
            const data = await res.json();
            if (isMounted && data.attempt) {
              setAttemptId(data.attempt.id);
              setSessionId(data.attempt.session_id);
              setCurrentCompetencyIndex(data.attempt.current_competency_index || 0);
              setFollowUpCount(data.attempt.follow_up_count || 0);
              setTotalFollowUps(data.attempt.total_follow_ups || 0);

              if (data.transcripts && data.transcripts.length > 0) {
                setMessages(data.transcripts);
                const lastInterviewerMsg = [...data.transcripts]
                  .reverse()
                  .find((m: any) => m.role === 'interviewer');
                if (lastInterviewerMsg) {
                  setCurrentQuestionText(lastInterviewerMsg.text);
                }
              }

              setPhase('idle_listening');
              return;
            }
          }
        }

        // Otherwise create new interview attempt
        const res = await fetch('/api/interviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain: setup.domain,
            experienceLevel: setup.experienceLevel,
            attemptNumber,
            targetRole: setup.targetRole,
            interviewMode: setup.interviewMode,
            companyName: setup.companyName,
            companyServices: setup.companyServices,
            jobDescription: setup.jobDescription,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to create interview attempt on server');
        }

        const data = await res.json();
        if (isMounted) {
          setAttemptId(data.attempt.id);
          setSessionId(data.session.id);
          sessionStorage.setItem(`active_attempt_${attemptNumber}`, data.attempt.id);

          const prompt = data.initialQuestion || casePrompt.prompt;
          setCurrentQuestionText(prompt);

          if (data.transcripts) {
            setMessages(data.transcripts);
          }

          // Initial interviewer greeting
          setPhase('interviewer_speaking');
          speakText(prompt, () => {
            if (isMounted) setPhase('idle_listening');
          });
        }
      } catch (err: any) {
        if (isMounted) {
          setConnectionError(err.message || 'Could not connect to interview server');
        }
      }
    }

    initInterview();

    return () => {
      isMounted = false;
      stopSpeaking();
      cancelRecording();
    };
  }, [attemptNumber, casePrompt.prompt, setup.domain, setup.experienceLevel]);

  // Current active competency
  const currentCompetency = COMPETENCIES[currentCompetencyIndex] || COMPETENCIES[0];

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ─── Submit Response to Backend (Used by Voice & Text input) ───
  const submitCandidateResponse = async (textToSubmit: string) => {
    const trimmed = textToSubmit.trim();
    if (!trimmed || trimmed.length < 5) {
      setSpeechNotice('Please provide an answer before submitting.');
      setShowTextInput(true);
      setPhase('idle_listening');
      return;
    }

    if (!attemptId) return;

    setPhase('processing');
    setSpeechNotice(null);

    try {
      const res = await fetch(`/api/interviews/${attemptId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responseText: trimmed,
          competencyId: currentCompetency.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Server error while saving candidate response');
      }

      const result = await res.json();

      // Clear local input
      setCandidateText('');
      setShowTextInput(false);

      // Refresh transcripts from server
      const transRes = await fetch(`/api/interviews/${attemptId}/transcript`);
      if (transRes.ok) {
        const transData = await transRes.json();
        setMessages(transData.transcripts || []);
      }

      if (result.type === 'follow_up') {
        // AI follow-up
        setFollowUpCount(prev => prev + 1);
        setTotalFollowUps(prev => prev + 1);
        setCurrentQuestionText(result.question);
        setPhase('interviewer_speaking');

        speakText(result.question, () => {
          setPhase('idle_listening');
        });
      } else if (result.type === 'advance') {
        // Advance to next competency
        setFollowUpCount(0);
        setCurrentCompetencyIndex(result.nextIndex);
        setCurrentQuestionText(result.nextPrompt);
        setPhase('transitioning');

        speakText(result.fullNextMessage, () => {
          setPhase('idle_listening');
        });
      } else if (result.type === 'complete') {
        // Interview complete! Generate debrief evaluation
        setPhase('complete');
        speakText(result.transitionMessage || 'That concludes the interview. Compiling evaluation.');

        const evalRes = await fetch(`/api/interviews/${attemptId}/evaluate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (evalRes.ok) {
          const evalData = await evalRes.json();
          const fullAttempt: Attempt = {
            attemptId,
            attemptNumber,
            caseId: casePrompt.id,
            rubricVersion: evalData.rubricVersion || 'ps_v1.0',
            modelVersion: evalData.modelVersion || 'sim_v1.0',
            status: 'completed',
            startedAt: startTime,
            completedAt: Date.now(),
            messages,
            responses: [],
            evidence: evalData.evidence || [],
            assessments: evalData.assessments || [],
            feedback: evalData.feedback || [],
            practiceExercise: evalData.practiceExercise || evalData.practice || null,
            practiceResponse: null,
            overallRating: evalData.overallRating || 2,
          };
          sessionStorage.removeItem(`active_attempt_${attemptNumber}`);
          onComplete(fullAttempt);
        }
      }
    } catch (err: any) {
      setConnectionError(err.message || 'Failed to submit response. Please retry.');
      setPhase('idle_listening');
    }
  };

  // ─── Candidate Voice Controls ───
  const handleStartSpeaking = async () => {
    setConnectionError(null);
    setSpeechNotice(null);
    stopSpeaking();

    // Check mic permission first
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        setShowTextInput(true);
        return;
      }
    }

    setPhase('candidate_speaking');
    await startRecording();
  };

  const handleFinishSpeaking = async () => {
    const spokenText = await stopRecording();
    const finalAnswer = (spokenText || candidateText).trim();

    if (!finalAnswer || finalAnswer.length < 5) {
      // Browser didn't transcribe speech (e.g. network/privacy restriction) -> show input box immediately
      setSpeechNotice('No speech detected by your browser. You can speak again or type your answer below.');
      setShowTextInput(true);
      setPhase('idle_listening');
      return;
    }

    await submitCandidateResponse(finalAnswer);
  };

  const handleReplayQuestion = () => {
    if (currentQuestionText) {
      setPhase('interviewer_speaking');
      speakText(currentQuestionText, () => {
        setPhase('idle_listening');
      });
    }
  };

  const handleEndEarly = async () => {
    if (!attemptId) {
      onExit();
      return;
    }
    setPhase('processing');
    try {
      const evalRes = await fetch(`/api/interviews/${attemptId}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (evalRes.ok) {
        const evalData = await evalRes.json();
        const fullAttempt: Attempt = {
          attemptId,
          attemptNumber,
          caseId: casePrompt.id,
          rubricVersion: 'ps_v1.0',
          modelVersion: 'sim_v1.0',
          status: 'completed',
          startedAt: startTime,
          completedAt: Date.now(),
          messages,
          responses: [],
          evidence: evalData.evidence || [],
          assessments: evalData.assessments || [],
          feedback: evalData.feedback || [],
          practiceExercise: evalData.practiceExercise || null,
          practiceResponse: null,
          overallRating: evalData.overallRating || 2,
        };
        onComplete(fullAttempt);
      } else {
        onExit();
      }
    } catch {
      onExit();
    }
  };

  // Waveform state helper
  const getWaveformState = () => {
    if (isPlaying || phase === 'interviewer_speaking' || phase === 'transitioning') {
      return 'playing';
    }
    if (isRecording || phase === 'candidate_speaking') {
      return 'speaking';
    }
    if (phase === 'processing') {
      return 'processing';
    }
    return 'idle';
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-[#F5F5F5] relative overflow-hidden">
      {/* ─── Header ─── */}
      <Header
        onLogoClick={() => setShowExitConfirm(true)}
        rightContent={
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Live Timer */}
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-teal-300 bg-[#0E0E0E] border border-white/10 px-3 py-1.5 rounded-xl shadow-xs">
              <Clock className="h-3.5 w-3.5 text-teal-400" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            {/* Attempt Badge */}
            <span className="badge bg-teal-500/10 text-teal-300 font-mono text-[10px] font-bold border border-teal-500/30">
              Attempt {attemptNumber}
            </span>

            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
              </span>
              <span>Simulation active</span>
            </div>

            {/* View Transcript Button */}
            <button
              onClick={() => setIsTranscriptOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#121212] px-3.5 py-1.5 text-xs font-mono font-medium text-zinc-300 shadow-sm hover:border-teal-400 hover:text-white transition-all cursor-pointer"
              title="Open full transcript"
            >
              <MessageSquare className="h-3.5 w-3.5 text-teal-400" />
              <span className="hidden md:inline">Transcript</span>
              {messages.length > 0 && (
                <span className="ml-1 rounded-full bg-teal-500/20 px-1.5 py-0.2 text-[10px] font-bold text-teal-300 border border-teal-500/30">
                  {messages.length}
                </span>
              )}
            </button>
          </div>
        }
      />

      {/* ─── Competency Progress Bar ─── */}
      <nav
        className="border-b border-white/[0.06] bg-[#080808]/90 backdrop-blur-md px-6 py-2.5"
        aria-label="Interview Competency Progress"
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between sm:justify-center gap-3 sm:gap-8 overflow-x-auto no-scrollbar">
          {COMPETENCIES.map((comp, idx) => {
            const isCompleted = idx < currentCompetencyIndex;
            const isCurrent = idx === currentCompetencyIndex;
            return (
              <div
                key={comp.id}
                className={`flex items-center gap-2 text-xs font-mono transition-colors shrink-0 ${
                  isCurrent
                    ? 'text-teal-300 font-bold'
                    : isCompleted
                    ? 'text-zinc-400'
                    : 'text-zinc-600'
                }`}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                    isCurrent
                      ? 'border-2 border-teal-400 bg-teal-500/20 text-teal-300 shadow-[0_0_10px_#2dd4bf]'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'border border-white/10 bg-white/5 text-zinc-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  ) : isCurrent ? (
                    '●'
                  ) : (
                    '○'
                  )}
                </div>
                <span>{comp.shortName}</span>
              </div>
            );
          })}
        </div>
      </nav>

      {/* ─── Error Notification ─── */}
      {(connectionError || micError) && (
        <aside
          className="border-b border-rose-500/30 bg-rose-950/40 px-6 py-3 text-xs text-rose-300 animate-slide-up backdrop-blur-md"
          aria-label="Error Notice"
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{connectionError || micError}</span>
            </div>
            <button
              onClick={() => {
                setConnectionError(null);
                requestPermission();
              }}
              className="btn-secondary py-1 px-3 text-xs text-rose-200 border-rose-500/40 hover:bg-rose-900/40"
            >
              Try Again
            </button>
          </div>
        </aside>
      )}

      {/* ─── Main AI Interviewer Area (Focused Minimal Stage) ─── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-6 sm:py-10">
        <div className="w-full max-w-2xl text-center space-y-6">
          {/* Status Label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0E0E0E]/90 px-4 py-1.5 shadow-md backdrop-blur-md">
            {phase === 'interviewer_speaking' || isPlaying ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
                </span>
                <span className="font-mono text-xs font-semibold text-teal-300">
                  Interviewer speaking
                </span>
              </>
            ) : phase === 'candidate_speaking' || isRecording ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-xs font-semibold text-emerald-300">
                  Listening — {formatTimer(speakingSeconds)}
                </span>
              </>
            ) : phase === 'processing' ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400 animate-spin" />
                </span>
                <span className="font-mono text-xs font-semibold text-amber-300">
                  Evaluating response with Gemini...
                </span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-zinc-600" />
                <span className="font-mono text-xs font-semibold text-zinc-400">
                  Ready for your answer
                </span>
              </>
            )}
          </div>

          {/* Central Avatar */}
          <div className="my-2">
            <InterviewerAvatar
              state={
                isPlaying || phase === 'interviewer_speaking'
                  ? 'playing'
                  : isRecording || phase === 'candidate_speaking'
                  ? 'speaking'
                  : phase === 'processing'
                  ? 'processing'
                  : 'idle'
              }
              size="md"
            />
          </div>

          {/* Live Waveform */}
          <div className="py-2">
            <AudioWaveform
              state={getWaveformState()}
              frequencies={frequencies}
              height={50}
              barCount={32}
            />
          </div>

          {/* Prominent Interviewer Question Text */}
          <div className="min-h-[96px] flex items-center justify-center px-4">
            <p className="font-serif text-lg sm:text-2xl font-medium leading-relaxed text-zinc-100 transition-all">
              "{currentQuestionText}"
            </p>
          </div>

          {/* Speech Detection Notice / Guidance */}
          {speechNotice && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-3.5 text-xs text-amber-200 flex items-center justify-between gap-3 text-left animate-slide-up backdrop-blur-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>{speechNotice}</span>
              </div>
              <button
                onClick={() => setShowTextInput(true)}
                className="font-mono text-[11px] font-bold underline text-amber-300 hover:text-amber-100 shrink-0 cursor-pointer"
              >
                Open Text Box
              </button>
            </div>
          )}

          {/* Real-time Candidate Speech Preview */}
          {(phase === 'candidate_speaking' || isRecording) && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4.5 animate-fade-in shadow-lg text-left backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Transcribing Your Speech in Real Time...
                </p>
                <span className="text-[11px] font-mono font-semibold text-emerald-400">
                  {formatTimer(speakingSeconds)}
                </span>
              </div>
              <p className="text-sm text-zinc-100 min-h-[40px] bg-black/40 p-3.5 rounded-xl border border-emerald-500/20 font-sans leading-relaxed">
                {candidateText || 'Listening to microphone. Speak your answer clearly...'}
              </p>
            </div>
          )}

          {/* Text Input / Edit Fallback Area */}
          {(showTextInput || (!isRecording && phase === 'idle_listening' && candidateText.length > 0)) && (
            <div className="rounded-2xl border border-teal-500/40 bg-[#0E0E0E] p-5 shadow-2xl text-left animate-fade-in space-y-3.5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2 uppercase tracking-wide">
                  <Edit3 className="h-3.5 w-3.5 text-teal-400" />
                  Your PM Answer:
                </label>
                <span className="font-mono text-[11px] text-zinc-500">
                  {candidateText.length} characters
                </span>
              </div>
              <textarea
                value={candidateText}
                onChange={e => setCandidateText(e.target.value)}
                placeholder="Type or refine your answer here (e.g. identify user segments, define problem, explore options and trade-offs)..."
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-[#050505] p-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 font-sans leading-relaxed"
              />
              <div className="flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setShowTextInput(false)}
                  className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => submitCandidateResponse(candidateText)}
                  disabled={candidateText.trim().length < 5 || phase === 'processing'}
                  className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Send className="h-3 w-3" />
                  Submit Answer
                </button>
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {phase === 'processing' && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs font-mono font-medium text-amber-200 animate-pulse-soft">
              Your response has been saved. Gemini is evaluating competencies and extracting evidence...
            </div>
          )}
        </div>
      </main>

      {/* ─── Bottom Functional Microphone & Audio Controls ─── */}
      <footer className="border-t border-white/[0.08] bg-[#0A0A0A]/95 shadow-[0_-4px_30px_rgba(0,0,0,0.8)] px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl flex-col sm:flex-row items-center justify-between gap-4">
          {/* Audio Controls Left: Replay & Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReplayQuestion}
              disabled={phase === 'candidate_speaking' || phase === 'processing'}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#121212] px-3.5 py-2 text-xs font-mono font-medium text-zinc-300 hover:border-teal-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer shadow-xs"
              title="Replay interviewer question"
            >
              <RotateCcw className="h-3.5 w-3.5 text-teal-400" />
              Replay
            </button>

            {/* Mute / Speaker Toggle */}
            <button
              onClick={toggleMute}
              className={`rounded-xl border px-3.5 py-2 text-xs font-mono font-medium transition-all shadow-xs cursor-pointer ${
                isMuted
                  ? 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                  : 'border-white/10 bg-[#121212] text-zinc-300 hover:border-teal-400 hover:text-white'
              }`}
              title={isMuted ? 'Unmute AI speaker' : 'Mute AI speaker'}
            >
              {isMuted ? (
                <div className="flex items-center gap-1.5">
                  <VolumeX className="h-3.5 w-3.5 text-amber-400" />
                  Muted
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5 text-teal-400" />
                  Audio On
                </div>
              )}
            </button>

            {/* Type Answer Toggle */}
            <button
              onClick={() => setShowTextInput(prev => !prev)}
              disabled={phase === 'processing'}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#121212] px-3.5 py-2 text-xs font-mono font-medium text-zinc-300 hover:border-teal-400 hover:text-white transition-all shadow-xs cursor-pointer"
              title="Type or edit your response manually"
            >
              <Edit3 className="h-3.5 w-3.5 text-teal-400" />
              {showTextInput ? 'Hide Text' : 'Type Answer'}
            </button>
          </div>

          {/* Center: Primary Functional Microphone Button */}
          <div>
            {phase === 'candidate_speaking' || isRecording ? (
              <button
                onClick={handleFinishSpeaking}
                className="group inline-flex items-center gap-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white px-7 py-3.5 text-sm font-bold shadow-[0_0_30px_rgba(244,63,94,0.6)] transition-all active:scale-95 cursor-pointer"
              >
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
                </span>
                Finish Answer
                <span className="rounded bg-rose-950/80 px-2 py-0.5 text-xs font-mono">
                  {formatTimer(speakingSeconds)}
                </span>
              </button>
            ) : (
              <button
                onClick={handleStartSpeaking}
                disabled={phase === 'processing'}
                className="btn-primary group inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-sm font-bold shadow-[0_0_30px_rgba(45,212,191,0.6)] cursor-pointer"
              >
                <Mic className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Start Answer
              </button>
            )}
          </div>

          {/* Right: End Interview Early button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExitConfirm(true)}
              className="text-xs font-mono text-zinc-500 hover:text-rose-400 transition-colors font-medium px-2 py-1 cursor-pointer"
            >
              End Interview
            </button>
          </div>
        </div>
      </footer>

      {/* ─── Collapsible Conversation Transcript Drawer ─── */}
      <TranscriptDrawer
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        messages={messages}
      />

      {/* ─── Exit Confirmation Modal ─── */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#0E0E0E] p-6 shadow-2xl border border-white/10">
            <h3 className="text-base font-bold text-white">End this interview?</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Ending now will generate a debrief evaluation based on the responses recorded so far.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="btn-secondary py-2 px-4 text-xs cursor-pointer"
              >
                Continue Interview
              </button>
              <button
                onClick={handleEndEarly}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              >
                End & Evaluate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
