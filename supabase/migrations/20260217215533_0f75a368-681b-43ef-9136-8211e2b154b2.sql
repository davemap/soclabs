
-- Table for rich text content sections on projects
CREATE TABLE public.project_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project content is viewable by everyone"
ON public.project_content FOR SELECT USING (true);

CREATE POLICY "Project owners can insert content"
ON public.project_content FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

CREATE POLICY "Project owners can update content"
ON public.project_content FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

CREATE POLICY "Project owners can delete content"
ON public.project_content FOR DELETE
USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

CREATE TRIGGER update_project_content_updated_at
BEFORE UPDATE ON public.project_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table for project milestones (both predefined and custom)
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase TEXT NOT NULL,
  task TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project milestones are viewable by everyone"
ON public.project_milestones FOR SELECT USING (true);

CREATE POLICY "Project owners can insert milestones"
ON public.project_milestones FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

CREATE POLICY "Project owners can update milestones"
ON public.project_milestones FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

CREATE POLICY "Project owners can delete milestones"
ON public.project_milestones FOR DELETE
USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

CREATE TRIGGER update_project_milestones_updated_at
BEFORE UPDATE ON public.project_milestones
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table for join requests
CREATE TABLE public.project_join_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE public.project_join_requests ENABLE ROW LEVEL SECURITY;

-- Project owners can see all requests for their projects
CREATE POLICY "Project owners can view join requests"
ON public.project_join_requests FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
  OR auth.uid() = user_id
);

-- Authenticated users can request to join
CREATE POLICY "Users can create join requests"
ON public.project_join_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Project owners can update request status (approve/deny)
CREATE POLICY "Project owners can update join requests"
ON public.project_join_requests FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

-- Users can delete their own pending requests
CREATE POLICY "Users can delete their own requests"
ON public.project_join_requests FOR DELETE
USING (auth.uid() = user_id AND status = 'pending');

CREATE TRIGGER update_project_join_requests_updated_at
BEFORE UPDATE ON public.project_join_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
