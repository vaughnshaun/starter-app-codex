import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';

import { mapAuthErrorToMessage } from './auth-errors';
import {
  completePasswordReset,
  type CompletePasswordResetInput,
} from './complete-password-reset';
import { handleEmailAction } from './handle-email-action';
import { requestPasswordResetEmail } from './request-password-reset';
import type { RequestPasswordResetInput } from './request-password-reset';
import { SessionController } from './session-controller';
import { signInWithPassword, type SignInInput } from './sign-in';
import { signOutCurrentUser } from './sign-out';
import { signUpWithEmail, type SignUpInput } from './sign-up';
import type { ValidationErrors } from './validation-error';
import { ValidationFailure } from './validation-error';
import type { VerificationState } from './verification-state';
import type { EmailActionResult } from '../../domain/auth/email-action';
import type { AppSession } from '../../domain/auth/session';
import { pendingAuthStorage } from '../../infrastructure/storage/pending-auth-storage';
import { subscribeToAuthEvents } from '../../infrastructure/supabase/auth-events';
import { getSupabaseAuthRepository } from '../../infrastructure/supabase/supabase-auth-repository';
import { ensureProfile } from '../profile/ensure-profile';

type AuthStatus = 'authenticated' | 'guest' | 'loading' | 'recovery';

export interface SubmissionFailure {
  fieldErrors?: ValidationErrors;
  message: string;
  ok: false;
}

export interface SubmissionSuccess<TData = undefined> {
  data: TData;
  ok: true;
}

export type SubmissionResult<TData = undefined> =
  | SubmissionFailure
  | SubmissionSuccess<TData>;

interface AuthContextValue {
  completePasswordReset(
    input: CompletePasswordResetInput,
  ): Promise<SubmissionResult>;
  handleEmailLink(url: string): Promise<SubmissionResult<EmailActionResult>>;
  pendingVerificationEmail: string | null;
  requestPasswordReset(
    input: RequestPasswordResetInput,
  ): Promise<SubmissionResult>;
  resendVerification(email?: string): Promise<SubmissionResult>;
  session: AppSession | null;
  signIn(input: SignInInput): Promise<SubmissionResult>;
  signOut(): Promise<SubmissionResult>;
  signUp(
    input: SignUpInput,
  ): Promise<SubmissionResult<VerificationState>>;
  status: AuthStatus;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toFailure(error: unknown): SubmissionFailure {
  if (error instanceof ValidationFailure) {
    return {
      fieldErrors: error.fieldErrors,
      message: 'Check the highlighted fields and retry.',
      ok: false,
    };
  }

  return {
    message: mapAuthErrorToMessage(error),
    ok: false,
  };
}

function getStatusFromSession(session: AppSession | null): AuthStatus {
  if (!session) {
    return 'guest';
  }

  return session.state === 'recovery' ? 'recovery' : 'authenticated';
}

export function AuthProvider({ children }: PropsWithChildren) {
  const controllerRef = useRef<SessionController | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<
    string | null
  >(null);
  const [session, setSession] = useState<AppSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  if (!controllerRef.current) {
    controllerRef.current = new SessionController({
      authRepository: getSupabaseAuthRepository(),
      ensureProfile,
    });
  }

  const applySession = useEffectEvent((nextSession: AppSession | null) => {
    startTransition(() => {
      setSession(nextSession);
      setStatus(getStatusFromSession(nextSession));
    });
  });

  useEffect(() => {
    let isMounted = true;

    void pendingAuthStorage.read().then((email) => {
      if (isMounted) {
        setPendingVerificationEmail(email);
      }
    });

    void controllerRef.current
      ?.hydrate()
      .then((nextSession) => {
        if (isMounted) {
          applySession(nextSession ?? null);
        }
      })
      .catch(() => {
        if (isMounted) {
          applySession(null);
        }
      });

    const unsubscribe = subscribeToAuthEvents(async (nextSession) => {
      if (!controllerRef.current) {
        return;
      }

      const syncedSession = await controllerRef.current.syncSession(nextSession);
      if (isMounted) {
        applySession(syncedSession);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [applySession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      async completePasswordReset(
        input: CompletePasswordResetInput,
      ): Promise<SubmissionResult> {
        try {
          await completePasswordReset(
            { authRepository: getSupabaseAuthRepository() },
            input,
          );
          if (controllerRef.current) {
            await signOutCurrentUser(controllerRef.current);
          }
          applySession(null);
          return { data: undefined, ok: true };
        } catch (error) {
          return toFailure(error);
        }
      },
      async handleEmailLink(
        url: string,
      ): Promise<SubmissionResult<EmailActionResult>> {
        try {
          if (!controllerRef.current) {
            throw new Error('Auth controller is unavailable.');
          }

          const result = await handleEmailAction(controllerRef.current, url);
          await pendingAuthStorage.clear();
          setPendingVerificationEmail(null);
          applySession(result.session);
          return {
            data: result,
            ok: true,
          };
        } catch (error) {
          return toFailure(error);
        }
      },
      pendingVerificationEmail,
      async requestPasswordReset(
        input: RequestPasswordResetInput,
      ): Promise<SubmissionResult> {
        try {
          await requestPasswordResetEmail(
            { authRepository: getSupabaseAuthRepository() },
            input,
          );
          return { data: undefined, ok: true };
        } catch (error) {
          return toFailure(error);
        }
      },
      async resendVerification(email?: string): Promise<SubmissionResult> {
        const targetEmail = email ?? pendingVerificationEmail;

        if (!targetEmail) {
          return {
            message: 'No pending verification email was found.',
            ok: false,
          };
        }

        try {
          await getSupabaseAuthRepository().resendVerification(targetEmail);
          return { data: undefined, ok: true };
        } catch (error) {
          return toFailure(error);
        }
      },
      session,
      async signIn(input: SignInInput): Promise<SubmissionResult> {
        try {
          if (!controllerRef.current) {
            throw new Error('Auth controller is unavailable.');
          }

          const nextSession = await signInWithPassword(
            { authRepository: getSupabaseAuthRepository() },
            input,
          );
          const syncedSession =
            await controllerRef.current.syncSession(nextSession);
          applySession(syncedSession);
          return { data: undefined, ok: true };
        } catch (error) {
          return toFailure(error);
        }
      },
      async signOut(): Promise<SubmissionResult> {
        try {
          if (!controllerRef.current) {
            throw new Error('Auth controller is unavailable.');
          }

          await signOutCurrentUser(controllerRef.current);
          applySession(null);
          return { data: undefined, ok: true };
        } catch (error) {
          return toFailure(error);
        }
      },
      async signUp(
        input: SignUpInput,
      ): Promise<SubmissionResult<VerificationState>> {
        try {
          const verificationState = await signUpWithEmail(
            {
              authRepository: getSupabaseAuthRepository(),
              pendingAuthStorage,
            },
            input,
          );
          setPendingVerificationEmail(verificationState.email);
          return {
            data: verificationState,
            ok: true,
          };
        } catch (error) {
          return toFailure(error);
        }
      },
      status,
    }),
    [applySession, pendingVerificationEmail, session, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
