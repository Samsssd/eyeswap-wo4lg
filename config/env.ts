import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_ENV: z.enum(['development', 'preview', 'production']).default('development'),
});

const parsed = envSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
});

export const env = parsed;
export type Env = z.infer<typeof envSchema>;
