import {
  completePasswordReset,
  validateCompletePasswordResetInput,
} from '../../../src/application/auth/complete-password-reset';
import { requestPasswordResetEmail } from '../../../src/application/auth/request-password-reset';
import { ValidationFailure } from '../../../src/application/auth/validation-error';

describe('password recovery use cases', () => {
  it('normalizes the email before requesting a password reset', async () => {
    const authRepository = {
      requestPasswordReset: jest.fn().mockResolvedValue(undefined),
    };

    await requestPasswordResetEmail(
      { authRepository: authRepository as never },
      { email: 'USER@Example.com' },
    );

    expect(authRepository.requestPasswordReset).toHaveBeenCalledWith(
      'user@example.com',
    );
  });

  it('rejects mismatched reset passwords', () => {
    expect(() =>
      validateCompletePasswordResetInput({
        confirmPassword: 'password999',
        password: 'password123',
      }),
    ).toThrow(ValidationFailure);
  });

  it('updates the password through the repository when validation passes', async () => {
    const authRepository = {
      updatePassword: jest.fn().mockResolvedValue(undefined),
    };

    await completePasswordReset(
      { authRepository: authRepository as never },
      {
        confirmPassword: 'password123',
        password: 'password123',
      },
    );

    expect(authRepository.updatePassword).toHaveBeenCalledWith('password123');
  });
});

