
-- Create storage bucket for news article images
INSERT INTO storage.buckets (id, name, public) VALUES ('news-images', 'news-images', true);

-- Allow anyone to view news images
CREATE POLICY "News images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'news-images');

-- Allow authenticated users to upload their own news images
CREATE POLICY "Users can upload news images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'news-images' AND auth.uid() IS NOT NULL);

-- Allow users to update their own news images
CREATE POLICY "Users can update their own news images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'news-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own news images
CREATE POLICY "Users can delete their own news images"
ON storage.objects FOR DELETE
USING (bucket_id = 'news-images' AND auth.uid()::text = (storage.foldername(name))[1]);
