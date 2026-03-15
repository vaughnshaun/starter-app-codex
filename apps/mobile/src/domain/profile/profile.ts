export interface ProfileRecord {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface ProfileView {
  userId: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface ProfileRepository {
  getCurrentProfile(userId: string, email: string): Promise<ProfileView>;
}

