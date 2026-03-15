import type { AppSession } from '../../domain/auth/session';
import { getSupabaseClient } from './client';
import { mapSupabaseSession } from './supabase-auth-repository';

export function subscribeToAuthEvents(
  listener: (session: AppSession | null) => void | Promise<void>,
): () => void {
  const client = getSupabaseClient();
  const subscription = client.auth.onAuthStateChange((_event, session) => {
    void listener(mapSupabaseSession(session));
  });

  return () => {
    subscription.data.subscription.unsubscribe();
  };
}

