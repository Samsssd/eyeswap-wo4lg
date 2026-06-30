import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// SSR-safe storage. `expo export` prerenders every route in Node, where there is
// no `window`/`localStorage`. AsyncStorage's web build reads `window.localStorage`
// inside its methods, so Supabase's auth client crashes ("window is not defined")
// when it touches storage during init. Guard every call: no-op on the server,
// real AsyncStorage on the device / in the browser at runtime.
const ssrSafeStorage = {
  getItem: (key: string): Promise<string | null> =>
    typeof window === 'undefined' ? Promise.resolve(null) : AsyncStorage.getItem(key),
  setItem: (key: string, value: string): Promise<void> =>
    typeof window === 'undefined' ? Promise.resolve() : AsyncStorage.setItem(key, value),
  removeItem: (key: string): Promise<void> =>
    typeof window === 'undefined' ? Promise.resolve() : AsyncStorage.removeItem(key),
};

/**
 * Single shared Supabase client for the whole app. Reads & writes happen directly
 * on the device with the anon key; the auth session is persisted to AsyncStorage
 * (no-op during the web-export prerender — see ssrSafeStorage above).
 *
 * Import it everywhere as: `import { supabase } from '@/lib/supabase/client'`.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ssrSafeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
