-- Add organisations array to projects table (stores partner IDs like "imperial-college-london")
ALTER TABLE public.projects
ADD COLUMN organisations text[] DEFAULT '{}'::text[];