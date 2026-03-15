import { render, screen, waitFor } from '@testing-library/react-native';

import { useAuth } from '../../../src/application/auth/auth-provider';
import { getCurrentProfile } from '../../../src/application/profile/get-current-profile';
import { ProfileScreen } from '../../../src/ui/screens/profile-screen';

jest.mock('../../../src/application/auth/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../src/application/profile/get-current-profile', () => ({
  getCurrentProfile: jest.fn(),
}));

describe('ProfileScreen', () => {
  const getCurrentProfileMock =
    getCurrentProfile as jest.MockedFunction<typeof getCurrentProfile>;
  const useAuthMock = useAuth as jest.MockedFunction<typeof useAuth>;

  it('renders placeholder values when optional profile fields are absent', async () => {
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
        state: 'authenticated',
        userId: 'user-1',
      },
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
      status: 'authenticated',
    });

    getCurrentProfileMock.mockResolvedValue({
      email: 'user@example.com',
      userId: 'user-1',
    });

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByText('Not set yet')).toBeOnTheScreen();
      expect(screen.getByText('No avatar configured')).toBeOnTheScreen();
    });
  });
});

