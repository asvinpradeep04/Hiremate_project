import { useState, useEffect } from 'react';
import { Landing } from '@/screens/Landing';
import { Setup } from '@/screens/Setup';
import { Interview } from '@/screens/Interview';
import { Debrief } from '@/screens/Debrief';
import { Practice } from '@/screens/Practice';
import { Comparison } from '@/screens/Comparison';
import { SetupBanner } from '@/components/SetupBanner';
import { CustomCursor } from '@/components/CustomCursor';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { getCaseForDomain } from '@/data/cases';
import { compareAttempts } from '@/data/simulation';
import { resetCounters } from '@/data/simulation';
import type { Attempt, AttemptComparison, SetupData } from '@/types';

type Screen =
  | 'landing'
  | 'setup'
  | 'interview1'
  | 'debrief1'
  | 'practice'
  | 'interview2'
  | 'comparison';

const STORAGE_KEY = 'ai_interview_state_v1';

export function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.screen && parsed.screen !== 'landing') return parsed.screen;
      }
    } catch {}
    return 'landing';
  });

  const [setupData, setSetupData] = useState<SetupData | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).setupData || null;
    } catch {}
    return null;
  });

  const [attempt1, setAttempt1] = useState<Attempt | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).attempt1 || null;
    } catch {}
    return null;
  });

  const [attempt2, setAttempt2] = useState<Attempt | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).attempt2 || null;
    } catch {}
    return null;
  });

  const [comparison, setComparison] = useState<AttemptComparison | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).comparison || null;
    } catch {}
    return null;
  });

  // Screen Transition State
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // Trigger page transition whenever screen changes
  useEffect(() => {
    setIsPageTransitioning(true);
    const timeout = setTimeout(() => {
      setIsPageTransitioning(false);
    }, 450);
    return () => clearTimeout(timeout);
  }, [screen]);

  // Persist session state to survive browser refreshes (Section 9 & 33)
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          screen,
          setupData,
          attempt1,
          attempt2,
          comparison,
        })
      );
    } catch {}
  }, [screen, setupData, attempt1, attempt2, comparison]);

  const handleStart = () => {
    // Record landing_viewed / setup_started event
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'setup_started' }),
    }).catch(() => {});
    setScreen('setup');
  };

  const handleSetupComplete = (data: SetupData) => {
    setSetupData(data);
    resetCounters();
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'setup_completed', metadata: data }),
    }).catch(() => {});
    setScreen('interview1');
  };

  const handleInterview1Complete = (attempt: Attempt) => {
    setAttempt1(attempt);
    setScreen('debrief1');
  };

  const handleDebriefContinue = (insightText?: string) => {
    if (insightText && attempt1) {
      setAttempt1({ ...attempt1, practiceResponse: insightText });
    }
    setScreen('practice');
  };

  const handlePracticeComplete = (practiceResponse: string) => {
    if (attempt1) {
      setAttempt1({ ...attempt1, practiceResponse });
    }
    resetCounters();
    setScreen('interview2');
  };

  const handleInterview2Complete = async (attempt: Attempt) => {
    setAttempt2(attempt);

    // Fetch backend comparison from /api/attempts/:id/comparison
    try {
      const res = await fetch(`/api/attempts/${attempt.attemptId}/comparison`);
      if (res.ok) {
        const data = await res.json();
        if (data.comparison) {
          setComparison({
            competencyDeltas: data.comparison.competencyDeltas || data.comparison.competency_deltas || [],
            behavioralChanges: data.comparison.behavioralChanges || data.comparison.behavioral_changes || [],
            overallDelta: data.comparison.overallDelta ?? data.comparison.overall_delta ?? 1,
            addressedPracticeGoal: data.comparison.addressedPracticeGoal ?? data.comparison.addressed_practice_goal ?? true,
            summary: data.comparison.summary || 'Observed improvement during the second simulation.',
          });
          setScreen('comparison');
          return;
        }
      }
    } catch (e) {
      console.warn('Backend comparison fetch failed, using client comparison fallback:', e);
    }

    // Client fallback comparison
    if (attempt1) {
      const result = compareAttempts(attempt1, attempt, attempt1.practiceExercise);
      setComparison(result);
    }
    setScreen('comparison');
  };

  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSetupData(null);
    setAttempt1(null);
    setAttempt2(null);
    setComparison(null);
    setScreen('landing');
  };

  const handleExit = () => {
    setScreen('landing');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-[#F5F5F5] relative overflow-x-hidden">
      {/* Global Background Effects: Multi-layer Parallax & Grid */}
      <BackgroundEffects />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Global Screen Page Transition Effect (Black fade + traveling teal laser line) */}
      <div
        className={`pointer-events-none fixed inset-0 z-[9990] transition-opacity duration-300 ${
          isPageTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-[#050505]/60 backdrop-blur-xs" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf] animate-laser-scan" />
      </div>

      {/* Top Banner showing AI Gateway configuration and live status */}
      <SetupBanner />

      <div className="flex-1 transition-all duration-300">
        {(() => {
          switch (screen) {
            case 'landing':
              return <Landing onStart={handleStart} />;

            case 'setup':
              return <Setup onComplete={handleSetupComplete} onBack={handleExit} />;

            case 'interview1':
              if (!setupData) {
                // Default setup if direct link or refresh without setup
                const fallbackSetup: SetupData = { domain: 'saas', experienceLevel: '0-1' };
                return (
                  <Interview
                    setup={fallbackSetup}
                    casePrompt={getCaseForDomain('saas', 1)}
                    attemptNumber={1}
                    onComplete={handleInterview1Complete}
                    onExit={handleExit}
                  />
                );
              }
              return (
                <Interview
                  setup={setupData}
                  casePrompt={getCaseForDomain(setupData.domain, 1)}
                  attemptNumber={1}
                  onComplete={handleInterview1Complete}
                  onExit={handleExit}
                />
              );

            case 'debrief1':
              if (!attempt1) return <Landing onStart={handleStart} />;
              return (
                <Debrief
                  attempt={attempt1}
                  onContinue={handleDebriefContinue}
                  onExit={handleExit}
                />
              );

            case 'practice':
              if (!attempt1) return <Landing onStart={handleStart} />;
              return (
                <Practice
                  attempt={attempt1}
                  onComplete={handlePracticeComplete}
                  onExit={handleExit}
                />
              );

            case 'interview2':
              const domainForAttempt2 = setupData?.domain || attempt1?.caseId?.split('_')[0] as any || 'saas';
              const currentSetup = setupData || { domain: domainForAttempt2, experienceLevel: '0-1' };
              return (
                <Interview
                  setup={currentSetup}
                  casePrompt={getCaseForDomain(domainForAttempt2, 2)}
                  attemptNumber={2}
                  onComplete={handleInterview2Complete}
                  onExit={handleExit}
                />
              );

            case 'comparison':
              if (!attempt1 || !attempt2 || !comparison) {
                return <Landing onStart={handleStart} />;
              }
              return (
                <Comparison
                  attempt1={attempt1}
                  attempt2={attempt2}
                  comparison={comparison}
                  onRestart={handleRestart}
                  onExit={handleExit}
                />
              );

            default:
              return <Landing onStart={handleStart} />;
          }
        })()}
      </div>
    </div>
  );
}

export default App;
