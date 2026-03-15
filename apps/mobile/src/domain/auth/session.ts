export type SessionState =
  | 'pending'
  | 'authenticated'
  | 'recovery'
  | 'expired'
  | 'signed_out';

export interface AppSession {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  state: SessionState;
}

export function isAuthenticatedSession(
  session: AppSession | null,
): session is AppSession {
  return session?.state === 'authenticated';
}

export function isRecoverySession(session: AppSession | null): boolean {
  return session?.state === 'recovery';
}

