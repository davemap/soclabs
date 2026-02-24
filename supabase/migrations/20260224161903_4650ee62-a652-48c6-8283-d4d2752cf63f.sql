-- Allow admins to delete organisations
CREATE POLICY "Admins can delete organisations"
ON public.organisations
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));