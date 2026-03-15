import type { ProfileView } from '../../domain/profile/profile';

export function selectWelcomeLabel(
  profile: ProfileView | null,
  email: string,
): string {
  return profile?.displayName?.trim() || email;
}

