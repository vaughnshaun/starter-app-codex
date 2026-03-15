import { AuthFailure } from '../../../src/domain/auth/auth-repository';
import { signInWithPassword } from '../../../src/application/auth/sign-in';

describe('signInWithPassword', () => {
  it('returns the session supplied by the repository', async () => {
    const session = {
      accessToken: 'access',
      email: 'user@example.com',
      expiresAt: new Date().toISOString(),
      refreshToken: 'refresh',
      state: 'authenticated' as const,
      userId: 'user-1',
    };
    const authRepository = {
      signIn: jest.fn().mockResolvedValue(session),
    };

    await expect(
      signInWithPassword(
        { authRepository: authRepository as never },
        { email: 'user@example.com', password: 'password123' },
      ),
    ).resolves.toEqual(session);
  });

  it('surfaces verification-required failures from the repository', async () => {
    const authRepository = {
      signIn: jest
        .fn()
        .mockRejectedValue(
          new AuthFailure('verification_required', 'Verify your email first.'),
        ),
    };

    await expect(
      signInWithPassword(
        { authRepository: authRepository as never },
        { email: 'user@example.com', password: 'password123' },
      ),
    ).rejects.toMatchObject({
      code: 'verification_required',
    });
  });
});

