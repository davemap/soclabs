-- Create storage bucket for project content images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-content', 'project-content', true);

-- Allow authenticated users to upload to their own project folders
CREATE POLICY "Authenticated users can upload project content images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-content'
  AND auth.uid() IS NOT NULL
);

-- Allow public read access
CREATE POLICY "Project content images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-content');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own project content images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-content'
  AND auth.uid() IS NOT NULL
);