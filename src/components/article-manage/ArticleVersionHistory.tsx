import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { History, RotateCcw, Loader2, Calendar } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Version {
  sha: string;
  title: string;
  created_at: string;
  author_name: string;
}

export default function ArticleVersionHistory({ articleId, articleTitle, onRollback }: {
  articleId: string;
  articleTitle: string;
  onRollback: () => void;
}) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [confirmVersion, setConfirmVersion] = useState<Version | null>(null);

  const fetchVersions = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("gitlab-versions", {
      body: { action: "list", projectId: articleId, projectTitle: articleTitle, entityType: "articles" },
    });
    if (error) { toast.error("Failed to fetch versions"); setLoading(false); return; }
    setVersions(data?.versions || []);
    setLoading(false);
  };

  const handleRestore = async (version: Version) => {
    setRestoring(version.sha);
    try {
      const { data, error } = await supabase.functions.invoke("gitlab-versions", {
        body: { action: "fetch", projectId: articleId, projectTitle: articleTitle, commitSha: version.sha, entityType: "articles" },
      });
      if (error || !data?.snapshot) throw new Error("Failed to fetch snapshot");
      const snapshot = data.snapshot;

      // Update article fields
      await supabase.from("news_articles" as any).update({
        title: snapshot.title || articleTitle,
        summary: snapshot.summary || "",
        tags: snapshot.tags || [],
        image_url: snapshot.image_url || null,
      } as any).eq("id", articleId);

      // Replace content sections
      await supabase.from("news_article_content" as any).delete().eq("article_id", articleId);
      if (snapshot.content?.length) {
        for (const section of snapshot.content) {
          await supabase.from("news_article_content" as any).insert({
            article_id: articleId,
            title: section.title || "",
            body: section.body || "",
            sort_order: section.sort_order ?? 0,
          } as any);
        }
      }

      toast.success("Article restored from version " + version.sha.slice(0, 7));
      onRollback();
    } catch (err: any) {
      toast.error("Restore failed: " + err.message);
    }
    setRestoring(null);
    setConfirmVersion(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-display font-bold">Version History</h3>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setExpanded(!expanded); if (!expanded && versions.length === 0) fetchVersions(); }}>
          {expanded ? "Hide" : "Show"} Versions
        </Button>
      </div>

      {expanded && (
        <div className="space-y-2">
          {loading && <p className="text-sm text-muted-foreground">Loading versions...</p>}
          {!loading && versions.length === 0 && <p className="text-sm text-muted-foreground">No versions found. Publish the article to create the first version.</p>}
          {versions.map((v) => (
            <Card key={v.sha} className="border-border/60">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{v.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(v.created_at).toLocaleString()} · {v.author_name} · <code className="text-[10px]">{v.sha.slice(0, 7)}</code>
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled={restoring === v.sha} onClick={() => setConfirmVersion(v)}>
                  {restoring === v.sha ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5 mr-1" />}
                  Restore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!confirmVersion} onOpenChange={(open) => !open && setConfirmVersion(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this version?</AlertDialogTitle>
            <AlertDialogDescription>This will replace the current article content with the version from {confirmVersion?.sha.slice(0, 7)}. You can publish again to save the current state first.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmVersion && handleRestore(confirmVersion)}>Restore</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
