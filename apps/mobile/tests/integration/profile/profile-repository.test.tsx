import { mapProfileRow } from '../../../src/infrastructure/supabase/profile-mapper';

describe('mapProfileRow', () => {
  it('maps nullable optional fields to an app-friendly view model', () => {
    const profile = mapProfileRow(
      {
        avatar_url: null,
        created_at: '2026-03-15T10:00:00.000Z',
        display_name: null,
        updated_at: '2026-03-15T10:00:00.000Z',
        user_id: 'user-1',
      },
      'user@example.com',
    );

    expect(profile).toEqual({
      avatarUrl: undefined,
      displayName: undefined,
      email: 'user@example.com',
      userId: 'user-1',
    });
  });
});

