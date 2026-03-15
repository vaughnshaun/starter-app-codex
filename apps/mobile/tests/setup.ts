/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { ReactNode } from 'react';

jest.mock('expo-secure-store', () => ({
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn(() => 'startercodex://auth/callback'),
  getInitialURL: jest.fn().mockResolvedValue(null),
  useURL: jest.fn(() => null),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('expo-router', () => {
  const ReactModule =
    jest.requireActual<typeof import('react')>('react');

  const Stack = Object.assign(
    ({ children }: { children?: ReactNode }) =>
      ReactModule.createElement(ReactModule.Fragment, null, children),
    {
      Screen: () => null,
    },
  );

  return {
    Link: ({ children }: { children?: ReactNode }) =>
      ReactModule.createElement(ReactModule.Fragment, null, children),
    Redirect: ({ href }: { href: string }) =>
      ReactModule.createElement('Redirect', {
        href,
        testID: `redirect:${href}`,
      }),
    Stack,
    useLocalSearchParams: jest.fn(() => ({})),
    usePathname: jest.fn(() => '/'),
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
    })),
    useSegments: jest.fn(() => []),
  };
});
