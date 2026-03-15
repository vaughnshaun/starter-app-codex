create extension if not exists pgcrypto;

do $$
declare
  verified_user_id constant uuid := '00000000-0000-0000-0000-000000000001';
  pending_user_id constant uuid := '00000000-0000-0000-0000-000000000002';
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    is_super_admin,
    is_sso_user,
    is_anonymous
  )
  values
    (
      '00000000-0000-0000-0000-000000000000',
      verified_user_id,
      'authenticated',
      'authenticated',
      'verified@example.com',
      crypt('password123', gen_salt('bf')),
      timezone('utc', now()),
      timezone('utc', now()),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      timezone('utc', now()),
      timezone('utc', now()),
      false,
      false,
      false
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      pending_user_id,
      'authenticated',
      'authenticated',
      'pending@example.com',
      crypt('password123', gen_salt('bf')),
      null,
      timezone('utc', now()),
      null,
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      timezone('utc', now()),
      timezone('utc', now()),
      false,
      false,
      false
    )
  on conflict (id) do nothing;

  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values
    (
      gen_random_uuid(),
      verified_user_id,
      verified_user_id::text,
      format('{"sub":"%s","email":"verified@example.com"}', verified_user_id)::jsonb,
      'email',
      timezone('utc', now()),
      timezone('utc', now()),
      timezone('utc', now())
    ),
    (
      gen_random_uuid(),
      pending_user_id,
      pending_user_id::text,
      format('{"sub":"%s","email":"pending@example.com"}', pending_user_id)::jsonb,
      'email',
      null,
      timezone('utc', now()),
      timezone('utc', now())
    )
  on conflict (provider, provider_id) do nothing;

  insert into public.profiles (user_id, display_name, avatar_url)
  values (
    verified_user_id,
    'Verified Demo User',
    'https://images.example.com/avatar.png'
  )
  on conflict (user_id) do update
  set
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url;
end;
$$;

