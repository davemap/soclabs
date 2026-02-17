
-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  reference_soc TEXT NOT NULL,
  target_technology TEXT DEFAULT '',
  fpga_family TEXT DEFAULT '',
  asic_process TEXT DEFAULT '',
  timeframe TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  docs_url TEXT DEFAULT '',
  interests TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  invited_members TEXT[] DEFAULT '{}',
  email_invites TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'Planning',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view projects
CREATE POLICY "Projects are viewable by everyone"
ON public.projects FOR SELECT
USING (true);

-- Users can create their own projects
CREATE POLICY "Users can create their own projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update their own projects"
ON public.projects FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete their own projects"
ON public.projects FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Timestamp trigger
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
