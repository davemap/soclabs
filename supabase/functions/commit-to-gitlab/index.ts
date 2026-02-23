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
    if (!GITLAB_TOKEN) {
      throw new Error("GITLAB_ACCESS_TOKEN is not configured");
    }

    const { projectId, projectTitle, snapshot } = await req.json();
    if (!projectId || !snapshot) {
      throw new Error("Missing projectId or snapshot");
    }

    // Configurable: set your GitLab project ID/path here
    const GITLAB_PROJECT_ID = Deno.env.get("GITLAB_REPO_ID");
    if (!GITLAB_PROJECT_ID) {
      throw new Error("GITLAB_REPO_ID secret is not configured. Set it to the GitLab project ID or URL-encoded path.");
    }

    const GITLAB_HOST = Deno.env.get("GITLAB_HOST") || "git.soton.ac.uk";
    const GITLAB_API = `https://${GITLAB_HOST}/api/v4/projects/${encodeURIComponent(GITLAB_PROJECT_ID)}`;
    console.log("DEBUG: GITLAB_API =", GITLAB_API);
    console.log("DEBUG: Token length =", GITLAB_TOKEN?.length, "Token prefix =", GITLAB_TOKEN?.substring(0, 6));
    const branch = "main";
    const timestamp = new Date().toISOString();
    const slug = projectTitle
      ? projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : projectId;
    const folder = `projects/${slug}-${projectId.slice(0, 8)}`;

    // Build Markdown representation of the page
    const md = buildMarkdown(snapshot, timestamp);
    const jsonContent = JSON.stringify(snapshot, null, 2);

    // Use the GitLab Commits API to create/update multiple files in one commit
    const actions = [
      {
        action: "create", // will be overridden to "update" if file exists
        file_path: `${folder}/page.md`,
        content: md,
      },
      {
        action: "create",
        file_path: `${folder}/snapshot.json`,
        content: jsonContent,
      },
    ];

    // Check which files already exist so we use "update" action
    for (const a of actions) {
      const exists = await fileExists(GITLAB_API, a.file_path, branch, GITLAB_TOKEN);
      if (exists) a.action = "update";
    }

    const commitPayload = {
      branch,
      commit_message: `Publish ${projectTitle || projectId} – ${timestamp}`,
      actions,
    };

    const commitRes = await fetch(`${GITLAB_API}/repository/commits`, {
      method: "POST",
      headers: {
        "PRIVATE-TOKEN": GITLAB_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commitPayload),
    });

    if (!commitRes.ok) {
      const errBody = await commitRes.text();
      throw new Error(`GitLab commit failed [${commitRes.status}]: ${errBody}`);
    }

    const commitData = await commitRes.json();

    return new Response(
      JSON.stringify({ success: true, commit_id: commitData.id, web_url: commitData.web_url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error committing to GitLab:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function fileExists(apiBase: string, filePath: string, branch: string, token: string): Promise<boolean> {
  const url = `${apiBase}/repository/files/${encodeURIComponent(filePath)}?ref=${branch}`;
  const res = await fetch(url, {
    method: "HEAD",
    headers: { "PRIVATE-TOKEN": token },
  });
  return res.ok;
}

function buildMarkdown(snapshot: any, timestamp: string): string {
  const lines: string[] = [];
  lines.push(`# ${snapshot.title || "Untitled Project"}`);
  lines.push("");
  lines.push(`> Published: ${timestamp}`);
  lines.push("");

  if (snapshot.description) {
    lines.push(snapshot.description);
    lines.push("");
  }

  // Metadata table
  const meta: [string, string][] = [];
  if (snapshot.status) meta.push(["Status", snapshot.status]);
  if (snapshot.target_technology) meta.push(["Target Technology", snapshot.target_technology]);
  if (snapshot.fpga_family) meta.push(["FPGA Family", snapshot.fpga_family]);
  if (snapshot.asic_process) meta.push(["ASIC Process", snapshot.asic_process]);
  if (snapshot.timeframe) meta.push(["Timeframe", snapshot.timeframe]);
  if (snapshot.github_url) meta.push(["GitHub", snapshot.github_url]);
  if (snapshot.docs_url) meta.push(["Docs", snapshot.docs_url]);
  if (snapshot.interests?.length) meta.push(["Interests", snapshot.interests.join(", ")]);
  if (snapshot.technologies?.length) meta.push(["Technologies", snapshot.technologies.join(", ")]);
  if (snapshot.organisations?.length) meta.push(["Organisations", snapshot.organisations.join(", ")]);

  if (meta.length) {
    lines.push("## Project Details");
    lines.push("");
    lines.push("| Field | Value |");
    lines.push("|-------|-------|");
    for (const [k, v] of meta) {
      lines.push(`| ${k} | ${v} |`);
    }
    lines.push("");
  }

  // Content sections
  if (snapshot.content?.length) {
    for (const section of snapshot.content) {
      lines.push(`## ${section.title || "Section"}`);
      lines.push("");
      if (section.body) lines.push(section.body);
      lines.push("");
    }
  }

  // Milestones
  if (snapshot.milestones?.length) {
    lines.push("## Milestones");
    lines.push("");
    lines.push("| Phase | Task | Done | Start | End |");
    lines.push("|-------|------|------|-------|-----|");
    for (const m of snapshot.milestones) {
      lines.push(
        `| ${m.phase} | ${m.task} | ${m.done ? "✅" : "⬜"} | ${m.start_date || "-"} | ${m.projected_end_date || "-"} |`
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}
