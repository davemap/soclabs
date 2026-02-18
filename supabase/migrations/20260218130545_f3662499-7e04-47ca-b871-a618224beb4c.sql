
-- Discussion comments table
CREATE TABLE public.discussion_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id TEXT NOT NULL,
  thread_subject TEXT NOT NULL DEFAULT 'General Discussion',
  parent_id UUID REFERENCES public.discussion_comments(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_discussion_comments_page_id ON public.discussion_comments(page_id);
CREATE INDEX idx_discussion_comments_parent_id ON public.discussion_comments(parent_id);

ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Discussion comments are viewable by everyone"
  ON public.discussion_comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.discussion_comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments"
  ON public.discussion_comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments"
  ON public.discussion_comments FOR DELETE
  USING (auth.uid() = author_id);

-- Discussion read status table (tracks when a user last read a page's discussion)
CREATE TABLE public.discussion_read_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  page_id TEXT NOT NULL,
  last_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, page_id)
);

CREATE INDEX idx_discussion_read_status_user ON public.discussion_read_status(user_id);

ALTER TABLE public.discussion_read_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own read status"
  ON public.discussion_read_status FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own read status"
  ON public.discussion_read_status FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own read status"
  ON public.discussion_read_status FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger for updated_at on comments
CREATE TRIGGER update_discussion_comments_updated_at
  BEFORE UPDATE ON public.discussion_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
