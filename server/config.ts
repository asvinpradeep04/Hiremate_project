import fs from 'node:fs';
import path from 'node:path';

// Helper to safely load .env.local without exposing secrets
export function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let value = trimmed.slice(eqIdx + 1).trim();
          // Remove surrounding quotes if present
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }
          if (key) {
            process.env[key] = value;
          }
        }
      }
    } catch {
      // Ignore read errors
    }
  }
}

// Initial load
loadEnvLocal();

export const config = {
  get aiGatewayApiKey(): string {
    loadEnvLocal();
    return (
      process.env.AI_GATEWAY_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      ''
    );
  },
  get geminiApiKey(): string {
    loadEnvLocal();
    return (
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.AI_GATEWAY_API_KEY ||
      ''
    );
  },
  get isConfigured(): boolean {
    return Boolean(this.aiGatewayApiKey && this.aiGatewayApiKey.trim().length > 0);
  },
  get realtimeModel(): string {
    return process.env.REALTIME_MODEL || 'openai/gpt-realtime-2';
  },
  get evaluationModel(): string {
    return process.env.EVALUATION_MODEL || 'gemini-1.5-flash';
  },
  rubricVersion: 'ps_v1.0',
  promptVersion: 'interviewer_v1.0',
  caseVersion: 'cases_v1.0',
  maxFollowUpsPerCompetency: 2,
  maxTotalFollowUps: 8,
};
