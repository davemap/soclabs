-- Table to store user interest registrations
CREATE TABLE public.user_interests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  interest_slug text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, interest_slug)
);

ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User interests are viewable by everyone"
  ON public.user_interests FOR SELECT USING (true);

CREATE POLICY "Users can insert their own interests"
  ON public.user_interests FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interests"
  ON public.user_interests FOR DELETE USING (auth.uid() = user_id);