
-- Function to auto-add new users as collaborators on projects they were invited to by email
CREATE OR REPLACE FUNCTION public.handle_email_invite_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  proj RECORD;
BEGIN
  -- Find all projects where this user's email is in the email_invites array
  FOR proj IN
    SELECT id, email_invites
    FROM public.projects
    WHERE NEW.email = ANY(email_invites)
  LOOP
    -- Create an accepted join request for the user
    INSERT INTO public.project_join_requests (project_id, user_id, status, message)
    VALUES (proj.id, NEW.id, 'accepted', 'Auto-added via email invitation')
    ON CONFLICT DO NOTHING;
    
    -- Remove the email from the invites list
    UPDATE public.projects
    SET email_invites = array_remove(email_invites, NEW.email)
    WHERE id = proj.id;
  END LOOP;
  
  RETURN NEW;
END;
$function$;

-- Create trigger on auth.users for new signups
CREATE TRIGGER on_auth_user_created_check_invites
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_email_invite_on_signup();
