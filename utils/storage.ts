import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * A unified robust storage utility handling both generic and secure storage.
 * - Use `getItem`/`setItem` for basic user preferences, caching, etc.
 * - Use `getSecureItem`/`setSecureItem` for JWTs, API keys, passwords, etc.
 */
export const StorageHelpers = {
  // --- Standard Storage (AsyncStorage) ---
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error saving standard item [${key}]:`, error);
    }
  },
  
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading standard item [${key}]:`, error);
      return null;
    }
  },
  
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing standard item [${key}]:`, error);
    }
  },

  // --- Secure Storage (Expo SecureStore) ---
  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error saving secure item [${key}]:`, error);
    }
  },
  
  async getSecureItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error reading secure item [${key}]:`, error);
      return null;
    }
  },
  
  async removeSecureItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing secure item [${key}]:`, error);
    }
  }
};
