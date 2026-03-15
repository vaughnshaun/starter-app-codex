# Data Model: Authentication Account Scaffold

## Entity: Auth User

**Purpose**: Managed identity record issued by Supabase Auth and used to determine who can access protected application screens.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | UUID | Yes | Immutable primary identifier from Supabase Auth |
| `email` | Text | Yes | Unique sign-in identity and primary contact field |
| `verification_status` | Enum | Yes | `pending` or `verified`; only `verified` users may complete normal sign-in |
| `email_confirmed_at` | Timestamp | No | Populated when the user completes email verification |
| `status` | Enum | Yes | `active` or `disabled`; only `active` users may authenticate |
| `created_at` | Timestamp | Yes | Audit field maintained by the backend |
| `last_sign_in_at` | Timestamp | No | Updated after successful authentication |

**Relationships**:
- One `Auth User` owns one `Profile`.
- One `Auth User` can have many `App Session` records over time.
- One `Auth User` can receive many `Email Action` links over time.

**Validation Rules**:
- `email` must be syntactically valid and unique.
- `verification_status` defaults to `pending` at signup.
- `status` defaults to `active`.
- Disabled users must be denied new sessions.
- A non-verified user must not reach protected content through normal sign-in.

**State Transitions**:
- `pending` -> `verified`
- `pending` -> `disabled`
- `verified` -> `disabled`

## Entity: Email Action

**Purpose**: One-time email-delivered action used for account verification or password recovery.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `action_type` | Enum | Yes | `verify_email` or `recover_password` |
| `target_email` | Text | Yes | Email address the action was issued for |
| `issued_at` | Timestamp | Yes | When the action was generated |
| `expires_at` | Timestamp | Yes | Last valid time for the action |
| `consumed_at` | Timestamp | No | When the link was used successfully |
| `state` | Enum | Yes | `pending`, `consumed`, `expired`, or `invalid` |

**Relationships**:
- Each `Email Action` targets one `Auth User` or one pending signup identity.

**Validation Rules**:
- An action link must be single-use.
- A verification link must only verify the intended account.
- A recovery link must only unlock password reset for the intended account.
- Expired or invalid actions must not grant protected access.

**State Transitions**:
- `pending` -> `consumed`
- `pending` -> `expired`
- `pending` -> `invalid`

## Entity: Profile

**Purpose**: Application-owned record containing the user-facing data shown on the profile screen.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user_id` | UUID | Yes | Primary key and foreign key to `Auth User.id` |
| `display_name` | Text | No | Optional friendly name shown when available |
| `avatar_url` | Text | No | Optional image URL; omitted when not provided |
| `created_at` | Timestamp | Yes | Set when the profile row is created |
| `updated_at` | Timestamp | Yes | Updated on every profile mutation |

**Relationships**:
- Each `Profile` belongs to exactly one `Auth User`.

**Validation Rules**:
- `user_id` must match an existing authenticated user.
- `avatar_url`, when present, must be a valid absolute URL.
- Row-level access must restrict reads to the owning authenticated user.
- A basic profile row must exist by the time a verified user reaches the profile experience.

**State Transitions**:
- `missing` -> `provisioned`
- `provisioned` -> `updated`

## Entity: App Session

**Purpose**: Device-local representation of an authenticated session used to gate navigation and preserve sign-in state.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user_id` | UUID | Yes | References the current authenticated user |
| `access_token` | Secret String | Yes | Short-lived token; never logged |
| `refresh_token` | Secret String | Yes | Persisted securely for session renewal |
| `expires_at` | Timestamp | Yes | Used to detect expiry before showing protected content |
| `state` | Enum | Yes | `pending`, `authenticated`, `recovery`, `expired`, or `signed_out` |

**Relationships**:
- Each `App Session` belongs to one `Auth User`.

**Validation Rules**:
- Session secrets must only be stored in secure device storage.
- Expired sessions must not unlock protected routes.
- Signed-out sessions must be removed from device storage.
- Recovery sessions must only permit password reset actions until completion.

**State Transitions**:
- `pending` -> `authenticated`
- `pending` -> `recovery`
- `authenticated` -> `expired`
- `authenticated` -> `signed_out`
- `recovery` -> `signed_out`
- `expired` -> `signed_out`
