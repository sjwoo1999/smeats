-- Create public bucket for product images
INSERT INTO storage.buckets (id, name, public)
SELECT 'product-images', 'product-images', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'product-images'
);

-- Allow authenticated users to upload to their own prefix
CREATE POLICY IF NOT EXISTS "product-images-insert-own-prefix"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  name LIKE auth.uid()::text || '/%'
);

-- Allow authenticated users to update their own files
CREATE POLICY IF NOT EXISTS "product-images-update-own"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'product-images' AND
  name LIKE auth.uid()::text || '/%'
);

-- Allow authenticated users to delete their own files
CREATE POLICY IF NOT EXISTS "product-images-delete-own"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'product-images' AND
  name LIKE auth.uid()::text || '/%'
);

-- Public read access (via bucket.public = true)
-- No additional policy needed for SELECT
