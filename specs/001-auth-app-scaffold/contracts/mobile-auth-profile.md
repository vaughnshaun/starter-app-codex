# Contract: Mobile Auth And Profile Flow

## Route Contract

### Route: `/login`

- **Access**: Public
- **Inputs**: `email`, `password`
- **Success outcome**: Creates an authenticated session and navigates to `/`
- **Failure outcomes**:
- Invalid credentials keep the user on `/login` and show a generic authentication error
- Empty required fields keep the user on `/login` and show validation feedback
- Backend or network failure keeps the user on `/login` and shows a retriable service error

### Route: `/`

- **Access**: Protected
- **Required data**:
- `session.user_id`
- A welcome label derived from `profile.display_name` when present, otherwise from `auth.email`
- **Available actions**:
- Navigate to `/profile`
- Sign out
- **Failure outcomes**:
- Missing or expired session redirects to `/login` before protected content renders

### Route: `/profile`

- **Access**: Protected
- **Required data**:
- `auth.email`
- `profile.display_name` when present
- `profile.avatar_url` when present
- **Available actions**:
- Retry profile load after a transient failure
- Navigate to `/`
- Sign out
- **Failure outcomes**:
- Missing or expired session redirects to `/login`
- Profile fetch failure shows a non-destructive error state with retry or return-home actions

## Service Contract

### AuthService

- `signIn(email: string, password: string) -> Promise<AppSession>`
- `signOut() -> Promise<void>`
- `hydrateSession() -> Promise<AppSession | null>`

**Behavior rules**:
- Invalid credentials return a generic authentication failure without exposing whether the email exists.
- `hydrateSession` returns `null` when no valid session is available.
- `signOut` removes persisted session state before navigation returns to `/login`.

### ProfileService

- `getCurrentProfile(userId: string) -> Promise<ProfileView>`

**ProfileView fields**:
- `userId`
- `email`
- `displayName?`
- `avatarUrl?`

**Behavior rules**:
- Only the currently authenticated user's profile may be returned.
- Transient backend failures return a retriable error, not a partially trusted payload.
