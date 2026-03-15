import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { useAuth } from '../../../src/application/auth/auth-provider';
import { LoginScreen } from '../../../src/ui/screens/login-screen';

jest.mock('../../../src/application/auth/auth-provider', () => ({
  useAuth: jest.fn(),
}));

describe('LoginScreen', () => {
  const useAuthMock = useAuth as jest.MockedFunction<typeof useAuth>;

  it('shows the returned auth failure message', async () => {
    useAuthMock.mockReturnValue({
      completePasswordReset: jest.fn(),
      handleEmailLink: jest.fn(),
      pendingVerificationEmail: null,
      requestPasswordReset: jest.fn(),
      resendVerification: jest.fn(),
      session: null,
      signIn: jest.fn().mockResolvedValue({
        message: 'Verify your email before trying to sign in.',
        ok: false,
      }),
      signOut: jest.fn(),
      signUp: jest.fn(),
      status: 'guest',
    });

    render(<LoginScreen />);

    fireEvent.changeText(screen.getByLabelText('Email'), 'user@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'bad-password');
    fireEvent.press(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(
        screen.getByText('Verify your email before trying to sign in.'),
      ).toBeOnTheScreen();
    });
  });
});

