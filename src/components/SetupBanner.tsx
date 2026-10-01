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
      <div className="border-b border-emerald-200 bg-emerald-50/80 px-4 py-2 text-xs text-emerald-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">Vercel AI Gateway Connected:</span>
            <span>
              Realtime model: <code className="font-mono text-emerald-700">{status.realtimeModel}</code> · Eval model: <code className="font-mono text-emerald-700">{status.evaluationModel}</code>
            </span>
          </div>
          <span className="badge bg-emerald-100 text-emerald-800 font-semibold">Verified Live</span>
        </div>
      </div>
    );
  }

  // If configured but not verified yet, or if missing key
  if (!status.configured) {
    return (
      <aside
        className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"
        aria-label="AI Gateway Configuration"
      >
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">
                AI Gateway Configuration Required for Live Realtime Voice
              </p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                Add <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[11px] text-amber-900">AI_GATEWAY_API_KEY=...</code> inside <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[11px] text-amber-900">.env.local</code> on the server.
                The browser will automatically receive short-lived credentials. High-fidelity voice simulation is active in the meantime.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm hover:bg-amber-100/60 active:scale-95 transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              Verify Connection
            </button>
          </div>
        </div>

        {verifyResult && !verifyResult.verified && (
          <div className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">
            Verification status: {verifyResult.error || 'API key missing in .env.local'}
          </div>
        )}
      </aside>
    );
  }

  return null;
}
