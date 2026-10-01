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
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-ink-200 bg-white shadow-2xl animate-slide-in-right"
      aria-label="Conversation Transcript"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ink-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary-600" />
          <h2 className="text-base font-bold text-ink-900">Conversation Transcript</h2>
          <span className="badge bg-ink-100 text-ink-600 font-mono text-[10px]">
            {messages.length} {messages.length === 1 ? 'turn' : 'turns'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors"
          title="Close transcript"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-ink-400 py-10">
            No turns recorded yet. Conversation will appear here in real time.
          </p>
        ) : (
          messages.map((msg, index) => {
            const isInterviewer = msg.role === 'interviewer';
            return (
              <div
                key={msg.id || index}
                className={`p-4 rounded-xl border transition-all ${
                  isInterviewer
                    ? 'border-ink-200 bg-ink-50/60'
                    : 'border-primary-200 bg-primary-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isInterviewer ? 'text-primary-700' : 'text-emerald-700'
                      }`}
                    >
                      {isInterviewer ? 'AI Interviewer' : 'You'}
                    </span>
                    {msg.isFollowUp && (
                      <span className="badge bg-amber-100 text-amber-800 text-[10px]">
                        <AlertCircle className="h-3 w-3" />
                        Follow-up
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-ink-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(msg.timestamp || Date.now())}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-ink-800 whitespace-pre-wrap">
                  {msg.text}
                </p>

                {msg.followUpPurpose && (
                  <p className="mt-2 text-[11px] italic text-ink-500 border-t border-ink-200/50 pt-1.5">
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
      <div className="border-t border-ink-100 bg-ink-50/80 px-6 py-3 text-center">
        <p className="text-xs text-ink-400">
          Audio transcripts are used directly for evidence-first evaluation.
        </p>
      </div>
    </aside>
  );
}
