import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().default('pratie-super-secret-jwt-key-2026-luxury'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  DASHBOARD_URL: z.string().default('http://localhost:3001'),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_luxury_pratie_mock'),
  RAZORPAY_KEY_SECRET: z.string().default('rzp_secret_luxury_pratie_mock')
});

export const env = envSchema.parse(process.env);
