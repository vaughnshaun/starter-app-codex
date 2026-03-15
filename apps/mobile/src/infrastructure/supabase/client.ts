import { createClient } from '@supabase/supabase-js';

import { getEnv } from '../config/env';
import { createSupabaseSecureStorageAdapter } from '../storage/session-storage';

export interface Database {
  public: {
    CompositeTypes: Record<string, never>;
    Enums: Record<string, never>;
    Functions: Record<string, never>;
    Tables: {
      profiles: {
        Insert: {
          avatar_url?: string | null;
          display_name?: string | null;
          user_id: string;
        };
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          updated_at: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          display_name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
  };
}

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const env = getEnv();

  supabaseClient = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: createSupabaseSecureStorageAdapter(),
    },
  });

  return supabaseClient;
}
