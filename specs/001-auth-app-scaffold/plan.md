# Implementation Plan: Authentication Navigation Scaffold

**Branch**: `001-auth-app-scaffold` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-auth-app-scaffold/spec.md`

## Summary

Build an Expo SDK 55 mobile application scaffold for login, home, and profile flows, backed by Supabase Auth and a minimal profile data model. The implementation keeps UI, application logic, and infrastructure adapters separate, enforces protected navigation, and delivers unit, integration, and end-to-end coverage before the feature is considered complete.

## Technical Context

**Language/Version**: TypeScript 5.9+, Expo SDK 55.x, React 19.2.x as supported by Expo 55, React Native 0.83.x, SQL migrations for Supabase  
**Primary Dependencies**: `expo@55.x`, `react@19.2.x`, `react-native@0.83.x`, `expo-router`, `expo-secure-store`, `@supabase/supabase-js@2.78.0`, Supabase Auth, Supabase Postgres  
**Storage**: Supabase Postgres for profile records, Supabase Auth for identity/session issuance, secure device storage for persisted session tokens  
**Testing**: `jest-expo`, `@testing-library/react-native`, Supabase integration tests against a local stack, Maestro mobile end-to-end flows  
**Target Platform**: iOS and Android via Expo managed workflow, backed by hosted or local Supabase services  
**Project Type**: mobile-app + managed backend  
**Performance Goals**: Sign-in success path renders home within 2 seconds p95 on a normal network; in-app route changes feel instantaneous and complete within 300ms when data is already available  
**Constraints**: No business logic in route components; protected routes must fail closed; only public Supabase keys ship to the client; service-role credentials stay server-side only; minimize custom backend code to stay low-cost and portable  
**Scale/Scope**: Single-role MVP with 3 primary screens, read-only profile data, and initial adoption sized for up to 1k monthly active users and 100 concurrent sessions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **TDD**: PASS. Begin with failing tests for auth guards, error mapping, profile loading, and the login-home-profile E2E path.
- **Separation of Concerns**: PASS. Route files remain presentation-only; domain and application logic live under `src/domain` and `src/application`; Supabase and secure storage calls stay in `src/infrastructure`.
- **Portability**: PASS. Supabase access is wrapped behind repository and service interfaces so the backend can be replaced without rewriting screens.
- **Data Principles**: PASS. Profile storage is defined through explicit SQL migrations, owner-based access policies, and relational constraints keyed to authenticated users.
- **Testing Standards**: PASS. Unit, integration, and E2E layers are all required in the implementation sequence.
- **Spec-Driven Development**: PASS. This plan is derived from the approved feature spec and will be decomposed into tasks before implementation.
- **Security**: PASS. Authentication is delegated to Supabase Auth, profile access is policy-guarded, session persistence uses secure device storage, and secrets are excluded from the client bundle.
- **Cost Awareness**: PASS. Expo managed workflow plus Supabase managed services provides the lowest-complexity delivery path for this scope.
- **Definition of Done**: PASS. Completion requires passing tests, updated documentation, and CI verification.

**Post-Design Re-check**: PASS. The research decisions, data model, contract, and quickstart artifacts preserve all constitutional gates with no exceptions required.

## Project Structure

### Documentation (this feature)

```text
specs/001-auth-app-scaffold/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── mobile-auth-profile.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
└── mobile/
    ├── app/
    │   ├── _layout.tsx
    │   ├── login.tsx
    │   ├── index.tsx
    │   └── profile.tsx
    ├── src/
    │   ├── application/
    │   │   ├── auth/
    │   │   └── profile/
    │   ├── domain/
    │   │   ├── auth/
    │   │   ├── navigation/
    │   │   └── profile/
    │   ├── infrastructure/
    │   │   ├── config/
    │   │   ├── storage/
    │   │   └── supabase/
    │   └── ui/
    │       ├── components/
    │       ├── navigation/
    │       └── screens/
    └── tests/
        ├── unit/
        ├── integration/
        └── e2e/
supabase/
├── migrations/
├── seed.sql
└── tests/
```

**Structure Decision**: Use a monorepo-style workspace with an Expo mobile client in `apps/mobile` and Supabase backend assets in `supabase/`. This keeps the frontend/backend split explicit while preserving the constitution's layering rules inside the mobile application.

## Complexity Tracking

No constitutional violations or complexity exceptions are currently required.
