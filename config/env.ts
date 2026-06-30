import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  EXPO_PUBLIC_APP_ID: z.string().optional(),
  EXPO_PUBLIC_MOBILE_API_TOKEN: z.string().optional(),
  EXPO_PUBLIC_ENV: z.enum(['development', 'preview', 'production']).default('development'),
});

const parsed = envSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  EXPO_PUBLIC_APP_ID: process.env.EXPO_PUBLIC_APP_ID,
  EXPO_PUBLIC_MOBILE_API_TOKEN: process.env.EXPO_PUBLIC_MOBILE_API_TOKEN,
  EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
});

export const env = parsed;
export type Env = z.infer<typeof envSchema>;
