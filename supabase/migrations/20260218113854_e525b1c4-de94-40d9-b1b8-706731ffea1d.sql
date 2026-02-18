
-- Table to cache documentation scraped from ReadTheDocs
CREATE TABLE public.design_docs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  design_id text NOT NULL,
  section_id text NOT NULL,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  source_url text,
  last_synced_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (design_id, section_id)
);

-- Public read access (docs are public)
ALTER TABLE public.design_docs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Design docs are viewable by everyone"
  ON public.design_docs
  FOR SELECT
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_design_docs_updated_at
  BEFORE UPDATE ON public.design_docs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
