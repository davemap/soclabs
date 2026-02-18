import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Documentation sections to scrape for each design
const DESIGN_DOCS: Record<
  string,
  { sectionId: string; title: string; url: string; sortOrder: number }[]
> = {
  nanosoc: [
    { sectionId: "getting-started", title: "Getting Started", url: "https://nanosoc-project.readthedocs.io/en/latest/getting_started.html", sortOrder: 0 },
    { sectionId: "adding-your-ip", title: "Adding your IP", url: "https://nanosoc-project.readthedocs.io/en/latest/adding_your_ip.html", sortOrder: 1 },
    { sectionId: "writing-software", title: "Writing Software", url: "https://nanosoc-project.readthedocs.io/en/latest/writing_software.html", sortOrder: 2 },
    { sectionId: "simulation", title: "Simulation", url: "https://nanosoc-project.readthedocs.io/en/latest/simulation.html", sortOrder: 3 },
    { sectionId: "fpga-flow", title: "FPGA Flow", url: "https://nanosoc-project.readthedocs.io/en/latest/fpga_build.html", sortOrder: 4 },
    { sectionId: "asic-implementation", title: "ASIC Implementation", url: "https://nanosoc-project.readthedocs.io/en/latest/asic_implementation.html", sortOrder: 5 },
  ],
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const resp = await fetch(url, {
      headers: { "User-Agent": "SoCLabs-DocSync/1.0" },
    });
    if (resp.ok) return resp;
    if (resp.status === 429 && i < retries - 1) {
      const waitMs = (i + 1) * 2000;
      console.log(`Rate limited on ${url}, waiting ${waitMs}ms...`);
      await resp.text(); // consume body
      await delay(waitMs);
      continue;
    }
    await resp.text();
    throw new Error(`Failed to fetch ${url}: ${resp.status}`);
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

async function scrapeReadTheDocs(url: string): Promise<string> {
  const resp = await fetchWithRetry(url);
  // The content is typically within <div role="main"> or <div class="body">
  let content = html;

  // Remove HTML tags but preserve structure with markdown-like formatting
  // Extract body content between the main content div
  const bodyMatch = content.match(/<div[^>]*role="main"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i)
    || content.match(/<div[^>]*class="body"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i)
    || content.match(/<div[^>]*class="rst-content"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);

  if (bodyMatch) {
    content = bodyMatch[1];
  }

  // Convert HTML to rough markdown
  content = content
    // Remove script and style tags
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    // Convert headers
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "#### $1\n\n")
    // Convert code blocks
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "\n```\n$1\n```\n")
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "\n```\n$1\n```\n")
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    // Convert lists
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
    .replace(/<[uo]l[^>]*>/gi, "\n")
    .replace(/<\/[uo]l>/gi, "\n")
    // Convert tables
    .replace(/<table[\s\S]*?<\/table>/gi, (match) => {
      const rows: string[] = [];
      const rowMatches = match.match(/<tr[\s\S]*?<\/tr>/gi) || [];
      rowMatches.forEach((row, i) => {
        const cells = (row.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi) || [])
          .map((cell) => cell.replace(/<[^>]+>/g, "").trim());
        rows.push("| " + cells.join(" | ") + " |");
        if (i === 0) {
          rows.push("| " + cells.map(() => "---").join(" | ") + " |");
        }
      });
      return "\n" + rows.join("\n") + "\n";
    })
    // Convert links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    // Convert bold/italic
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*")
    // Convert paragraphs and breaks
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    // Convert blockquotes
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) =>
      inner.split("\n").map((l: string) => `> ${l}`).join("\n") + "\n"
    )
    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, "")
    // Decode HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    // Remove permalink symbols
    .replace(/¶/g, "")
    // Clean up whitespace
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return content;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { designId } = await req.json();

    if (!designId || !DESIGN_DOCS[designId]) {
      return new Response(
        JSON.stringify({ success: false, error: `Unknown design: ${designId}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const sections = DESIGN_DOCS[designId];
    const results: { sectionId: string; success: boolean; error?: string }[] = [];

    for (const section of sections) {
      try {
        console.log(`Scraping ${section.url}...`);
        // Delay between requests to avoid rate limiting
        if (results.length > 0) await delay(800);
        const content = await scrapeReadTheDocs(section.url);

        const { error } = await supabase.from("design_docs").upsert(
          {
            design_id: designId,
            section_id: section.sectionId,
            title: section.title,
            content,
            sort_order: section.sortOrder,
            source_url: section.url,
            last_synced_at: new Date().toISOString(),
          },
          { onConflict: "design_id,section_id" }
        );

        if (error) {
          console.error(`DB error for ${section.sectionId}:`, error);
          results.push({ sectionId: section.sectionId, success: false, error: error.message });
        } else {
          results.push({ sectionId: section.sectionId, success: true });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`Scrape error for ${section.sectionId}:`, msg);
        results.push({ sectionId: section.sectionId, success: false, error: msg });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
