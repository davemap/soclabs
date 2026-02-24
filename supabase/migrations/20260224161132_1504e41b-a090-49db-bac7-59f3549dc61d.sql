-- Drop the restrictive news_writer-only insert policy
DROP POLICY IF EXISTS "News writers can create articles" ON public.news_articles;

-- Allow any authenticated user to create articles (they can only set their own user_id)
CREATE POLICY "Authenticated users can create articles"
ON public.news_articles
FOR INSERT
WITH CHECK (auth.uid() = user_id);