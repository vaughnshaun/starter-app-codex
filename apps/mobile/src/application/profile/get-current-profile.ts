import type { AppSession } from '../../domain/auth/session';
import type { ProfileRepository } from '../../domain/profile/profile';
import type { ProfileView } from '../../domain/profile/profile';

export async function getCurrentProfile(
  profileRepository: ProfileRepository,
  session: AppSession,
): Promise<ProfileView> {
  return profileRepository.getCurrentProfile(session.userId, session.email);
}

