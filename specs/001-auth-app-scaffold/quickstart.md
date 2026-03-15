# Quickstart: Authentication Account Scaffold

## Prerequisites

- Node.js 20.19+ or 22.12+ for Expo SDK 55 tooling
- npm 11+
- An iOS simulator, Android emulator, or physical device for Expo testing
- A Supabase project or local Supabase stack
- Environment variables for `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Auth redirect configuration that deep-links verification and recovery emails into the Expo application

## Bootstrap Order

1. Scaffold `apps/mobile` with the Expo SDK 55 template, Expo Router, and a custom deep-link scheme.
2. Install Expo-compatible React 19 dependencies and pin `@supabase/supabase-js` to `2.78.0`.
3. Create the `supabase/` workspace, add SQL migrations for the `profiles` table and row-level security policies, and seed verified and unverified test accounts.
4. Configure Supabase email verification and password recovery redirect URLs to point at the Expo auth callback route.
5. Add application, domain, and infrastructure layers before building the route screens.
6. Configure secure session persistence so protected routes can hydrate auth state before rendering.

## TDD Execution Order

1. Write failing unit tests for signup, login, forgot-password, reset-password, auth guards, and profile view-model behavior.
2. Write failing integration tests for the Supabase auth adapter, email callback handling, secure session storage adapter, and profile repository.
3. Write failing Maestro scenarios for signup -> verify -> home, login -> forgot password -> reset, and home -> profile -> sign out.
4. Implement the minimum code needed to satisfy the tests.
5. Refactor only after all tests pass.

## Manual Verification Flow

1. Start the Supabase environment and apply migrations.
2. Launch the Expo app.
3. Create a new account and confirm the verification email is sent.
4. Open the verification link and confirm the app redirects to home in an authenticated state.
5. Sign out, then sign in with the same verified account and confirm the home screen appears.
6. Request a password reset, open the recovery link, set a new password, and confirm the app returns to login successfully.
7. Navigate to profile and verify the correct account details display.
8. Attempt to reopen `/` or `/profile` without a valid session and confirm the app redirects to login.

## Timed Acceptance Validation

- Measure signup -> verification link -> home completion time against `SC-001` and record the result in `specs/001-auth-app-scaffold/acceptance-results.md`.
- Measure forgot-password request -> recovery link -> password reset completion time against `SC-004` and record the result in `specs/001-auth-app-scaffold/acceptance-results.md`.
- Record any retry attempts or failure reasons alongside the timing results so acceptance data is auditable.

## Done Criteria

- Unit, integration, and end-to-end tests all pass.
- Protected routes never render for an unauthenticated, unverified, or expired session.
- Verification links redirect verified users to home and recovery links open the password-reset flow.
- No service-role or secret backend credentials are bundled into the mobile app.
- Documentation stays aligned with the final implementation and test commands.
