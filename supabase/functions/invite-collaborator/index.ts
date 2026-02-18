import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, projectId } = await req.json();
    if (!email || !projectId) {
      return new Response(JSON.stringify({ error: "Missing email or projectId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is the project owner
    const { data: project } = await adminClient
      .from("projects")
      .select("id, title, user_id, email_invites")
      .eq("id", projectId)
      .single();

    if (!project || project.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Not project owner" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u: any) => u.email?.toLowerCase() === trimmedEmail
    );

    if (existingUser) {
      // User exists — create an accepted join request directly
      const { error: joinError } = await adminClient
        .from("project_join_requests")
        .upsert(
          {
            project_id: projectId,
            user_id: existingUser.id,
            status: "accepted",
            message: "Invited by project owner",
          },
          { onConflict: "project_id,user_id" }
        );

      if (joinError) {
        console.error("Join request error:", joinError);
      }

      // Remove from email_invites if present
      const updatedInvites = (project.email_invites || []).filter(
        (e: string) => e !== trimmedEmail
      );
      await adminClient
        .from("projects")
        .update({ email_invites: updatedInvites })
        .eq("id", projectId);

      return new Response(
        JSON.stringify({ success: true, status: "existing_user_added" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // User doesn't exist — send invite email via Supabase Auth
    // Store email in email_invites first
    const currentInvites = project.email_invites || [];
    if (!currentInvites.includes(trimmedEmail)) {
      await adminClient
        .from("projects")
        .update({ email_invites: [...currentInvites, trimmedEmail] })
        .eq("id", projectId);
    }

    // Send the magic link / invite
    const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
      trimmedEmail,
      {
        data: {
          invited_to_project: projectId,
          invited_to_project_title: project.title,
        },
        redirectTo: `${supabaseUrl.replace('.supabase.co', '.supabase.co')}/auth/v1/callback`,
      }
    );

    if (inviteError) {
      console.error("Invite error:", inviteError);
      // Still succeed — email is stored in email_invites for auto-join on manual signup
      return new Response(
        JSON.stringify({
          success: true,
          status: "invite_stored",
          message: "Email saved. They will be auto-added when they create an account.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, status: "invite_sent" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
