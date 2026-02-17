
ALTER TABLE public.project_milestones
  ADD COLUMN IF NOT EXISTS effort_rating integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS uncertainty_rating integer DEFAULT NULL;
