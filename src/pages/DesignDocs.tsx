import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, ExternalLink, RefreshCw, Cpu, Github, ArrowRight, Tag, GitBranch } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/Layout";
import { referenceDesigns } from "@/data/mockData";
import { nanosocDocs } from "@/data/nanosocDocs";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface DocSection {
  id: string;
  section_id: string;
  title: string;
  content: string;
  sort_order: number;
  source_url: string | null;
  last_synced_at: string;
}

const DesignDocs = () => {
  const { id } = useParams<{ id: string }>();
  const design = referenceDesigns.find((d) => d.id === id);
  const [syncing, setSyncing] = useState(false);

  // Fetch docs from DB
  const { data: dbDocs, isLoading, refetch } = useQuery({
    queryKey: ["design-docs", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("design_docs")
        .select("*")
        .eq("design_id", id!)
        .order("sort_order");
      if (error) throw error;
      return data as DocSection[];
    },
    enabled: !!id,
  });

  // Use DB docs if available, otherwise fall back to static data
  const hasDbDocs = dbDocs && dbDocs.length > 0;
  const sections = hasDbDocs
    ? dbDocs.map((d) => ({ id: d.section_id, title: d.title, content: d.content }))
    : id === "nanosoc"
    ? nanosocDocs
    : null;

  const lastSynced = hasDbDocs ? dbDocs[0]?.last_synced_at : null;

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-design-docs", {
        body: { designId: id },
      });
      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Sync failed");
      toast.success("Documentation synced successfully");
      refetch();
    } catch (err) {
      console.error("Sync error:", err);
      toast.error("Failed to sync documentation");
    } finally {
      setSyncing(false);
    }
  };

  if (!design) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Design Not Found</h1>
          <Link to="/designs" className="text-primary hover:underline">Back to Designs</Link>
        </div>
      </Layout>
    );
  }

  if (!sections && !isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Documentation not available yet</h1>
          <Link to={`/designs/${id}`} className="text-primary hover:underline">Back to {design.name}</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link
              to={`/designs/${id}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Back to {design.name}
            </Link>
          </motion.div>

          <div className="flex gap-6 items-start max-w-5xl mx-auto">
            {/* Main column */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mb-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-display font-bold">{design.name} Documentation</h1>
                      <p className="text-muted-foreground text-sm mt-1">
                        Sourced from the{" "}
                        <a href={design.githubUrl + "/-/tree/main/docs/build/qthelp"} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                          repository docs <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full shrink-0" onClick={handleSync} disabled={syncing}>
                    <RefreshCw className={`h-4 w-4 mr-1.5 ${syncing ? "animate-spin" : ""}`} />
                    {syncing ? "Syncing…" : "Sync Docs"}
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <Badge variant="secondary">{design.processor}</Badge>
                  <Badge variant="outline">v{design.version || "latest"}</Badge>
                  {lastSynced && (
                    <span className="text-xs text-muted-foreground ml-2">
                      Last synced: {new Date(lastSynced).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Documentation tabs */}
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-96 w-full rounded-2xl" />
                </div>
              ) : sections ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Tabs defaultValue={sections[0].id} className="w-full">
                    <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5 rounded-xl mb-8">
                      {sections.map((section) => (
                        <TabsTrigger
                          key={section.id}
                          value={section.id}
                          className="rounded-lg text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                        >
                          {section.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {sections.map((section) => (
                      <TabsContent key={section.id} value={section.id}>
                        <div className="rounded-2xl border bg-card p-6 md:p-10">
                          <h2 className="text-2xl font-display font-bold mb-6">{section.title}</h2>
                          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-table:border-collapse prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2 prose-th:bg-muted/50 prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2 prose-a:text-primary">
                            <ReactMarkdown>{section.content}</ReactMarkdown>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </motion.div>
              ) : null}
            </div>

            {/* Sticky sidebar — matches DesignDetail layout */}
            <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
              <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-sm">
                <h3 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Get Started</h3>
                {(design.version || design.branch) && (
                  <div className="space-y-2 pb-2 border-b border-border/40">
                    {design.version && (
                      <div className="flex items-center gap-2 text-xs">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Version</span>
                        <span className="ml-auto font-mono font-semibold text-foreground">{design.version}</span>
                      </div>
                    )}
                    {design.branch && (
                      <div className="flex items-center gap-2 text-xs">
                        <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Branch</span>
                        <span className="ml-auto font-mono font-semibold text-foreground">{design.branch}</span>
                      </div>
                    )}
                  </div>
                )}
                <Button asChild className="w-full rounded-lg justify-start" size="sm">
                  <Link to={`/designs/${id}`}>
                    <Cpu className="h-4 w-4 mr-2" /> SoC Overview
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-lg justify-start" size="sm">
                  <a href={design.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" /> GitHub
                  </a>
                </Button>
                <Button asChild variant="ghost" className="w-full rounded-lg justify-start text-primary" size="sm">
                  <Link to="/projects/start">
                    <ArrowRight className="h-4 w-4 mr-2" /> Start a Project
                  </Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DesignDocs;
