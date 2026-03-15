# Quickstart: Authentication Navigation Scaffold

## Prerequisites

- Node.js 20.19+ or 22.12+ for Expo SDK 55 tooling
- npm 11+
- An iOS simulator, Android emulator, or physical device for Expo testing
- A Supabase project or local Supabase stack
- Environment variables for `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Bootstrap Order

1. Scaffold `apps/mobile` with the Expo SDK 55 template and Expo Router enabled.
2. Install Expo-compatible React 19 dependencies and pin `@supabase/supabase-js` to `2.78.0`.
3. Create the `supabase/` workspace, add SQL migrations for the `profiles` table and row-level security policies, and seed a test user/profile.
4. Add application, domain, and infrastructure layers before building the route screens.
5. Configure secure session persistence so protected routes can hydrate auth state before rendering.

## TDD Execution Order

1. Write failing unit tests for auth session guards, login error mapping, and profile view-model behavior.
2. Write failing integration tests for the Supabase auth adapter, secure session storage adapter, and profile repository.
3. Write a failing Maestro scenario for login -> home -> profile -> sign out.
4. Implement the minimum code needed to satisfy the tests.
5. Refactor only after all tests pass.

## Manual Verification Flow

1. Start the Supabase environment and apply migrations.
2. Launch the Expo app.
3. Sign in with the seeded test account.
4. Confirm the home screen appears after login.
5. Navigate to profile and verify the correct account details display.
6. Sign out and confirm the app returns to login.
7. Attempt to reopen `/` or `/profile` without a valid session and confirm the app redirects to login.

## Done Criteria

- Unit, integration, and end-to-end tests all pass.
- Protected routes never render for an unauthenticated or expired session.
- No service-role or secret backend credentials are bundled into the mobile app.
- Documentation stays aligned with the final implementation and test commands.
