import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseAudioRecorderReturn {
  isRecording: boolean;
  isPlaying: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  volumeLevel: number; // 0 to 1
  frequencies: number[]; // Array of normalized frequency magnitudes (0-1)
  speakerVolume: number; // 0 to 1
  isMuted: boolean;
  hasPermission: boolean;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceName: string;
  setSelectedVoiceName: (name: string) => void;
  requestPermission: () => Promise<boolean>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
  cancelRecording: () => void;
  speakText: (text: string, onEnd?: () => void) => void;
  stopSpeaking: () => void;
  replayLastSpeech: () => void;
  setSpeakerVolume: (vol: number) => void;
  toggleMute: () => void;
  clearTranscript: () => void;
  setCustomTranscript: (text: string) => void;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [frequencies, setFrequencies] = useState<number[]>(new Array(24).fill(0.05));
  const [speakerVolume, setSpeakerVolumeState] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

  const isRecordingRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastSpokenTextRef = useRef<string>('');
  const lastOnEndRef = useRef<(() => void) | undefined>(undefined);
  const transcriptAccumulatorRef = useRef<string>('');
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load and populate high quality voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        // Filter for English voices
        const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
        setAvailableVoices(enVoices.length > 0 ? enVoices : allVoices);

        // Pick the best natural voice by default
        const bestVoice =
          enVoices.find(
            v =>
              v.name.includes('Natural') ||
              v.name.includes('Neural') ||
              v.name.includes('Online') ||
              v.name.includes('Jenny') ||
              v.name.includes('Guy') ||
              v.name.includes('Aria') ||
              v.name.includes('Google US English') ||
              v.name.includes('Samantha')
          ) || enVoices[0] || allVoices[0];

        if (bestVoice && !selectedVoiceName) {
          setSelectedVoiceName(bestVoice.name);
        }
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceName]);

  // Clean up streams & contexts on unmount
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Request mic permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      microphoneStreamRef.current = stream;
      setHasPermission(true);

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.7;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      return true;
    } catch (err: any) {
      setError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone access was denied. Please allow microphone permissions in browser settings.'
          : 'Could not access microphone: ' + err.message
      );
      setHasPermission(false);
      return false;
    }
  }, []);

  // Analyze frequency loop
  const updateFrequencies = useCallback(() => {
    if (!analyserRef.current || !isRecordingRef.current) {
      setVolumeLevel(0);
      setFrequencies(new Array(24).fill(0.05));
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    const bins: number[] = [];
    const step = Math.max(1, Math.floor(dataArray.length / 24));
    for (let i = 0; i < 24; i++) {
      const idx = Math.min(i * step, dataArray.length - 1);
      const val = dataArray[idx] / 255;
      bins.push(Math.max(0.08, val));
      sum += val;
    }

    const avg = sum / 24;
    setVolumeLevel(avg);
    setFrequencies(bins);

    animFrameRef.current = requestAnimationFrame(updateFrequencies);
  }, []);

  useEffect(() => {
    if (isRecording) {
      animFrameRef.current = requestAnimationFrame(updateFrequencies);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setVolumeLevel(0);
      setFrequencies(new Array(24).fill(0.05));
    }
  }, [isRecording, updateFrequencies]);

  // Start recording audio and speech recognition
  const startRecording = useCallback(async () => {
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    transcriptAccumulatorRef.current = '';
    isRecordingRef.current = true;
    setIsRecording(true);

    window.speechSynthesis?.cancel();
    setIsPlaying(false);

    if (!hasPermission || !microphoneStreamRef.current?.active) {
      const granted = await requestPermission();
      if (!granted) {
        isRecordingRef.current = false;
        setIsRecording(false);
        return;
      }
    }

    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch {}
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let final = '';
          let interim = '';

          for (let i = 0; i < event.results.length; ++i) {
            const item = event.results[i];
            if (item.isFinal) {
              final += item[0].transcript + ' ';
            } else {
              interim += item[0].transcript;
            }
          }

          const cleanFinal = final.trim();
          transcriptAccumulatorRef.current = cleanFinal;
          setTranscript(cleanFinal);
          setInterimTranscript(interim);
        };

        recognition.onerror = (e: any) => {
          if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
            setError('Microphone or Speech Recognition access was denied.');
          } else if (e.error !== 'no-speech' && e.error !== 'aborted') {
            console.warn('Speech recognition notice:', e.error);
          }
        };

        recognition.onend = () => {
          if (isRecordingRef.current) {
            try {
              recognition.start();
            } catch {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e: any) {
        console.warn('Recognition start notice:', e);
      }
    }
  }, [hasPermission, requestPermission]);

  const stopRecording = useCallback(async (): Promise<string> => {
    isRecordingRef.current = false;
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    const fullResult = (
      transcriptAccumulatorRef.current +
      (interimTranscript ? ' ' + interimTranscript : '')
    ).trim();

    setTranscript(fullResult);
    setInterimTranscript('');
    return fullResult;
  }, [interimTranscript]);

  const cancelRecording = useCallback(() => {
    isRecordingRef.current = false;
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    setTranscript('');
    setInterimTranscript('');
    transcriptAccumulatorRef.current = '';
  }, []);

  const setCustomTranscript = useCallback((text: string) => {
    transcriptAccumulatorRef.current = text;
    setTranscript(text);
  }, []);

  // Text-To-Speech: speak interviewer question with natural inflection
  const speakText = useCallback(
    (text: string, onEnd?: () => void) => {
      lastSpokenTextRef.current = text;
      lastOnEndRef.current = onEnd;

      if (typeof window === 'undefined' || !window.speechSynthesis) {
        onEnd?.();
        return;
      }

      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {}

      if (isMuted) {
        onEnd?.();
        return;
      }

      setTimeout(() => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          activeUtteranceRef.current = utterance;
          utterance.volume = speakerVolume;
          utterance.rate = 0.98; // Natural, realistic pacing
          utterance.pitch = 1.02; // Warm, professional pitch

          const allVoices = window.speechSynthesis.getVoices();
          let chosenVoice = allVoices.find(v => v.name === selectedVoiceName);

          if (!chosenVoice) {
            chosenVoice =
              allVoices.find(
                v =>
                  v.lang.startsWith('en') &&
                  (v.name.includes('Natural') ||
                    v.name.includes('Neural') ||
                    v.name.includes('Online') ||
                    v.name.includes('Jenny') ||
                    v.name.includes('Guy') ||
                    v.name.includes('Aria') ||
                    v.name.includes('Google US English') ||
                    v.name.includes('Samantha') ||
                    v.name.includes('Daniel'))
              ) || allVoices.find(v => v.lang.startsWith('en')) || allVoices[0];
          }

          if (chosenVoice) {
            utterance.voice = chosenVoice;
          }

          utterance.onstart = () => {
            setIsPlaying(true);
          };

          utterance.onend = () => {
            setIsPlaying(false);
            activeUtteranceRef.current = null;
            onEnd?.();
          };

          utterance.onerror = (e) => {
            console.warn('Speech synthesis notice/event:', e);
            setIsPlaying(false);
            activeUtteranceRef.current = null;
            onEnd?.();
          };

          window.speechSynthesis.speak(utterance);

          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        } catch (err) {
          console.warn('Speech synthesis speak failed:', err);
          setIsPlaying(false);
          onEnd?.();
        }
      }, 50);
    },
    [isMuted, selectedVoiceName, speakerVolume]
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  }, []);

  const replayLastSpeech = useCallback(() => {
    if (lastSpokenTextRef.current) {
      speakText(lastSpokenTextRef.current, lastOnEndRef.current);
    }
  }, [speakText]);

  const setSpeakerVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setSpeakerVolumeState(clamped);
    if (clamped === 0) setIsMuted(true);
    else setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (next) window.speechSynthesis?.cancel();
      return next;
    });
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    transcriptAccumulatorRef.current = '';
  }, []);

  return {
    isRecording,
    isPlaying,
    transcript,
    interimTranscript,
    error,
    volumeLevel,
    frequencies,
    speakerVolume,
    isMuted,
    hasPermission,
    availableVoices,
    selectedVoiceName,
    setSelectedVoiceName,
    requestPermission,
    startRecording,
    stopRecording,
    cancelRecording,
    speakText,
    stopSpeaking,
    replayLastSpeech,
    setSpeakerVolume,
    toggleMute,
    clearTranscript,
    setCustomTranscript,
  };
}
