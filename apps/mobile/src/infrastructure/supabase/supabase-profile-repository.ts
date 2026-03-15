import type { ProfileRepository } from '../../domain/profile/profile';
import type { ProfileView } from '../../domain/profile/profile';
import { getSupabaseClient } from './client';
import { mapProfileRow } from './profile-mapper';

class SupabaseProfileRepository implements ProfileRepository {
  async getCurrentProfile(userId: string, email: string): Promise<ProfileView> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .select('user_id, display_name, avatar_url, created_at, updated_at')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw error;
    }

    return mapProfileRow(data, email);
  }
}

let repository: ProfileRepository | null = null;

export function getSupabaseProfileRepository(): ProfileRepository {
  if (!repository) {
    repository = new SupabaseProfileRepository();
  }

  return repository;
}

