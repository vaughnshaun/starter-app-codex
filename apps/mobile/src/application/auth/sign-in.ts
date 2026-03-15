import type { AuthRepository } from '../../domain/auth/auth-repository';
import type { AppSession } from '../../domain/auth/session';
import { ValidationFailure } from './validation-error';

export interface SignInInput {
  email: string;
  password: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignInInput(input: SignInInput): void {
  const fieldErrors: Record<string, string> = {};

  if (!input.email.trim()) {
    fieldErrors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    fieldErrors.email = 'Enter a valid email address.';
  }

  if (!input.password) {
    fieldErrors.password = 'Password is required.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new ValidationFailure(fieldErrors);
  }
}

export async function signInWithPassword(
  dependencies: { authRepository: AuthRepository },
  input: SignInInput,
): Promise<AppSession> {
  validateSignInInput(input);

  return dependencies.authRepository.signIn(
    input.email.trim().toLowerCase(),
    input.password,
  );
}

