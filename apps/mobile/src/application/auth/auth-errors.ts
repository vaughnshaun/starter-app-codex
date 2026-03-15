import { AuthFailure } from '../../domain/auth/auth-repository';

export function mapAuthErrorToMessage(error: unknown): string {
  if (error instanceof AuthFailure) {
    switch (error.code) {
      case 'duplicate_account':
        return 'That email is already registered. Try signing in instead.';
      case 'expired_link':
        return 'This link has expired. Request a fresh email and retry.';
      case 'invalid_credentials':
        return 'The email or password is incorrect.';
      case 'invalid_link':
        return 'This link is invalid or already used.';
      case 'missing_recovery_session':
        return 'Open the reset link from your email to continue.';
      case 'service_unavailable':
        return 'The auth service is unavailable right now. Please retry.';
      case 'verification_required':
        return 'Verify your email before trying to sign in.';
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

