begin;

create extension if not exists pgtap;

select plan(3);

select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-0000-0000-000000000001',
  true
);

select is(
  (
    select count(*)::integer
    from public.profiles
    where user_id = '00000000-0000-0000-0000-000000000001'
  ),
  1,
  'authenticated users can read their own profile row'
);

select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-0000-0000-000000000002',
  true
);

select is(
  (
    select count(*)::integer
    from public.profiles
    where user_id = '00000000-0000-0000-0000-000000000001'
  ),
  0,
  'authenticated users cannot read another user profile row'
);

select lives_ok(
  $$
    insert into public.profiles (user_id)
    values ('00000000-0000-0000-0000-000000000002')
    on conflict (user_id) do nothing;
  $$,
  'authenticated users can provision their own profile row'
);

select * from finish();

rollback;

