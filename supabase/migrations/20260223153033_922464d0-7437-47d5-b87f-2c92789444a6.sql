-- Add published_at to track when project was last published
ALTER TABLE public.projects ADD COLUMN published_at timestamptz DEFAULT null;