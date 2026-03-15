# Data Model: Authentication Navigation Scaffold

## Entity: Auth User

**Purpose**: Managed identity record issued by Supabase Auth and used to determine who can access protected application screens.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | UUID | Yes | Immutable primary identifier from Supabase Auth |
| `email` | Text | Yes | Unique sign-in identity and primary contact field |
| `status` | Enum | Yes | `active` or `disabled`; only `active` users may authenticate |
| `created_at` | Timestamp | Yes | Audit field maintained by the backend |
| `last_sign_in_at` | Timestamp | No | Updated after successful authentication |

**Relationships**:
- One `Auth User` owns one `Profile`.
- One `Auth User` can have many `App Session` records over time.

**Validation Rules**:
- `email` must be syntactically valid and unique.
- `status` defaults to `active`.
- Disabled users must be denied new sessions.

**State Transitions**:
- `provisioned` -> `active`
- `active` -> `disabled`

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
| `state` | Enum | Yes | `pending`, `authenticated`, `expired`, or `signed_out` |

**Relationships**:
- Each `App Session` belongs to one `Auth User`.

**Validation Rules**:
- Session secrets must only be stored in secure device storage.
- Expired sessions must not unlock protected routes.
- Signed-out sessions must be removed from device storage.

**State Transitions**:
- `pending` -> `authenticated`
- `authenticated` -> `expired`
- `authenticated` -> `signed_out`
- `expired` -> `signed_out`
