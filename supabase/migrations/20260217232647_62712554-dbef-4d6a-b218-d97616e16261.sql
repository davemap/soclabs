-- Backfill profiles for existing users who don't have one
INSERT INTO public.profiles (user_id, username, full_name, orcid)
SELECT 
  u.id,
  u.raw_user_meta_data ->> 'username',
  u.raw_user_meta_data ->> 'full_name',
  u.raw_user_meta_data ->> 'orcid'
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.id IS NULL;