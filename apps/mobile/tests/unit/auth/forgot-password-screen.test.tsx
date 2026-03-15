import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { useAuth } from '../../../src/application/auth/auth-provider';
import { ForgotPasswordScreen } from '../../../src/ui/screens/forgot-password-screen';

jest.mock('../../../src/application/auth/auth-provider', () => ({
  useAuth: jest.fn(),
}));

describe('ForgotPasswordScreen', () => {
  const useAuthMock = useAuth as jest.MockedFunction<typeof useAuth>;

  it('shows the neutral reset confirmation on success', async () => {
    useAuthMock.mockReturnValue({
      completePasswordReset: jest.fn(),
      handleEmailLink: jest.fn(),
      pendingVerificationEmail: null,
      requestPasswordReset: jest.fn().mockResolvedValue({
        data: undefined,
        ok: true,
      }),
      resendVerification: jest.fn(),
      session: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
      status: 'guest',
    });

    render(<ForgotPasswordScreen />);

    fireEvent.changeText(screen.getByLabelText('Email'), 'user@example.com');
    fireEvent.press(screen.getByText('Send reset email'));

    await waitFor(() => {
      expect(
        screen.getByText(
          'If that account exists, password reset instructions are on the way.',
        ),
      ).toBeOnTheScreen();
    });
  });
});

