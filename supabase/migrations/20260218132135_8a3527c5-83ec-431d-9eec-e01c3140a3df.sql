
-- Add unique constraint on project_id + user_id for project_join_requests to support upsert
ALTER TABLE public.project_join_requests
ADD CONSTRAINT project_join_requests_project_user_unique UNIQUE (project_id, user_id);
