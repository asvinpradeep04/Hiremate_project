import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, RefreshCw, Key } from 'lucide-react';

interface SetupStatus {
  configured: boolean;
  realtimeModel: string;
  evaluationModel: string;
  message?: string;
  verified?: boolean;
}

export function SetupBanner({ onStatusChange }: { onStatusChange?: (status: SetupStatus) => void }) {
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/setup/status');
      const data = await res.json();
      setStatus(data);
      onStatusChange?.(data);
    } catch {
      // Offline / server not ready
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch('/api/verify', { method: 'POST' });
      const data = await res.json();
      setVerifyResult(data);
      if (data.verified) {
        setStatus(prev => (prev ? { ...prev, configured: true, verified: true } : null));
      }
    } catch (e: any) {
      setVerifyResult({ verified: false, error: e.message });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!status) return null;

  // If already configured and verified, show a subtle green pill or nothing
  if (status.configured && verifyResult?.verified) {
    return (
      <div className="border-b border-emerald-500/20 bg-emerald-950/40 px-4 py-2 text-xs text-emerald-300 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold">Vercel AI Gateway Connected:</span>
            <span>
              Realtime model: <code className="font-mono text-emerald-300 bg-emerald-900/40 px-1 py-0.5 rounded">{status.realtimeModel}</code> · Eval model: <code className="font-mono text-emerald-300 bg-emerald-900/40 px-1 py-0.5 rounded">{status.evaluationModel}</code>
            </span>
          </div>
          <span className="badge bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">Verified Live</span>
        </div>
      </div>
    );
  }

  // If configured but not verified yet, or if missing key
  if (!status.configured) {
    return (
      <aside
        className="border-b border-amber-500/20 bg-amber-950/25 px-4 py-2.5 text-xs text-amber-200/90 backdrop-blur-md"
        aria-label="AI Gateway Configuration"
      >
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-100">
                AI Gateway Configuration Required for Live Realtime Voice
              </p>
              <p className="mt-0.5 text-amber-300/80 leading-relaxed text-[11px]">
                Add <code className="rounded bg-amber-900/40 px-1 py-0.5 font-mono text-[10px] text-amber-200 border border-amber-500/20">AI_GATEWAY_API_KEY=...</code> inside <code className="rounded bg-amber-900/40 px-1 py-0.5 font-mono text-[10px] text-amber-200 border border-amber-500/20">.env.local</code>. High-fidelity voice simulation is active in the meantime.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-900/40 px-3 py-1.5 text-xs font-semibold text-amber-200 shadow-sm hover:bg-amber-800/40 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              Verify Connection
            </button>
          </div>
        </div>

        {verifyResult && !verifyResult.verified && (
          <div className="mt-2 text-xs text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-500/30">
            Verification status: {verifyResult.error || 'API key missing in .env.local'}
          </div>
        )}
      </aside>
    );
  }

  return null;
}
