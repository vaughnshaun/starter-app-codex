# Tasks: Authentication Navigation Scaffold

**Input**: Design documents from `/specs/001-auth-app-scaffold/`
**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/mobile-auth-profile.md](./contracts/mobile-auth-profile.md)

**Tests**: Tests are required for this feature by the constitution and plan. Each user story begins with failing unit, integration, and end-to-end coverage before implementation.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently after the foundational phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Every task includes exact file paths

## Path Conventions

- Mobile app code lives in `apps/mobile/`
- Supabase backend assets live in `supabase/`
- Feature documentation lives in `specs/001-auth-app-scaffold/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Expo 55 mobile workspace and baseline tooling

- [ ] T001 Initialize the workspace manifests in `package.json` and `apps/mobile/package.json`
- [ ] T002 Configure Expo 55, Expo Router, and TypeScript app settings in `apps/mobile/app.json`, `apps/mobile/tsconfig.json`, and `apps/mobile/babel.config.js`
- [ ] T003 [P] Configure Jest Expo and shared mobile test setup in `apps/mobile/jest.config.ts` and `apps/mobile/tests/setup.ts`
- [ ] T004 [P] Configure linting, formatting, and workspace scripts in `eslint.config.js`, `.prettierrc`, and `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared backend, auth, storage, and route infrastructure that all stories depend on

**⚠️ CRITICAL**: No user story work should begin until this phase is complete

- [ ] T005 Create Supabase project config and the profile schema migration in `supabase/config.toml` and `supabase/migrations/202603150001_create_profiles.sql`
- [ ] T006 [P] Seed local auth/profile fixtures and row-level-security checks in `supabase/seed.sql` and `supabase/tests/profiles_rls.sql`
- [ ] T007 [P] Implement environment loading and shared Supabase client bootstrap in `apps/mobile/src/infrastructure/config/env.ts` and `apps/mobile/src/infrastructure/supabase/client.ts`
- [ ] T008 [P] Implement secure session storage and token persistence adapters in `apps/mobile/src/infrastructure/storage/session-storage.ts` and `apps/mobile/src/infrastructure/storage/token-cache.ts`
- [ ] T009 [P] Define shared auth, navigation, and profile contracts in `apps/mobile/src/domain/auth/session.ts`, `apps/mobile/src/domain/auth/auth-repository.ts`, `apps/mobile/src/domain/navigation/routes.ts`, and `apps/mobile/src/domain/profile/profile.ts`
- [ ] T010 Implement the app-level auth session controller and provider shell in `apps/mobile/src/application/auth/session-controller.ts` and `apps/mobile/src/application/auth/auth-provider.tsx`
- [ ] T011 Implement the root route guard, hydration gate, and shared auth error mapping in `apps/mobile/app/_layout.tsx` and `apps/mobile/src/application/auth/auth-errors.ts`

**Checkpoint**: Foundation is ready. User stories can now be implemented and tested independently.

---

## Phase 3: User Story 1 - Secure Sign-In (Priority: P1) 🎯 MVP

**Goal**: Let a returning user sign in from a dedicated login page and block unauthenticated access to protected content.

**Independent Test**: Submit valid and invalid credentials from the login page and verify that only a valid user reaches the home screen while unauthenticated access to `/` redirects to `/login`.

### Tests for User Story 1 ⚠️

> Write these tests first and confirm they fail before implementing the story.

- [ ] T012 [P] [US1] Write failing unit tests for login form validation and guard redirects in `apps/mobile/tests/unit/auth/login-screen.test.tsx`
- [ ] T013 [P] [US1] Write failing integration tests for sign-in, invalid credentials, and redirect behavior in `apps/mobile/tests/integration/auth/auth-service.test.tsx`
- [ ] T014 [P] [US1] Write the failing Maestro login journey in `apps/mobile/tests/e2e/login-home-flow.yaml`

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement the Supabase auth repository adapter for sign-in and session hydration in `apps/mobile/src/infrastructure/supabase/supabase-auth-repository.ts`
- [ ] T016 [P] [US1] Implement the sign-in use case and login form state reducer in `apps/mobile/src/application/auth/sign-in.ts` and `apps/mobile/src/application/auth/login-form-state.ts`
- [ ] T017 [P] [US1] Build the login form component and login screen presenter in `apps/mobile/src/ui/components/login-form.tsx` and `apps/mobile/src/ui/screens/login-screen.tsx`
- [ ] T018 [US1] Wire the public login route and authenticated home entry in `apps/mobile/app/login.tsx` and `apps/mobile/app/index.tsx`
- [ ] T019 [US1] Add invalid-credentials, service-error, and session-expired states in `apps/mobile/src/ui/screens/login-screen.tsx` and `apps/mobile/src/application/auth/session-controller.ts`

**Checkpoint**: User Story 1 is independently functional and can serve as the MVP increment.

---

## Phase 4: User Story 2 - Move Through The App (Priority: P2)

**Goal**: Give authenticated users a consistent navigation shell for home, profile, and sign-out.

**Independent Test**: Start from an authenticated session, navigate from home to profile and back, then sign out and confirm the app returns to the login route.

### Tests for User Story 2 ⚠️

- [ ] T020 [P] [US2] Write failing unit tests for active navigation state and sign-out actions in `apps/mobile/tests/unit/navigation/auth-nav.test.tsx`
- [ ] T021 [P] [US2] Write failing integration tests for authenticated route transitions between home and profile in `apps/mobile/tests/integration/navigation/protected-navigation.test.tsx`
- [ ] T022 [P] [US2] Write the failing Maestro navigation flow for home-profile-home and sign-out in `apps/mobile/tests/e2e/navigation-flow.yaml`

### Implementation for User Story 2

- [ ] T023 [P] [US2] Implement the sign-out use case and authenticated navigation model in `apps/mobile/src/application/auth/sign-out.ts` and `apps/mobile/src/domain/navigation/nav-item.ts`
- [ ] T024 [P] [US2] Build the authenticated navigation UI and active-link styling in `apps/mobile/src/ui/navigation/auth-nav.tsx` and `apps/mobile/src/ui/components/nav-link.tsx`
- [ ] T025 [P] [US2] Build the home screen shell and signed-in confirmation content in `apps/mobile/src/ui/screens/home-screen.tsx`
- [ ] T026 [US2] Wire the home and profile routes through the authenticated shell in `apps/mobile/app/index.tsx` and `apps/mobile/app/profile.tsx`
- [ ] T027 [US2] Connect sign-out to secure session teardown and login navigation in `apps/mobile/src/ui/navigation/auth-nav.tsx` and `apps/mobile/src/application/auth/session-controller.ts`

**Checkpoint**: User Stories 1 and 2 both work independently, and the authenticated shell is navigable end to end.

---

## Phase 5: User Story 3 - Review Personal Details (Priority: P3)

**Goal**: Show the signed-in user's basic profile details with sensible fallbacks and retry behavior.

**Independent Test**: Sign in as a seeded account, open the profile route, and verify the page shows the correct account details or clear fallbacks when optional fields are absent.

### Tests for User Story 3 ⚠️

- [ ] T028 [P] [US3] Write failing unit tests for profile fallback rendering and retry states in `apps/mobile/tests/unit/profile/profile-screen.test.tsx`
- [ ] T029 [P] [US3] Write failing integration tests for profile loading and partial-data handling in `apps/mobile/tests/integration/profile/profile-repository.test.tsx`
- [ ] T030 [P] [US3] Write the failing Maestro profile flow for account details and retry behavior in `apps/mobile/tests/e2e/profile-flow.yaml`

### Implementation for User Story 3

- [ ] T031 [P] [US3] Implement the Supabase profile repository and DTO mapping in `apps/mobile/src/infrastructure/supabase/supabase-profile-repository.ts` and `apps/mobile/src/infrastructure/supabase/profile-mapper.ts`
- [ ] T032 [P] [US3] Implement the profile query use case and profile state machine in `apps/mobile/src/application/profile/get-current-profile.ts` and `apps/mobile/src/application/profile/profile-state.ts`
- [ ] T033 [P] [US3] Build the profile screen component with fallback fields and retry UI in `apps/mobile/src/ui/screens/profile-screen.tsx`
- [ ] T034 [US3] Wire profile route loading, retry, and partial-data states in `apps/mobile/app/profile.tsx` and `apps/mobile/src/application/auth/session-controller.ts`
- [ ] T035 [US3] Surface `display_name` fallbacks in shared profile selectors used by home and profile in `apps/mobile/src/application/profile/profile-selectors.ts` and `apps/mobile/src/ui/screens/home-screen.tsx`

**Checkpoint**: All three user stories are independently functional, including profile data loading and fallback handling.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize docs, automation, and cross-story verification

- [ ] T036 [P] Document setup, environment variables, and test commands in `README.md` and `apps/mobile/.env.example`
- [ ] T037 [P] Add CI automation for Expo tests and Supabase validation in `.github/workflows/mobile-auth-scaffold.yml`
- [ ] T038 Verify the quickstart flow and record final command updates in `specs/001-auth-app-scaffold/quickstart.md` and `AGENTS.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** has no dependencies and can start immediately.
- **Phase 2: Foundational** depends on Phase 1 and blocks all user story work.
- **Phase 3: US1** depends on Phase 2 and delivers the MVP login flow.
- **Phase 4: US2** depends on Phase 2. It is easiest to demo after US1, but it can be built against the shared auth provider without waiting for the login UI.
- **Phase 5: US3** depends on Phase 2. Task `T035` also depends on `T025` because it updates the home welcome state.
- **Phase 6: Polish** depends on the user stories you want to ship.

### User Story Dependencies

- **US1**: No dependency on other user stories after the foundational phase.
- **US2**: No hard dependency on US1 code, but recommended after US1 for end-to-end demo flow.
- **US3**: No hard dependency on US1 or US2 beyond the foundational auth/session infrastructure, except `T035` which extends the US2 home screen.

### Within Each User Story

- Tests must be written and failing before implementation.
- Infrastructure adapters should be completed before use cases that depend on them.
- Use cases and state models should be completed before route wiring.
- Route wiring should be completed before story-level polishing and manual verification.

### Parallel Opportunities

- `T003` and `T004` can run in parallel once `T001` starts the workspace.
- `T006`, `T007`, `T008`, and `T009` can run in parallel after `T005`.
- Within US1, `T012`, `T013`, and `T014` can run together, then `T015`, `T016`, and `T017` can run together.
- Within US2, `T020`, `T021`, and `T022` can run together, then `T023`, `T024`, and `T025` can run together.
- Within US3, `T028`, `T029`, and `T030` can run together, then `T031`, `T032`, and `T033` can run together.
- `T036` and `T037` can run in parallel during polish.

---

## Parallel Example: User Story 1

```bash
Task: "T012 [US1] Write failing unit tests in apps/mobile/tests/unit/auth/login-screen.test.tsx"
Task: "T013 [US1] Write failing integration tests in apps/mobile/tests/integration/auth/auth-service.test.tsx"
Task: "T014 [US1] Write failing Maestro flow in apps/mobile/tests/e2e/login-home-flow.yaml"

Task: "T015 [US1] Implement auth repository in apps/mobile/src/infrastructure/supabase/supabase-auth-repository.ts"
Task: "T016 [US1] Implement sign-in use case in apps/mobile/src/application/auth/sign-in.ts and apps/mobile/src/application/auth/login-form-state.ts"
Task: "T017 [US1] Build login UI in apps/mobile/src/ui/components/login-form.tsx and apps/mobile/src/ui/screens/login-screen.tsx"
```

---

## Parallel Example: User Story 2

```bash
Task: "T020 [US2] Write failing unit tests in apps/mobile/tests/unit/navigation/auth-nav.test.tsx"
Task: "T021 [US2] Write failing integration tests in apps/mobile/tests/integration/navigation/protected-navigation.test.tsx"
Task: "T022 [US2] Write failing Maestro flow in apps/mobile/tests/e2e/navigation-flow.yaml"

Task: "T023 [US2] Implement sign-out use case in apps/mobile/src/application/auth/sign-out.ts and apps/mobile/src/domain/navigation/nav-item.ts"
Task: "T024 [US2] Build auth navigation UI in apps/mobile/src/ui/navigation/auth-nav.tsx and apps/mobile/src/ui/components/nav-link.tsx"
Task: "T025 [US2] Build home screen shell in apps/mobile/src/ui/screens/home-screen.tsx"
```

---

## Parallel Example: User Story 3

```bash
Task: "T028 [US3] Write failing unit tests in apps/mobile/tests/unit/profile/profile-screen.test.tsx"
Task: "T029 [US3] Write failing integration tests in apps/mobile/tests/integration/profile/profile-repository.test.tsx"
Task: "T030 [US3] Write failing Maestro flow in apps/mobile/tests/e2e/profile-flow.yaml"

Task: "T031 [US3] Implement profile repository in apps/mobile/src/infrastructure/supabase/supabase-profile-repository.ts and apps/mobile/src/infrastructure/supabase/profile-mapper.ts"
Task: "T032 [US3] Implement profile query use case in apps/mobile/src/application/profile/get-current-profile.ts and apps/mobile/src/application/profile/profile-state.ts"
Task: "T033 [US3] Build profile UI in apps/mobile/src/ui/screens/profile-screen.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Validate the login flow independently with the unit, integration, and Maestro coverage for US1.
5. Demo or ship the MVP if only authentication is required.

### Incremental Delivery

1. Finish Setup + Foundational to establish the reusable auth and Supabase backbone.
2. Deliver US1 and validate protected login behavior.
3. Deliver US2 and validate authenticated navigation plus sign-out.
4. Deliver US3 and validate profile retrieval, fallback rendering, and retry behavior.
5. Finish Polish for docs, CI, and final verification.

### Parallel Team Strategy

1. One developer handles Supabase/backend foundation (`T005`-`T006`) while another handles mobile foundation (`T007`-`T011`) after setup.
2. After Phase 2, developers can split by story:
   - Developer A: US1 login flow
   - Developer B: US2 authenticated navigation
   - Developer C: US3 profile data
3. Merge after each checkpoint so every story remains independently testable.

---

## Notes

- `[P]` tasks touch different files and are safe to split across contributors.
- All story phases are test-first because the constitution mandates TDD and layered coverage.
- Exact dependency exceptions are called out in the dependency section instead of being implied.
- Recommended MVP scope: Phase 1 + Phase 2 + Phase 3.
