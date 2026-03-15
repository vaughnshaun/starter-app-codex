import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { useAuth } from '../../../src/application/auth/auth-provider';
import { SignUpScreen } from '../../../src/ui/screens/sign-up-screen';

jest.mock('../../../src/application/auth/auth-provider', () => ({
  useAuth: jest.fn(),
}));

function createAuthMock(
  overrides: Partial<ReturnType<typeof useAuth>> = {},
): ReturnType<typeof useAuth> {
  return {
    completePasswordReset: jest.fn(),
    handleEmailLink: jest.fn(),
    pendingVerificationEmail: null,
    requestPasswordReset: jest.fn(),
    resendVerification: jest.fn().mockResolvedValue({ data: undefined, ok: true }),
    session: null,
    signIn: jest.fn(),
    signOut: jest.fn(),
    signUp: jest.fn().mockResolvedValue({
      fieldErrors: {
        confirmPassword: 'Passwords must match.',
      },
      message: 'Check the highlighted fields and retry.',
      ok: false,
    }),
    status: 'guest',
    ...overrides,
  };
}

describe('SignUpScreen', () => {
  const useAuthMock = useAuth as jest.MockedFunction<typeof useAuth>;

  it('renders provider validation feedback for signup errors', async () => {
    useAuthMock.mockReturnValue(createAuthMock());

    render(<SignUpScreen />);

    fireEvent.changeText(screen.getByLabelText('Email'), 'user@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'password123');
    fireEvent.changeText(screen.getByLabelText('Confirm password'), 'nope');
    fireEvent.press(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(screen.getByText('Passwords must match.')).toBeOnTheScreen();
    });
  });

  it('shows the verification pending state when an email is awaiting confirmation', () => {
    useAuthMock.mockReturnValue(
      createAuthMock({
        pendingVerificationEmail: 'user@example.com',
      }),
    );

    render(<SignUpScreen />);

    expect(screen.getByText('Check your inbox')).toBeOnTheScreen();
    expect(
      screen.getByText(/We sent a verification link to user@example.com/i),
    ).toBeOnTheScreen();
  });
});
