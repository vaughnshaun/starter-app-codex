import { signUpWithEmail } from '../../../src/application/auth/sign-up';

describe('signUpWithEmail', () => {
  it('normalizes the email and persists the pending verification record', async () => {
    const authRepository = {
      signUp: jest.fn().mockResolvedValue(undefined),
    };
    const pendingAuthStorage = {
      clear: jest.fn(),
      read: jest.fn(),
      write: jest.fn().mockResolvedValue(undefined),
    };

    const result = await signUpWithEmail(
      {
        authRepository: authRepository as never,
        pendingAuthStorage,
      },
      {
        confirmPassword: 'password123',
        email: 'USER@Example.com',
        password: 'password123',
      },
    );

    expect(authRepository.signUp).toHaveBeenCalledWith(
      'user@example.com',
      'password123',
    );
    expect(pendingAuthStorage.write).toHaveBeenCalledWith('user@example.com');
    expect(result).toEqual({
      email: 'user@example.com',
      status: 'pending',
    });
  });
});

