import type { AuthRepository } from '../../domain/auth/auth-repository';
import type { PendingAuthStorage } from '../../infrastructure/storage/pending-auth-storage';
import { ValidationFailure } from './validation-error';
import type { VerificationState } from './verification-state';

export interface SignUpInput {
  confirmPassword: string;
  email: string;
  password: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignUpInput(input: SignUpInput): void {
  const fieldErrors: Record<string, string> = {};

  if (!input.email.trim()) {
    fieldErrors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    fieldErrors.email = 'Enter a valid email address.';
  }

  if (!input.password) {
    fieldErrors.password = 'Password is required.';
  } else if (input.password.length < 8) {
    fieldErrors.password = 'Password must be at least 8 characters.';
  }

  if (input.confirmPassword !== input.password) {
    fieldErrors.confirmPassword = 'Passwords must match.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new ValidationFailure(fieldErrors);
  }
}

export async function signUpWithEmail(
  dependencies: {
    authRepository: AuthRepository;
    pendingAuthStorage: PendingAuthStorage;
  },
  input: SignUpInput,
): Promise<VerificationState> {
  validateSignUpInput(input);

  const normalizedEmail = input.email.trim().toLowerCase();
  await dependencies.authRepository.signUp(normalizedEmail, input.password);
  await dependencies.pendingAuthStorage.write(normalizedEmail);

  return {
    email: normalizedEmail,
    status: 'pending',
  };
}

