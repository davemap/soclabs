-- Add UPDATE policy for project-content bucket so upsert works
CREATE POLICY "Authenticated users can update project content images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'project-content' AND auth.uid() IS NOT NULL);