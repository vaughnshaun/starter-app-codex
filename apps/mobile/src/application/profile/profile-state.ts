import type { ProfileView } from '../../domain/profile/profile';

export type ProfileState =
  | { status: 'idle' | 'loading' }
  | { status: 'error'; message: string }
  | { profile: ProfileView; status: 'ready' };

export function createLoadingProfileState(): ProfileState {
  return { status: 'loading' };
}

