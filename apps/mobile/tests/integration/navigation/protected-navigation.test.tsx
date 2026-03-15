import { render, screen } from '@testing-library/react-native';
import { useSegments } from 'expo-router';

import { useAuth } from '../../../src/application/auth/auth-provider';
import { AppShell } from '../../../app/_layout';

jest.mock('../../../src/application/auth/auth-provider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: jest.fn(),
}));

describe('AppShell', () => {
  const useAuthMock = useAuth as jest.MockedFunction<typeof useAuth>;
  const useSegmentsMock = useSegments as jest.MockedFunction<typeof useSegments>;

  it('redirects unauthenticated visitors away from protected routes', () => {
    useAuthMock.mockReturnValue({
      completePasswordReset: jest.fn(),
      handleEmailLink: jest.fn(),
      pendingVerificationEmail: null,
      requestPasswordReset: jest.fn(),
      resendVerification: jest.fn(),
      session: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
      status: 'guest',
    });
    useSegmentsMock.mockReturnValue([] as unknown as ReturnType<typeof useSegments>);

    render(<AppShell />);

    expect(screen.getByTestId('redirect:/login')).toBeOnTheScreen();
  });

  it('locks recovery sessions onto the reset-password route', () => {
    useAuthMock.mockReturnValue({
      completePasswordReset: jest.fn(),
      handleEmailLink: jest.fn(),
      pendingVerificationEmail: null,
      requestPasswordReset: jest.fn(),
      resendVerification: jest.fn(),
      session: {
        accessToken: 'token',
        email: 'user@example.com',
        expiresAt: new Date().toISOString(),
        refreshToken: 'refresh',
        state: 'recovery',
        userId: 'user-1',
      },
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
      status: 'recovery',
    });
    useSegmentsMock.mockReturnValue(['profile']);

    render(<AppShell />);

    expect(screen.getByTestId('redirect:/reset-password')).toBeOnTheScreen();
  });
});
