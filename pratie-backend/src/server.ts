import { createApp } from './app.js';
import { env } from './config/env.js';

export const app = createApp();
const PORT = parseInt(env.PORT, 10) || 5000;

// Only start long-lived HTTP listener when running outside Vercel serverless runtime
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✨ Pratie E-Commerce REST API running on http://localhost:${PORT}`);
    console.log(`📊 Health check available at: http://localhost:${PORT}/api/health`);
  });
}

export default app;
