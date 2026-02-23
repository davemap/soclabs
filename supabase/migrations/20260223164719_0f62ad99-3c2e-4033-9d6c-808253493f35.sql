
-- User roles enum and table for permission management
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'news_writer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: users can view their own roles, admins can view all
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- News articles table
CREATE TABLE public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  image_url text,
  status text NOT NULL DEFAULT 'Draft',
  published_at timestamptz,
  published_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are viewable by everyone"
  ON public.news_articles FOR SELECT
  USING (status = 'Published' OR auth.uid() = user_id);

CREATE POLICY "News writers can create articles"
  ON public.news_articles FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'news_writer'));

CREATE POLICY "Authors can update their own articles"
  ON public.news_articles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Authors can delete their own articles"
  ON public.news_articles FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- News article content sections (like project_content)
CREATE TABLE public.news_article_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.news_article_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article content is viewable by everyone"
  ON public.news_article_content FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM news_articles
    WHERE news_articles.id = news_article_content.article_id
    AND (news_articles.status = 'Published' OR news_articles.user_id = auth.uid())
  ));

CREATE POLICY "Authors can insert content"
  ON public.news_article_content FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM news_articles
    WHERE news_articles.id = news_article_content.article_id
    AND news_articles.user_id = auth.uid()
  ));

CREATE POLICY "Authors can update content"
  ON public.news_article_content FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM news_articles
    WHERE news_articles.id = news_article_content.article_id
    AND news_articles.user_id = auth.uid()
  ));

CREATE POLICY "Authors can delete content"
  ON public.news_article_content FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM news_articles
    WHERE news_articles.id = news_article_content.article_id
    AND news_articles.user_id = auth.uid()
  ));

CREATE TRIGGER update_news_article_content_updated_at
  BEFORE UPDATE ON public.news_article_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
