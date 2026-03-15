# Research: Authentication Account Scaffold

## Decision 1: Use Expo SDK 55.x for the frontend scaffold

- **Decision**: Build the client with Expo SDK 55.x and the managed Expo workflow.
- **Rationale**: Expo SDK 55 is the current Expo 55 line and aligns with the user's frontend requirement while minimizing native setup and preserving fast cross-platform delivery.
- **Alternatives considered**: Bare React Native was rejected because it increases native maintenance overhead for a simple scaffold. Expo SDK 54 was rejected because it does not meet the requested version line.

## Decision 2: Align React to the React 19 line officially supported by Expo 55

- **Decision**: Use React 19.2.x through Expo 55-compatible dependency resolution.
- **Rationale**: Expo SDK 55 officially targets React 19.2 and React Native 0.83. Staying on the Expo-supported React 19 line avoids peer dependency drift while satisfying the React 19 requirement.
- **Alternatives considered**: React 19.2.1 outside Expo's compatibility defaults was not selected as the baseline because Expo owns the dependency matrix for managed apps. React 18.x was rejected because it does not satisfy the request.

## Decision 3: Use Supabase Auth + Postgres and pin `@supabase/supabase-js` to 2.78.0

- **Decision**: Use Supabase Auth for sign-in, Supabase Postgres for profile data, and pin the JavaScript client to `@supabase/supabase-js@2.78.0`.
- **Rationale**: The user requested `2.78.1`, but the npm registry returns a 404 for that version. `2.78.0` is the nearest published 2.78 release and keeps the implementation installable while staying as close as possible to the requested version line.
- **Alternatives considered**: The latest overall Supabase JS release was rejected because it diverges from the user's requested version family. Using an unpublished `2.78.1` version was rejected because it is invalid.

## Decision 4: Use self-service signup with mandatory email verification

- **Decision**: Allow users to create their own accounts, require email verification before protected access, and route successful verification directly to the home page.
- **Rationale**: This matches the updated product scope and creates a complete onboarding loop without requiring pre-provisioned accounts or manual activation.
- **Alternatives considered**: Admin-created accounts were rejected because they no longer match the requested scope. Optional verification was rejected because the user explicitly requested verification by email link before access.

## Decision 5: Handle verification and recovery links through an in-app callback route

- **Decision**: Process verification and password recovery emails through a shared auth callback route that interprets the link intent, redirects verified users to home, and routes recovery users into the reset-password flow.
- **Rationale**: A single callback entry point keeps link handling consistent, makes deep-link validation explicit, and satisfies the redirect requirement for successful email verification.
- **Alternatives considered**: Opening email actions in a generic browser flow was rejected because it weakens the mobile experience and makes post-link routing less predictable. Separate callback routes per action were rejected because they duplicate shared link parsing logic.

## Decision 6: Protect routes with an authenticated application shell

- **Decision**: Split navigation into a public login route and protected authenticated routes for home and profile, with session hydration occurring before protected content renders.
- **Rationale**: This structure directly satisfies the spec requirement that unauthenticated access be redirected before protected content appears.
- **Alternatives considered**: Per-screen auth checks were rejected because they duplicate navigation rules and increase the chance of inconsistent access control. Leaving routes public and hiding content client-side was rejected because it fails closed-security requirements.

## Decision 7: Model profile data separately from the auth identity and ensure it exists after verification

- **Decision**: Keep identity in Supabase Auth, store user-facing profile attributes in a `profiles` table keyed one-to-one to the auth user identifier, and ensure a basic profile record exists the first time a verified session is established.
- **Rationale**: This keeps auth-managed fields separate from app-owned profile data while avoiding vendor-specific database triggers for initial profile creation.
- **Alternatives considered**: Storing all user-visible fields only in auth metadata was rejected because it makes future validation and relational queries harder. Creating the profile exclusively through a database trigger was rejected because it adds tighter backend coupling to a vendor-specific auth table.

## Decision 8: Use a three-layer test strategy from the start

- **Decision**: Use `jest-expo` for unit tests, React Native Testing Library plus a local Supabase stack for integration tests, and Maestro for mobile end-to-end flows.
- **Rationale**: This test mix satisfies the constitution's mandatory unit/integration/E2E coverage while remaining practical for an Expo-managed application.
- **Alternatives considered**: Skipping local Supabase integration tests was rejected because it would leave backend policies and adapter behavior unverified. Relying only on manual QA was rejected because it violates the constitution and weakens regression safety.
