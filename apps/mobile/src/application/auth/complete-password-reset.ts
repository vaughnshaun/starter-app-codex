import type { AuthRepository } from '../../domain/auth/auth-repository';
import { ValidationFailure } from './validation-error';

export interface CompletePasswordResetInput {
  confirmPassword: string;
  password: string;
}

export function validateCompletePasswordResetInput(
  input: CompletePasswordResetInput,
): void {
  const fieldErrors: Record<string, string> = {};

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

export async function completePasswordReset(
  dependencies: { authRepository: AuthRepository },
  input: CompletePasswordResetInput,
): Promise<void> {
  validateCompletePasswordResetInput(input);
  await dependencies.authRepository.updatePassword(input.password);
}

