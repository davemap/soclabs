import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GITLAB_TOKEN = Deno.env.get("GITLAB_ACCESS_TOKEN");
    if (!GITLAB_TOKEN) throw new Error("GITLAB_ACCESS_TOKEN is not configured");

    const GITLAB_PROJECT_ID = Deno.env.get("GITLAB_REPO_ID");
    if (!GITLAB_PROJECT_ID) throw new Error("GITLAB_REPO_ID is not configured");

    const GITLAB_HOST = Deno.env.get("GITLAB_HOST") || "git.soton.ac.uk";
    const GITLAB_API = `https://${GITLAB_HOST}/api/v4/projects/${encodeURIComponent(GITLAB_PROJECT_ID)}`;

    const { action, projectId, projectTitle, commitSha } = await req.json();

    // Build folder path (must match commit-to-gitlab logic)
    const slug = projectTitle
      ? projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : projectId;
    const folder = `projects/${slug}-${projectId.slice(0, 8)}`;

    if (action === "list") {
      // List commits that touched this project's folder
      const url = `${GITLAB_API}/repository/commits?ref_name=main&path=${encodeURIComponent(folder)}&per_page=20`;
      const res = await fetch(url, {
        headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`GitLab API error [${res.status}]: ${errBody}`);
      }
      const commits = await res.json();
      const versions = commits.map((c: any) => ({
        sha: c.id,
        short_sha: c.short_id,
        message: c.message,
        date: c.created_at,
        author: c.author_name,
      }));

      return new Response(JSON.stringify({ success: true, versions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "fetch") {
      if (!commitSha) throw new Error("commitSha is required for fetch action");

      // Fetch snapshot.json at the given commit
      const filePath = `${folder}/snapshot.json`;
      const url = `${GITLAB_API}/repository/files/${encodeURIComponent(filePath)}?ref=${commitSha}`;
      const res = await fetch(url, {
        headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`GitLab file fetch error [${res.status}]: ${errBody}`);
      }
      const fileData = await res.json();
      // GitLab returns base64-encoded content
      const content = atob(fileData.content);
      const snapshot = JSON.parse(content);

      return new Response(JSON.stringify({ success: true, snapshot }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (error: unknown) {
    console.error("gitlab-versions error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
