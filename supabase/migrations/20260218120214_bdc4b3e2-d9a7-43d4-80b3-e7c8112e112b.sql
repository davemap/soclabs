
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS blurb text DEFAULT '',
  ADD COLUMN IF NOT EXISTS location text DEFAULT '',
  ADD COLUMN IF NOT EXISTS organisations text[] DEFAULT '{}'::text[];
