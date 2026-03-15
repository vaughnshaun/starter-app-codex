import type { AuthRepository } from '../../domain/auth/auth-repository';
import { ValidationFailure } from './validation-error';

export interface RequestPasswordResetInput {
  email: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRequestPasswordResetInput(
  input: RequestPasswordResetInput,
): void {
  const fieldErrors: Record<string, string> = {};

  if (!input.email.trim()) {
    fieldErrors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    fieldErrors.email = 'Enter a valid email address.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new ValidationFailure(fieldErrors);
  }
}

export async function requestPasswordResetEmail(
  dependencies: { authRepository: AuthRepository },
  input: RequestPasswordResetInput,
): Promise<void> {
  validateRequestPasswordResetInput(input);
  await dependencies.authRepository.requestPasswordReset(
    input.email.trim().toLowerCase(),
  );
}

