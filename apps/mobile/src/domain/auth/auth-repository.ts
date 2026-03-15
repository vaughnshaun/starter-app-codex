import type { EmailActionResult } from './email-action';
import type { AppSession } from './session';

export type AuthFailureCode =
  | 'validation'
  | 'invalid_credentials'
  | 'verification_required'
  | 'duplicate_account'
  | 'invalid_link'
  | 'expired_link'
  | 'missing_recovery_session'
  | 'service_unavailable'
  | 'unknown';

export class AuthFailure extends Error {
  constructor(
    public readonly code: AuthFailureCode,
    message: string,
  ) {
    super(message);
    this.name = 'AuthFailure';
  }
}

export interface AuthRepository {
  signUp(email: string, password: string): Promise<void>;
  signIn(email: string, password: string): Promise<AppSession>;
  resendVerification(email: string): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
  handleEmailLink(url: string): Promise<EmailActionResult>;
  signOut(): Promise<void>;
  hydrateSession(): Promise<AppSession | null>;
}

