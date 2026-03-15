import type { ProfileView } from '../../domain/profile/profile';
import type { Database } from './client';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export function mapProfileRow(row: ProfileRow, email: string): ProfileView {
  return {
    avatarUrl: row.avatar_url ?? undefined,
    displayName: row.display_name ?? undefined,
    email,
    userId: row.user_id,
  };
}

