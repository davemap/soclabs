import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, RotateCcw, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Version {
  sha: string;
  short_sha: string;
  message: string;
  date: string;
  author: string;
}

interface Props {
  projectId: string;
  projectTitle: string;
  onRollback: () => void;
}

export default function ProjectVersionHistory({ projectId, projectTitle, onRollback }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [fetched, setFetched] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [confirmVersion, setConfirmVersion] = useState<Version | null>(null);

  const loadVersions = async () => {
    if (fetched) {
      setExpanded(!expanded);
      return;
    }
    setLoading(true);
    setExpanded(true);
    try {
      const { data, error } = await supabase.functions.invoke("gitlab-versions", {
        body: { action: "list", projectId, projectTitle },
      });
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      setVersions(data.versions || []);
      setFetched(true);
    } catch (err: any) {
      toast.error("Failed to load version history", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (version: Version) => {
    setRestoring(true);
    try {
      // 1. Fetch the snapshot from GitLab at that commit
      const { data, error } = await supabase.functions.invoke("gitlab-versions", {
        body: { action: "fetch", projectId, projectTitle, commitSha: version.sha },
      });
      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      const snapshot = data.snapshot;

      // 2. Update the project fields
      const { error: updateErr } = await supabase.from("projects").update({
        title: snapshot.title,
        description: snapshot.description || "",
        status: snapshot.status || "Planning",
        target_technology: snapshot.target_technology || "",
        fpga_family: snapshot.fpga_family || "",
        asic_process: snapshot.asic_process || "",
        timeframe: snapshot.timeframe || "",
        github_url: snapshot.github_url || "",
        docs_url: snapshot.docs_url || "",
        image_url: snapshot.image_url || null,
        interests: snapshot.interests || [],
        technologies: snapshot.technologies || [],
        organisations: snapshot.organisations || [],
      }).eq("id", projectId);
      if (updateErr) throw updateErr;

      // 3. Replace content sections
      await supabase.from("project_content").delete().eq("project_id", projectId);
      if (snapshot.content?.length) {
        const contentRows = snapshot.content.map((c: any, i: number) => ({
          project_id: projectId,
          title: c.title || "",
          body: c.body || "",
          sort_order: c.sort_order ?? i,
        }));
        const { error: contentErr } = await supabase.from("project_content").insert(contentRows);
        if (contentErr) throw contentErr;
      }

      // 4. Replace milestones
      await supabase.from("project_milestones").delete().eq("project_id", projectId);
      if (snapshot.milestones?.length) {
        const milestoneRows = snapshot.milestones.map((m: any, i: number) => ({
          project_id: projectId,
          phase: m.phase,
          task: m.task,
          done: m.done ?? false,
          sort_order: m.sort_order ?? i,
          blurb: m.blurb || "",
          start_date: m.start_date || null,
          projected_end_date: m.projected_end_date || null,
          completed_date: m.completed_date || null,
          effort_rating: m.effort_rating || null,
          uncertainty_rating: m.uncertainty_rating || null,
          assignee_id: m.assignee_id || null,
          learning_topic_ids: m.learning_topic_ids || [],
        }));
        const { error: mErr } = await supabase.from("project_milestones").insert(milestoneRows);
        if (mErr) throw mErr;
      }

      // 5. Replace phase completions
      await supabase.from("project_phase_completions").delete().eq("project_id", projectId);
      if (snapshot.phase_completions?.length) {
        const phaseRows = snapshot.phase_completions.map((p: any) => ({
          project_id: projectId,
          phase: p.phase,
          completed_date: p.completed_date || null,
          effort_rating: p.effort_rating || null,
          uncertainty_rating: p.uncertainty_rating || null,
        }));
        const { error: pErr } = await supabase.from("project_phase_completions").insert(phaseRows);
        if (pErr) throw pErr;
      }

      toast.success(`Rolled back to version ${version.short_sha}`);
      onRollback();
    } catch (err: any) {
      toast.error("Rollback failed", { description: err.message });
    } finally {
      setRestoring(false);
      setConfirmVersion(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
      <button
        onClick={loadVersions}
        className="w-full flex items-center gap-2.5 p-4 text-left hover:bg-accent/30 transition-colors"
        disabled={loading}
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          {loading ? <Loader2 className="h-4 w-4 text-primary animate-spin" /> : <History className="h-4 w-4 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-display font-bold">Version History</h3>
          <p className="text-xs text-muted-foreground">Roll back to a previously published version from Git</p>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {versions.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground py-2">No published versions found in Git.</p>
              )}
              {versions.map((v, i) => (
                <div
                  key={v.sha}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition-all",
                    i === 0
                      ? "border-primary/30 bg-primary/5"
                      : "border-border/50 hover:border-primary/20 hover:bg-accent/10"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <code className="text-xs font-mono text-primary">{v.short_sha}</code>
                      {i === 0 && <Badge variant="outline" className="text-[10px] px-1.5 py-0">latest</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{v.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{formatDate(v.date)} • {v.author}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full shrink-0 text-xs h-7 px-3"
                    onClick={() => setConfirmVersion(v)}
                    disabled={restoring}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={!!confirmVersion} onOpenChange={(open) => !open && setConfirmVersion(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore version {confirmVersion?.short_sha}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace all current project data (content, milestones, settings) with the snapshot from this version. Your current draft will be overwritten. You can re-publish afterwards to update the public page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={restoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmVersion && handleRollback(confirmVersion)}
              disabled={restoring}
              className="bg-primary"
            >
              {restoring ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Restoring...</> : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
