import { fireEvent, render, screen } from '@testing-library/react-native';

import { AuthNav } from '../../../src/ui/navigation/auth-nav';

describe('AuthNav', () => {
  it('calls sign out when the sign out button is pressed', () => {
    const onSignOut = jest.fn().mockResolvedValue(undefined);

    render(<AuthNav onSignOut={onSignOut} />);

    fireEvent.press(screen.getByText('Sign out'));

    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});

