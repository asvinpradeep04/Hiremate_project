import type { Plugin, ViteDevServer } from 'vite';
import { handleApiRoute } from './routes';
import { loadEnvLocal } from './config';

export function apiServerPlugin(): Plugin {
  return {
    name: 'interview-api-server',
    configureServer(server: ViteDevServer) {
      // Reload env vars from .env.local on dev server start
      loadEnvLocal();

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
        if (url.pathname.startsWith('/api/')) {
          const handled = await handleApiRoute(req, res, url.pathname);
          if (handled) return;
        }
        next();
      });
    },
  };
}
