import { render, screen } from '@testing-library/react-native';

import { useAuth } from '../../../src/application/auth/auth-provider';
import { ResetPasswordScreen } from '../../../src/ui/screens/reset-password-screen';

jest.mock('../../../src/application/auth/auth-provider', () => ({
  useAuth: jest.fn(),
}));

describe('ResetPasswordScreen', () => {
  const useAuthMock = useAuth as jest.MockedFunction<typeof useAuth>;

  it('shows a recovery-state error when no recovery session exists', () => {
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

    render(<ResetPasswordScreen />);

    expect(
      screen.getByText('Open the reset link from your email.'),
    ).toBeOnTheScreen();
  });
});

