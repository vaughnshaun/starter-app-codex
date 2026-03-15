export const appRoutes = {
  authCallback: '/auth/callback',
  forgotPassword: '/forgot-password',
  home: '/',
  login: '/login',
  profile: '/profile',
  resetPassword: '/reset-password',
  signUp: '/sign-up',
} as const;

export const publicRouteSegments = new Set([
  'auth',
  'forgot-password',
  'login',
  'reset-password',
  'sign-up',
]);

