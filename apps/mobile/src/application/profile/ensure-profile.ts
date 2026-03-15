import type { AppSession } from '../../domain/auth/session';
import { getSupabaseClient } from '../../infrastructure/supabase/client';

export async function ensureProfile(session: AppSession): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from('profiles').upsert(
    {
      user_id: session.userId,
    },
    {
      onConflict: 'user_id',
    },
  );

  if (error) {
    throw error;
  }
}

