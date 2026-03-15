import type { AuthError, Session } from '@supabase/supabase-js';

import type { AuthRepository } from '../../domain/auth/auth-repository';
import { AuthFailure } from '../../domain/auth/auth-repository';
import type { EmailActionResult } from '../../domain/auth/email-action';
import type { AppSession } from '../../domain/auth/session';
import { getAuthCallbackUrl } from '../config/auth-redirect';
import { getSupabaseClient } from './client';
import { parseEmailAction } from './email-action-parser';

function mapSupabaseError(error: AuthError): AuthFailure {
  const message = error.message.toLowerCase();

  if (message.includes('email rate limit')) {
    return new AuthFailure(
      'service_unavailable',
      'Too many email requests. Please retry shortly.',
    );
  }

  if (message.includes('email not confirmed')) {
    return new AuthFailure(
      'verification_required',
      'Verify your email before signing in.',
    );
  }

  if (message.includes('invalid login credentials')) {
    return new AuthFailure(
      'invalid_credentials',
      'The email or password is incorrect.',
    );
  }

  if (
    message.includes('already registered') ||
    message.includes('user already registered')
  ) {
    return new AuthFailure(
      'duplicate_account',
      'An account already exists for this email address.',
    );
  }

  if (
    message.includes('otp expired') ||
    message.includes('expired') ||
    message.includes('token has expired')
  ) {
    return new AuthFailure('expired_link', error.message);
  }

  if (
    message.includes('otp') ||
    message.includes('token') ||
    message.includes('invalid')
  ) {
    return new AuthFailure('invalid_link', error.message);
  }

  return new AuthFailure('service_unavailable', error.message);
}

export function mapSupabaseSession(
  session: Session | null,
  state: AppSession['state'] = 'authenticated',
): AppSession | null {
  if (!session?.user?.id || !session.user.email) {
    return null;
  }

  return {
    accessToken: session.access_token,
    email: session.user.email,
    expiresAt: new Date((session.expires_at ?? 0) * 1000).toISOString(),
    refreshToken: session.refresh_token ?? '',
    state,
    userId: session.user.id,
  };
}

class SupabaseAuthRepository implements AuthRepository {
  async handleEmailLink(url: string): Promise<EmailActionResult> {
    const parsed = parseEmailAction(url);
    const client = getSupabaseClient();

    if (parsed.errorCode || parsed.errorDescription) {
      throw new AuthFailure(
        parsed.errorCode === 'otp_expired' ? 'expired_link' : 'invalid_link',
        parsed.errorDescription ?? 'The email action could not be completed.',
      );
    }

    let session: Session | null = null;

    if (parsed.accessToken && parsed.refreshToken) {
      const { data, error } = await client.auth.setSession({
        access_token: parsed.accessToken,
        refresh_token: parsed.refreshToken,
      });

      if (error) {
        throw mapSupabaseError(error);
      }

      session = data.session;
    } else if (parsed.tokenHash) {
      const { data, error } = await client.auth.verifyOtp({
        token_hash: parsed.tokenHash,
        type: parsed.type === 'recovery' ? 'recovery' : 'signup',
      });

      if (error) {
        throw mapSupabaseError(error);
      }

      session = data.session;
    } else {
      throw new AuthFailure(
        'invalid_link',
        'This auth link is missing the required session data.',
      );
    }

    const appSession = mapSupabaseSession(
      session,
      parsed.type === 'recovery' ? 'recovery' : 'authenticated',
    );

    if (!appSession) {
      throw new AuthFailure(
        'invalid_link',
        'The email action did not return a usable session.',
      );
    }

    return {
      action: parsed.type,
      session: appSession,
    };
  }

  async hydrateSession(): Promise<AppSession | null> {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.getSession();

    if (error) {
      throw mapSupabaseError(error);
    }

    return mapSupabaseSession(data.session);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthCallbackUrl(),
    });

    if (error) {
      throw mapSupabaseError(error);
    }
  }

  async resendVerification(email: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client.auth.resend({
      email,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
      },
      type: 'signup',
    });

    if (error) {
      throw mapSupabaseError(error);
    }
  }

  async signIn(email: string, password: string): Promise<AppSession> {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw mapSupabaseError(error);
    }

    if (!data.user?.email_confirmed_at) {
      await client.auth.signOut();
      throw new AuthFailure(
        'verification_required',
        'Verify your email before signing in.',
      );
    }

    const session = mapSupabaseSession(data.session);

    if (!session) {
      throw new AuthFailure(
        'unknown',
        'A session was not returned for this account.',
      );
    }

    return session;
  }

  async signOut(): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();

    if (error) {
      throw mapSupabaseError(error);
    }
  }

  async signUp(email: string, password: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client.auth.signUp({
      email,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
      },
      password,
    });

    if (error) {
      throw mapSupabaseError(error);
    }
  }

  async updatePassword(password: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client.auth.updateUser({
      password,
    });

    if (error) {
      throw mapSupabaseError(error);
    }
  }
}

let repository: AuthRepository | null = null;

export function getSupabaseAuthRepository(): AuthRepository {
  if (!repository) {
    repository = new SupabaseAuthRepository();
  }

  return repository;
}

