import * as Linking from 'expo-linking';

import { getEnv } from './env';

export const authCallbackPath = '/auth/callback';

export function getAuthCallbackUrl(): string {
  return Linking.createURL(authCallbackPath, {
    scheme: getEnv().appScheme,
  });
}

