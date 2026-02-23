-- Store a JSON snapshot of the project when published, so non-owners see this instead of live draft data
ALTER TABLE public.projects ADD COLUMN published_data jsonb DEFAULT null;