# Contract: Mobile Auth And Profile Flow

## Route Contract

### Route: `/login`

- **Access**: Public
- **Inputs**: `email`, `password`
- **Success outcome**: Creates an authenticated session and navigates to `/`
- **Failure outcomes**:
- Invalid credentials keep the user on `/login` and show a generic authentication error
- Unverified accounts keep the user on `/login` and show a verification-required error
- Empty required fields keep the user on `/login` and show validation feedback
- Backend or network failure keeps the user on `/login` and shows a retriable service error

### Route: `/sign-up`

- **Access**: Public
- **Inputs**: `email`, `password`, `confirmPassword`
- **Success outcome**: Creates an account, sends a verification email, and shows a verification-pending confirmation state
- **Failure outcomes**:
- Existing-account conflicts keep the user on `/sign-up` and show a clear corrective message
- Invalid input keeps the user on `/sign-up` and shows validation feedback
- Backend or network failure keeps the user on `/sign-up` and shows a retriable service error

### Route: `/forgot-password`

- **Access**: Public
- **Inputs**: `email`
- **Success outcome**: Shows a neutral confirmation message after the reset request is submitted
- **Failure outcomes**:
- Empty or invalid email input keeps the user on `/forgot-password` and shows validation feedback
- Backend or network failure keeps the user on `/forgot-password` and shows a retriable service error

### Route: `/reset-password`

- **Access**: Public with valid recovery link state
- **Inputs**: `password`, `confirmPassword`
- **Success outcome**: Updates the password and navigates to `/login` with a success state
- **Failure outcomes**:
- Missing or invalid recovery state shows an error and a path back to `/forgot-password`
- Invalid password input keeps the user on `/reset-password` and shows validation feedback
- Backend or network failure keeps the user on `/reset-password` and shows a retriable service error

### Route: `/auth/callback`

- **Access**: Public
- **Inputs**: Email action link parameters
- **Success outcome**:
- Verification links create a verified session and navigate to `/`
- Recovery links navigate to `/reset-password`
- **Failure outcomes**:
- Invalid, expired, or already-used links show a non-destructive error state with a resend or retry path

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

- `signUp(email: string, password: string) -> Promise<void>`
- `signIn(email: string, password: string) -> Promise<AppSession>`
- `resendVerification(email: string) -> Promise<void>`
- `requestPasswordReset(email: string) -> Promise<void>`
- `updatePassword(password: string) -> Promise<void>`
- `handleEmailLink(url: string) -> Promise<{ action: "verified" | "recovery" }>`
- `signOut() -> Promise<void>`
- `hydrateSession() -> Promise<AppSession | null>`

**Behavior rules**:
- `signUp` creates an unverified account and triggers a verification email.
- Invalid credentials return a generic authentication failure without exposing whether the email exists.
- Unverified accounts return a verification-required failure instead of a protected session.
- `requestPasswordReset` returns a neutral response regardless of account existence.
- `handleEmailLink` routes verified users to `/` and routes recovery users to `/reset-password`.
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
