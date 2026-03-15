# Starter App Codex

Expo SDK 55 mobile auth scaffold with Supabase Auth and a minimal `profiles`
table. The repo is structured as a workspace with the mobile app in
`apps/mobile` and Supabase assets in `supabase/`.

## Requirements

- Node.js 20.19+ or 22.12+
- npm 11+
- Docker Desktop for local Supabase services

## Install

```bash
npm install
```

## Environment

Copy the example values in [apps/mobile/.env.example](/Users/rehanavaughn/github/starter-app-codex/apps/mobile/.env.example)
into `apps/mobile/.env.local` or your Expo environment:

```bash
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Local Development

Start the Supabase stack, reset the schema, and run the pgTAP checks:

```bash
npx supabase start
npx supabase db reset
npx supabase db lint
npx supabase test db supabase/tests/profiles_rls.sql
```

Run the mobile app:

```bash
npm run start --workspace @starter/mobile
```

## Verification

Run the workspace checks:

```bash
npm test
npm run lint
npm run typecheck
```

Manual auth flow targets are documented in
[specs/001-auth-app-scaffold/quickstart.md](/Users/rehanavaughn/github/starter-app-codex/specs/001-auth-app-scaffold/quickstart.md)
and the timing record lives in
[specs/001-auth-app-scaffold/acceptance-results.md](/Users/rehanavaughn/github/starter-app-codex/specs/001-auth-app-scaffold/acceptance-results.md).

