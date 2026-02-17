-- Add extended milestone fields
ALTER TABLE public.project_milestones
  ADD COLUMN IF NOT EXISTS blurb text DEFAULT '',
  ADD COLUMN IF NOT EXISTS assignee_id uuid DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS start_date date DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS projected_end_date date DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS completed_date date DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS learning_topic_ids text[] DEFAULT '{}'::text[];