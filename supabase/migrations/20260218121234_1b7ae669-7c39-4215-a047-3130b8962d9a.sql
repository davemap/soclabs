
-- Organisations table (DB-backed, replaces mock partners for user associations)
CREATE TABLE public.organisations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'academic',
  country text DEFAULT '',
  description text DEFAULT '',
  long_description text DEFAULT '',
  url text DEFAULT '',
  logo text DEFAULT '',
  email text DEFAULT '',
  created_by uuid,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organisations are viewable by everyone"
  ON public.organisations FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create organisations"
  ON public.organisations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Creators can update their organisations"
  ON public.organisations FOR UPDATE
  USING (auth.uid() = created_by);

-- Organisation join requests
CREATE TABLE public.organisation_join_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  message text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, organisation_id)
);

ALTER TABLE public.organisation_join_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own org join requests"
  ON public.organisation_join_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Org creators can view join requests for their orgs"
  ON public.organisation_join_requests FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.organisations
    WHERE organisations.id = organisation_join_requests.organisation_id
    AND organisations.created_by = auth.uid()
  ));

CREATE POLICY "Users can create join requests"
  ON public.organisation_join_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pending requests"
  ON public.organisation_join_requests FOR DELETE
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Org creators can update join request status"
  ON public.organisation_join_requests FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.organisations
    WHERE organisations.id = organisation_join_requests.organisation_id
    AND organisations.created_by = auth.uid()
  ));

-- Triggers for updated_at
CREATE TRIGGER update_organisations_updated_at
  BEFORE UPDATE ON public.organisations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_org_join_requests_updated_at
  BEFORE UPDATE ON public.organisation_join_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
