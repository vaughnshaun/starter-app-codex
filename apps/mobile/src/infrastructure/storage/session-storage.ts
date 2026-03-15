import * as SecureStore from 'expo-secure-store';

import type { AppSession } from '../../domain/auth/session';

const APP_SESSION_KEY = 'starter-app-codex.app-session';
const SECURE_STORE_OPTIONS = {
  keychainService: 'starter-app-codex',
};

function parseSession(value: string | null): AppSession | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AppSession;
  } catch {
    return null;
  }
}

export const appSessionStorage = {
  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(APP_SESSION_KEY, SECURE_STORE_OPTIONS);
  },
  async read(): Promise<AppSession | null> {
    const value = await SecureStore.getItemAsync(
      APP_SESSION_KEY,
      SECURE_STORE_OPTIONS,
    );
    return parseSession(value);
  },
  async write(session: AppSession): Promise<void> {
    await SecureStore.setItemAsync(
      APP_SESSION_KEY,
      JSON.stringify(session),
      SECURE_STORE_OPTIONS,
    );
  },
};

export function createSupabaseSecureStorageAdapter() {
  return {
    getItem(key: string) {
      return SecureStore.getItemAsync(key, SECURE_STORE_OPTIONS);
    },
    removeItem(key: string) {
      return SecureStore.deleteItemAsync(key, SECURE_STORE_OPTIONS);
    },
    setItem(key: string, value: string) {
      return SecureStore.setItemAsync(key, value, SECURE_STORE_OPTIONS);
    },
  };
}

