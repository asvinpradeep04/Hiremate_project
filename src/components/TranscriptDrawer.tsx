import React, { useRef, useEffect } from 'react';
import { X, MessageSquare, AlertCircle, Clock } from 'lucide-react';
import type { InterviewMessage } from '@/types';

interface TranscriptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: InterviewMessage[];
}

export function TranscriptDrawer({ isOpen, onClose, messages }: TranscriptDrawerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-[#0A0A0A]/95 shadow-2xl backdrop-blur-xl animate-slide-in-right text-zinc-100"
      aria-label="Conversation Transcript"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#0E0E0E]/80">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="h-5 w-5 text-teal-400" />
          <h2 className="text-sm font-semibold tracking-tight text-white">Conversation Transcript</h2>
          <span className="badge bg-teal-500/10 text-teal-300 border border-teal-500/25 font-mono text-[10px]">
            {messages.length} {messages.length === 1 ? 'turn' : 'turns'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          title="Close transcript"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-xs font-mono text-zinc-500 py-12">
            No turns recorded yet. Spoken and typed turns will materialize here in real time.
          </p>
        ) : (
          messages.map((msg, index) => {
            const isInterviewer = msg.role === 'interviewer';
            return (
              <div
                key={msg.id || index}
                className={`p-4 rounded-xl border transition-all ${
                  isInterviewer
                    ? 'border-white/[0.08] bg-[#121212]/90 shadow-sm'
                    : 'border-teal-500/30 bg-teal-950/20 shadow-[0_0_15px_rgba(20,184,166,0.08)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                        isInterviewer ? 'text-teal-400' : 'text-emerald-400'
                      }`}
                    >
                      {isInterviewer ? 'AI Interviewer' : 'You'}
                    </span>
                    {msg.isFollowUp && (
                      <span className="badge bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[9px] font-mono">
                        <AlertCircle className="h-3 w-3" />
                        Follow-up
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(msg.timestamp || Date.now())}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap font-sans">
                  {msg.text}
                </p>

                {msg.followUpPurpose && (
                  <p className="mt-2 text-[10px] font-mono italic text-teal-300/80 border-t border-white/[0.06] pt-1.5">
                    Purpose: {msg.followUpPurpose}
                  </p>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.08] bg-[#0E0E0E]/90 px-6 py-3 text-center">
        <p className="text-[11px] font-mono text-zinc-400">
          Audio transcripts are grounded directly for evidence-first evaluation.
        </p>
      </div>
    </aside>
  );
}
