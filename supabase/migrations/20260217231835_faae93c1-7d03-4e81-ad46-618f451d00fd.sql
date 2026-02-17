
-- Create table for phase-level retrospectives
CREATE TABLE public.project_phase_completions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase text NOT NULL,
  completed_date date,
  effort_rating integer,
  uncertainty_rating integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(project_id, phase)
);

ALTER TABLE public.project_phase_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Phase completions are viewable by everyone"
  ON public.project_phase_completions FOR SELECT USING (true);

CREATE POLICY "Project owners can insert phase completions"
  ON public.project_phase_completions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_phase_completions.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Project owners can update phase completions"
  ON public.project_phase_completions FOR UPDATE
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_phase_completions.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Project owners can delete phase completions"
  ON public.project_phase_completions FOR DELETE
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_phase_completions.project_id AND projects.user_id = auth.uid()));

CREATE TRIGGER update_project_phase_completions_updated_at
  BEFORE UPDATE ON public.project_phase_completions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
