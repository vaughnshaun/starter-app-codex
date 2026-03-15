# Tasks: Authentication Account Scaffold

**Input**: Design documents from `/specs/001-auth-app-scaffold/`
**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/mobile-auth-profile.md](./contracts/mobile-auth-profile.md)

**Tests**: Tests are required for this feature by the constitution and plan. Each user story begins with failing unit, integration, and end-to-end coverage before implementation.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently after the foundational phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Every task includes exact file paths

## Path Conventions

- Mobile app code lives in `apps/mobile/`
- Supabase backend assets live in `supabase/`
- Feature documentation lives in `specs/001-auth-app-scaffold/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Expo 55 mobile workspace, deep-link configuration, and baseline tooling

- [ ] T001 Initialize the workspace manifests in `package.json` and `apps/mobile/package.json`
- [ ] T002 Configure Expo 55, Expo Router, TypeScript, and the app deep-link scheme in `apps/mobile/app.json`, `apps/mobile/tsconfig.json`, and `apps/mobile/babel.config.js`
- [ ] T003 [P] Configure Jest Expo and shared mobile test setup in `apps/mobile/jest.config.ts` and `apps/mobile/tests/setup.ts`
- [ ] T004 [P] Configure linting, formatting, and workspace scripts in `eslint.config.js`, `.prettierrc`, and `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared backend, auth callback, storage, and route infrastructure that all stories depend on

**⚠️ CRITICAL**: No user story work should begin until this phase is complete

- [ ] T005 Create Supabase project config with provider-level email-confirmation enforcement and the profile schema migration in `supabase/config.toml` and `supabase/migrations/202603150001_create_profiles.sql`
- [ ] T006 [P] Seed local verified and unverified accounts plus row-level-security checks in `supabase/seed.sql` and `supabase/tests/profiles_rls.sql`
- [ ] T007 [P] Implement environment loading and auth redirect configuration in `apps/mobile/src/infrastructure/config/env.ts` and `apps/mobile/src/infrastructure/config/auth-redirect.ts`
- [ ] T008 [P] Implement the shared Supabase client bootstrap and auth event wiring in `apps/mobile/src/infrastructure/supabase/client.ts` and `apps/mobile/src/infrastructure/supabase/auth-events.ts`
- [ ] T009 [P] Implement secure session and pending-auth storage adapters in `apps/mobile/src/infrastructure/storage/session-storage.ts` and `apps/mobile/src/infrastructure/storage/pending-auth-storage.ts`
- [ ] T010 [P] Define shared auth, email-action, navigation, and profile contracts in `apps/mobile/src/domain/auth/session.ts`, `apps/mobile/src/domain/auth/auth-repository.ts`, `apps/mobile/src/domain/auth/email-action.ts`, `apps/mobile/src/domain/navigation/routes.ts`, and `apps/mobile/src/domain/profile/profile.ts`
- [ ] T011 Implement the app-level auth session controller and provider shell in `apps/mobile/src/application/auth/session-controller.ts` and `apps/mobile/src/application/auth/auth-provider.tsx`
- [ ] T012 Implement the root route guard, hydration gate, and shared auth error mapping in `apps/mobile/app/_layout.tsx` and `apps/mobile/src/application/auth/auth-errors.ts`
- [ ] T013 Implement generic auth link parsing and callback coordination in `apps/mobile/src/application/auth/handle-email-action.ts` and `apps/mobile/src/infrastructure/supabase/email-action-parser.ts`

**Checkpoint**: Foundation is ready. User stories can now be implemented and tested independently.

---

## Phase 3: User Story 1 - Create And Verify An Account (Priority: P1) 🎯 MVP

**Goal**: Let a new user create an account, verify their email, and land on the home page in an authenticated state.

**Independent Test**: Sign up with a new email, confirm the verification email is sent, open the verification link, and verify the app lands on `/` with an authenticated session.

### Tests for User Story 1 ⚠️

> Write these tests first and confirm they fail before implementing the story.

- [ ] T014 [P] [US1] Write failing unit tests for signup validation and verification-pending UI in `apps/mobile/tests/unit/auth/sign-up-screen.test.tsx`
- [ ] T015 [P] [US1] Write failing integration tests for signup, duplicate-account handling, verification resend, and email verification callbacks in `apps/mobile/tests/integration/auth/sign-up-flow.test.tsx`
- [ ] T016 [P] [US1] Write the failing Maestro signup and verification journey in `apps/mobile/tests/e2e/sign-up-verification-flow.yaml`

### Implementation for User Story 1

- [ ] T017 [P] [US1] Extend the Supabase auth repository for signup and verification resend support in `apps/mobile/src/infrastructure/supabase/supabase-auth-repository.ts`
- [ ] T018 [P] [US1] Implement the signup use case and verification state model in `apps/mobile/src/application/auth/sign-up.ts` and `apps/mobile/src/application/auth/verification-state.ts`
- [ ] T019 [P] [US1] Build the signup form and verification-pending screen in `apps/mobile/src/ui/components/sign-up-form.tsx` and `apps/mobile/src/ui/screens/sign-up-screen.tsx`
- [ ] T020 [US1] Implement the auth callback route for email verification, verification-link error handling, resend-verification CTA, and home redirect in `apps/mobile/app/auth/callback.tsx`, `apps/mobile/src/application/auth/handle-email-action.ts`, and `apps/mobile/src/ui/screens/auth-link-error-screen.tsx`
- [ ] T021 [US1] Wire the public signup route and login-to-signup navigation in `apps/mobile/app/sign-up.tsx` and `apps/mobile/src/ui/screens/login-screen.tsx`
- [ ] T022 [US1] Ensure newly verified users get a basic profile record before landing home in `apps/mobile/src/application/profile/ensure-profile.ts` and `apps/mobile/src/application/auth/session-controller.ts`

**Checkpoint**: User Story 1 is independently functional and can serve as the onboarding MVP increment.

---

## Phase 4: User Story 2 - Sign In And Recover Access (Priority: P2)

**Goal**: Let verified users sign in and recover their password through an email recovery flow.

**Independent Test**: Sign in with a verified account, request a password reset, open the recovery link, set a new password, and sign in with the new password.

### Tests for User Story 2 ⚠️

- [ ] T023 [P] [US2] Write failing unit tests for login, forgot-password, and reset-password screens in `apps/mobile/tests/unit/auth/login-screen.test.tsx`, `apps/mobile/tests/unit/auth/forgot-password-screen.test.tsx`, and `apps/mobile/tests/unit/auth/reset-password-screen.test.tsx`
- [ ] T024 [P] [US2] Write failing integration tests for sign-in, backend-enforced unverified-account denial, neutral reset responses, and password recovery in `apps/mobile/tests/integration/auth/auth-service.test.tsx` and `apps/mobile/tests/integration/auth/password-reset-flow.test.tsx`
- [ ] T025 [P] [US2] Write the failing Maestro login and recovery journey in `apps/mobile/tests/e2e/login-recovery-flow.yaml`

### Implementation for User Story 2

- [ ] T026 [P] [US2] Implement sign-in, forgot-password, and complete-password-reset use cases in `apps/mobile/src/application/auth/sign-in.ts`, `apps/mobile/src/application/auth/request-password-reset.ts`, and `apps/mobile/src/application/auth/complete-password-reset.ts`
- [ ] T027 [P] [US2] Build the forgot-password and reset-password screens in `apps/mobile/src/ui/screens/forgot-password-screen.tsx` and `apps/mobile/src/ui/screens/reset-password-screen.tsx`
- [ ] T028 [P] [US2] Extend the Supabase auth repository for password recovery, new-password updates, and provider-issued unverified-account errors in `apps/mobile/src/infrastructure/supabase/supabase-auth-repository.ts`
- [ ] T029 [US2] Wire the login, forgot-password, and reset-password routes in `apps/mobile/app/login.tsx`, `apps/mobile/app/forgot-password.tsx`, and `apps/mobile/app/reset-password.tsx`
- [ ] T030 [US2] Handle recovery email callbacks, success messages, and expired-link states in `apps/mobile/app/auth/callback.tsx` and `apps/mobile/src/application/auth/auth-errors.ts`

**Checkpoint**: User Stories 1 and 2 both work independently, covering onboarding and account recovery.

---

## Phase 5: User Story 3 - Move Through The App (Priority: P3)

**Goal**: Give authenticated users a consistent navigation shell for home, profile, and sign-out.

**Independent Test**: Start from an authenticated session, navigate from home to profile and back, then sign out and confirm the app returns to the login route.

### Tests for User Story 3 ⚠️

- [ ] T031 [P] [US3] Write failing unit tests for active navigation state and sign-out actions in `apps/mobile/tests/unit/navigation/auth-nav.test.tsx`
- [ ] T032 [P] [US3] Write failing integration tests for authenticated route transitions between home and profile in `apps/mobile/tests/integration/navigation/protected-navigation.test.tsx`
- [ ] T033 [P] [US3] Write the failing Maestro navigation flow for home-profile-home and sign-out in `apps/mobile/tests/e2e/navigation-flow.yaml`

### Implementation for User Story 3

- [ ] T034 [P] [US3] Implement the sign-out use case and authenticated navigation model in `apps/mobile/src/application/auth/sign-out.ts` and `apps/mobile/src/domain/navigation/nav-item.ts`
- [ ] T035 [P] [US3] Build the authenticated navigation UI and active-link styling in `apps/mobile/src/ui/navigation/auth-nav.tsx` and `apps/mobile/src/ui/components/nav-link.tsx`
- [ ] T036 [P] [US3] Build the home screen shell and signed-in confirmation content in `apps/mobile/src/ui/screens/home-screen.tsx`
- [ ] T037 [US3] Wire the home and profile routes through the authenticated shell in `apps/mobile/app/index.tsx` and `apps/mobile/app/profile.tsx`
- [ ] T038 [US3] Connect sign-out to secure session teardown and login navigation in `apps/mobile/src/ui/navigation/auth-nav.tsx` and `apps/mobile/src/application/auth/session-controller.ts`

**Checkpoint**: The authenticated shell is navigable end to end and still independently testable.

---

## Phase 6: User Story 4 - Review Personal Details (Priority: P4)

**Goal**: Show the signed-in user's basic profile details with sensible fallbacks and retry behavior.

**Independent Test**: Sign in as a seeded or newly verified account, open the profile route, and verify the page shows the correct account details or clear fallbacks when optional fields are absent.

### Tests for User Story 4 ⚠️

- [ ] T039 [P] [US4] Write failing unit tests for profile fallback rendering and retry states in `apps/mobile/tests/unit/profile/profile-screen.test.tsx`
- [ ] T040 [P] [US4] Write failing integration tests for profile loading and partial-data handling in `apps/mobile/tests/integration/profile/profile-repository.test.tsx`
- [ ] T041 [P] [US4] Write the failing Maestro profile flow for account details and retry behavior in `apps/mobile/tests/e2e/profile-flow.yaml`

### Implementation for User Story 4

- [ ] T042 [P] [US4] Implement the Supabase profile repository and DTO mapping in `apps/mobile/src/infrastructure/supabase/supabase-profile-repository.ts` and `apps/mobile/src/infrastructure/supabase/profile-mapper.ts`
- [ ] T043 [P] [US4] Implement the profile query use case and profile state machine in `apps/mobile/src/application/profile/get-current-profile.ts` and `apps/mobile/src/application/profile/profile-state.ts`
- [ ] T044 [P] [US4] Build the profile screen component with fallback fields and retry UI in `apps/mobile/src/ui/screens/profile-screen.tsx`
- [ ] T045 [US4] Wire profile route loading and shared profile selectors in `apps/mobile/app/profile.tsx`, `apps/mobile/src/application/profile/profile-selectors.ts`, and `apps/mobile/src/ui/screens/home-screen.tsx`

**Checkpoint**: All four user stories are independently functional, including profile data loading and fallback handling.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finalize docs, automation, and cross-story verification

- [ ] T046 [P] Document setup, environment variables, deep-link configuration, and test commands in `README.md` and `apps/mobile/.env.example`
- [ ] T047 [P] Add CI automation for Expo tests and Supabase validation in `.github/workflows/mobile-auth-scaffold.yml`
- [ ] T048 Verify the quickstart flow and record final command updates in `specs/001-auth-app-scaffold/quickstart.md` and `AGENTS.md`
- [ ] T049 Validate `SC-001` and `SC-004` completion-time targets and record results in `specs/001-auth-app-scaffold/acceptance-results.md` and `specs/001-auth-app-scaffold/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** has no dependencies and can start immediately.
- **Phase 2: Foundational** depends on Phase 1 and blocks all user story work.
- **Phase 3: US1** depends on Phase 2 and delivers the onboarding MVP.
- **Phase 4: US2** depends on Phase 2 and can use seeded verified accounts independently of US1.
- **Phase 5: US3** depends on Phase 2 and benefits from US1 or US2 for demo flow, but is independently buildable against the shared auth provider.
- **Phase 6: US4** depends on Phase 2, and task `T045` also depends on `T036` because it extends the home screen's profile-derived welcome state.
- **Phase 7: Polish** depends on the user stories you want to ship.
- **Shared file coordination**: `T017` and `T028` both update `apps/mobile/src/infrastructure/supabase/supabase-auth-repository.ts`, so those two tasks must be sequenced or the adapter must be split before parallel execution.

### User Story Dependencies

- **US1**: No dependency on other user stories after the foundational phase.
- **US2**: No hard dependency on US1 because seeded verified accounts can drive testing.
- **US2 shared-file note**: `T028` should not run in parallel with `T017` unless the auth repository has first been split into smaller adapters.
- **US3**: No hard dependency on US1 or US2 beyond the foundational auth/session infrastructure.
- **US4**: No hard dependency on earlier stories beyond authenticated session support, except `T045` which extends the US3 home screen.

### Within Each User Story

- Tests must be written and failing before implementation.
- Infrastructure adapters should be completed before use cases that depend on them.
- Use cases and state models should be completed before route wiring.
- Route wiring should be completed before story-level polishing and manual verification.

### Parallel Opportunities

- `T003` and `T004` can run in parallel once `T001` starts the workspace.
- `T006`, `T007`, `T008`, `T009`, and `T010` can run in parallel after `T005`.
- Within US1, `T014`, `T015`, and `T016` can run together, then `T017`, `T018`, and `T019` can run together.
- Within US2, `T023`, `T024`, and `T025` can run together, then `T026`, `T027`, and `T028` can run together.
- Within US3, `T031`, `T032`, and `T033` can run together, then `T034`, `T035`, and `T036` can run together.
- Within US4, `T039`, `T040`, and `T041` can run together, then `T042`, `T043`, and `T044` can run together.
- `T046` and `T047` can run in parallel during polish.
- `T049` should run after the feature flows are implemented and quickstart verification steps are final.

---

## Parallel Example: User Story 1

```bash
Task: "T014 [US1] Write failing unit tests in apps/mobile/tests/unit/auth/sign-up-screen.test.tsx"
Task: "T015 [US1] Write failing integration tests in apps/mobile/tests/integration/auth/sign-up-flow.test.tsx"
Task: "T016 [US1] Write failing Maestro flow in apps/mobile/tests/e2e/sign-up-verification-flow.yaml"

Task: "T017 [US1] Extend auth repository in apps/mobile/src/infrastructure/supabase/supabase-auth-repository.ts"
Task: "T018 [US1] Implement signup use case in apps/mobile/src/application/auth/sign-up.ts and apps/mobile/src/application/auth/verification-state.ts"
Task: "T019 [US1] Build signup UI in apps/mobile/src/ui/components/sign-up-form.tsx and apps/mobile/src/ui/screens/sign-up-screen.tsx"
```

---

## Parallel Example: User Story 2

```bash
Task: "T023 [US2] Write failing unit tests in apps/mobile/tests/unit/auth/login-screen.test.tsx, apps/mobile/tests/unit/auth/forgot-password-screen.test.tsx, and apps/mobile/tests/unit/auth/reset-password-screen.test.tsx"
Task: "T024 [US2] Write failing integration tests in apps/mobile/tests/integration/auth/auth-service.test.tsx and apps/mobile/tests/integration/auth/password-reset-flow.test.tsx"
Task: "T025 [US2] Write failing Maestro flow in apps/mobile/tests/e2e/login-recovery-flow.yaml"

Task: "T026 [US2] Implement auth recovery use cases in apps/mobile/src/application/auth/sign-in.ts, apps/mobile/src/application/auth/request-password-reset.ts, and apps/mobile/src/application/auth/complete-password-reset.ts"
Task: "T027 [US2] Build recovery UI in apps/mobile/src/ui/screens/forgot-password-screen.tsx and apps/mobile/src/ui/screens/reset-password-screen.tsx"
Task: "T028 [US2] Extend auth repository in apps/mobile/src/infrastructure/supabase/supabase-auth-repository.ts"
```

---

## Parallel Example: User Story 3

```bash
Task: "T031 [US3] Write failing unit tests in apps/mobile/tests/unit/navigation/auth-nav.test.tsx"
Task: "T032 [US3] Write failing integration tests in apps/mobile/tests/integration/navigation/protected-navigation.test.tsx"
Task: "T033 [US3] Write failing Maestro flow in apps/mobile/tests/e2e/navigation-flow.yaml"

Task: "T034 [US3] Implement sign-out use case in apps/mobile/src/application/auth/sign-out.ts and apps/mobile/src/domain/navigation/nav-item.ts"
Task: "T035 [US3] Build auth navigation UI in apps/mobile/src/ui/navigation/auth-nav.tsx and apps/mobile/src/ui/components/nav-link.tsx"
Task: "T036 [US3] Build home screen shell in apps/mobile/src/ui/screens/home-screen.tsx"
```

---

## Parallel Example: User Story 4

```bash
Task: "T039 [US4] Write failing unit tests in apps/mobile/tests/unit/profile/profile-screen.test.tsx"
Task: "T040 [US4] Write failing integration tests in apps/mobile/tests/integration/profile/profile-repository.test.tsx"
Task: "T041 [US4] Write failing Maestro flow in apps/mobile/tests/e2e/profile-flow.yaml"

Task: "T042 [US4] Implement profile repository in apps/mobile/src/infrastructure/supabase/supabase-profile-repository.ts and apps/mobile/src/infrastructure/supabase/profile-mapper.ts"
Task: "T043 [US4] Implement profile query use case in apps/mobile/src/application/profile/get-current-profile.ts and apps/mobile/src/application/profile/profile-state.ts"
Task: "T044 [US4] Build profile UI in apps/mobile/src/ui/screens/profile-screen.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Validate signup, verification email handling, and redirect-to-home behavior independently.
5. Demo or ship the onboarding MVP if only new-user activation is required.

### Incremental Delivery

1. Finish Setup + Foundational to establish the reusable auth and Supabase backbone.
2. Deliver US1 and validate signup plus verification redirect behavior.
3. Deliver US2 and validate login plus password recovery.
4. Deliver US3 and validate authenticated navigation plus sign-out.
5. Deliver US4 and validate profile retrieval, fallback rendering, and retry behavior.
6. Finish Polish for docs, CI, and final verification.

### Parallel Team Strategy

1. One developer handles Supabase/backend foundation (`T005`-`T006`) while another handles mobile foundation (`T007`-`T013`) after setup.
2. After Phase 2, developers can split by story:
   - Developer A: US1 signup and verification
   - Developer B: US2 login and password recovery
   - Developer C: US3 navigation
   - Developer D: US4 profile data
3. Coordinate `T017` and `T028` explicitly because they share the auth repository implementation file.
4. Merge after each checkpoint so every story remains independently testable.

---

## Notes

- `[P]` tasks touch different files and are safe to split across contributors.
- All story phases are test-first because the constitution mandates TDD and layered coverage.
- Exact dependency exceptions are called out in the dependency section instead of being implied.
- Recommended MVP scope: Phase 1 + Phase 2 + Phase 3.
