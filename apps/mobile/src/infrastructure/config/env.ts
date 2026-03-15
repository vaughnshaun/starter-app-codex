export interface AppEnv {
  appScheme: string;
  supabaseAnonKey: string;
  supabaseUrl: string;
}

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  cachedEnv = {
    appScheme: 'startercodex',
    supabaseAnonKey,
    supabaseUrl,
  };

  return cachedEnv;
}

