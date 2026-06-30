import type { TokenCache } from '@clerk/expo';
import * as SecureStore from 'expo-secure-store';

/**
 * Clerk token cache backed by expo-secure-store (Keychain / Keystore).
 * Used by <ClerkProvider tokenCache={tokenCache}> in the root layout so the
 * auth session survives app restarts.
 */
export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, token: string) {
    try {
      await SecureStore.setItemAsync(key, token);
    } catch {
      // SecureStore may be unavailable (e.g. web preview) — fail silently.
    }
  },
};
