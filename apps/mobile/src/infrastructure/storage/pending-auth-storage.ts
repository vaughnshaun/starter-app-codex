import * as SecureStore from 'expo-secure-store';

const PENDING_AUTH_KEY = 'starter-app-codex.pending-verification-email';
const SECURE_STORE_OPTIONS = {
  keychainService: 'starter-app-codex',
};

export interface PendingAuthStorage {
  clear(): Promise<void>;
  read(): Promise<string | null>;
  write(email: string): Promise<void>;
}

export const pendingAuthStorage: PendingAuthStorage = {
  async clear() {
    await SecureStore.deleteItemAsync(PENDING_AUTH_KEY, SECURE_STORE_OPTIONS);
  },
  async read() {
    return SecureStore.getItemAsync(PENDING_AUTH_KEY, SECURE_STORE_OPTIONS);
  },
  async write(email) {
    await SecureStore.setItemAsync(
      PENDING_AUTH_KEY,
      email,
      SECURE_STORE_OPTIONS,
    );
  },
};

