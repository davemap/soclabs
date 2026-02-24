import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Globe, Loader2, Trash2, AlertCircle, History as HistoryIcon, Settings, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import ArticleContentManager from "@/components/article-manage/ArticleContentManager";
import ArticleVersionHistory from "@/components/article-manage/ArticleVersionHistory";
import DragToDeleteDialog from "@/components/DragToDeleteDialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { allNewsTags } from "@/data/newsData";
import { toast } from "sonner";

const ArticleEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Editable fields
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [savingTitle, setSavingTitle] = useState(false);
  const [savingSummary, setSavingSummary] = useState(false);
  const [titleDirty, setTitleDirty] = useState(false);
  const [summaryDirty, setSummaryDirty] = useState(false);
  const [tagsDirty, setTagsDirty] = useState(false);
  const [savingTags, setSavingTags] = useState(false);

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    const { data } = await supabase.from("news_articles" as any).select("*").eq("id", id).single();
    if (data) {
      setArticle(data);
      setEditTitle((data as any).title);
      setEditSummary((data as any).summary || "");
      setEditTags((data as any).tags || []);
      setTitleDirty(false);
      setSummaryDirty(false);
      setTagsDirty(false);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchArticle(); }, [fetchArticle]);

  const isOwner = user && article && user.id === (article as any).user_id;

  const hasUnpublishedChanges = useMemo(() => {
    if (!article) return false;
    if (!(article as any).published_at) return true;
    const updatedMs = new Date((article as any).updated_at).getTime();
    const publishedMs = new Date((article as any).published_at).getTime();
    return updatedMs - publishedMs > 2000;
  }, [article]);

  const hasUnsavedChanges = titleDirty || summaryDirty || tagsDirty;

  const saveTitle = async () => {
    if (!article || !editTitle.trim()) return;
    setSavingTitle(true);
    const { error } = await supabase.from("news_articles" as any).update({ title: editTitle.trim() } as any).eq("id", (article as any).id);
    if (error) toast.error("Failed to save");
    else { toast.success("Title saved"); setTitleDirty(false); await fetchArticle(); }
    setSavingTitle(false);
  };

  const saveSummary = async () => {
    if (!article) return;
    setSavingSummary(true);
    const { error } = await supabase.from("news_articles" as any).update({ summary: editSummary.trim() } as any).eq("id", (article as any).id);
    if (error) toast.error("Failed to save");
    else { toast.success("Summary saved"); setSummaryDirty(false); await fetchArticle(); }
    setSavingSummary(false);
  };

  const saveTags = async () => {
    if (!article) return;
    setSavingTags(true);
    const { error } = await supabase.from("news_articles" as any).update({ tags: editTags } as any).eq("id", (article as any).id);
    if (error) toast.error("Failed to save");
    else { toast.success("Tags saved"); setTagsDirty(false); await fetchArticle(); }
    setSavingTags(false);
  };

  const handlePublish = async () => {
    if (!article) return;
    setPublishing(true);
    const now = new Date().toISOString();

    const { data: contentData } = await supabase
      .from("news_article_content" as any)
      .select("*")
      .eq("article_id", (article as any).id)
      .order("sort_order");

    const snapshot = {
      title: (article as any).title,
      summary: (article as any).summary,
      tags: (article as any).tags,
      image_url: (article as any).image_url,
      content: contentData || [],
    };

    const { error } = await supabase.from("news_articles" as any).update({
      published_at: now,
      published_data: snapshot,
      status: "Published",
      updated_at: now,
    } as any).eq("id", (article as any).id);

    if (error) toast.error("Failed to publish");
    else {
      toast.success("Article published!");
      await fetchArticle();

      supabase.functions.invoke("commit-to-gitlab", {
        body: {
          projectId: (article as any).id,
          projectTitle: (article as any).title,
          snapshot,
          entityType: "articles",
        },
      }).then(({ error: gitErr }) => {
        if (gitErr) console.error("GitLab commit failed:", gitErr);
        else toast.success("Revision committed to GitLab");
      });
    }
    setPublishing(false);
  };

  const handleDoneEditing = async () => {
    toast.success("Draft saved");
    navigate(`/news/db-${(article as any).id}`);
  };

  const handleDelete = async () => {
    if (!article) return;
    setDeleting(true);
    await supabase.from("news_article_content" as any).delete().eq("article_id", (article as any).id);
    const { error } = await supabase.from("news_articles" as any).delete().eq("id", (article as any).id);
    if (error) { toast.error("Failed to delete"); setDeleting(false); return; }
    toast.success("Article deleted");
    navigate("/news");
  };

  const toggleTag = (tag: string) => {
    setEditTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
    setTagsDirty(true);
  };

  if (loading) return <Layout><div className="py-32 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div></Layout>;
  if (!article) return <Layout><div className="py-32 text-center"><h1 className="text-2xl font-display font-bold">Article not found</h1></div></Layout>;
  if (!isOwner) return <Layout><div className="py-32 text-center"><h1 className="text-2xl font-display font-bold">Access denied</h1></div></Layout>;

  return (
    <Layout>
      <article className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Top bar — matches project editor */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="flex items-center gap-2">
              {/* Status indicators */}
              {hasUnsavedChanges && (
                <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] gap-1">
                  <CircleDot className="h-3 w-3" /> Unsaved changes
                </Badge>
              )}
              {hasUnpublishedChanges && !hasUnsavedChanges && (
                <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] gap-1">
                  <AlertCircle className="h-3 w-3" /> Unpublished
                </Badge>
              )}
              <Badge variant="outline">{(article as any).status}</Badge>

              {/* Publish button */}
              {hasUnpublishedChanges && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-primary/40 text-primary hover:bg-primary/10"
                  onClick={handlePublish}
                  disabled={publishing || hasUnsavedChanges}
                >
                  <Globe className="h-3.5 w-3.5 mr-1.5" />
                  {publishing ? "Publishing..." : "Publish Changes"}
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                className="rounded-full"
                onClick={handleDoneEditing}
              >
                <Settings className="h-4 w-4 mr-1.5" />
                Done Editing
              </Button>
            </div>
          </motion.div>

          {/* Inline title editing — matches project editor style */}
          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => { setEditTitle(e.target.value); setTitleDirty(true); }}
                className="flex-1 text-3xl md:text-4xl font-display font-bold bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none py-1"
                placeholder="Article title..."
              />
              <Button size="sm" variant="outline" className="rounded-full h-8 shrink-0" onClick={saveTitle} disabled={savingTitle || !titleDirty}>
                <Save className="h-3.5 w-3.5 mr-1" /> {savingTitle ? "Saving..." : "Save"}
              </Button>
            </div>

            {/* Summary with save button */}
            <div className="flex items-start gap-2 mb-4">
              <Textarea
                value={editSummary}
                onChange={(e) => { setEditSummary(e.target.value); setSummaryDirty(true); }}
                rows={2}
                className="flex-1 text-lg leading-relaxed"
                placeholder="Brief summary..."
              />
              <Button size="sm" variant="outline" className="rounded-full h-8 shrink-0 mt-1" onClick={saveSummary} disabled={savingSummary || !summaryDirty}>
                <Save className="h-3.5 w-3.5 mr-1" /> {savingSummary ? "Saving..." : "Save"}
              </Button>
            </div>
          </motion.header>

          {/* Tags inline with save */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
            <div className="flex items-start gap-2">
              <div className="flex flex-wrap gap-1.5 flex-1">
                {allNewsTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all font-medium ${editTags.includes(tag) ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60 text-muted-foreground hover:border-primary/50"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {tagsDirty && (
                <Button size="sm" variant="outline" className="rounded-full h-8 shrink-0" onClick={saveTags} disabled={savingTags}>
                  <Save className="h-3.5 w-3.5 mr-1" /> {savingTags ? "Saving..." : "Save"}
                </Button>
              )}
            </div>
          </motion.div>

          {/* Content Editor — inline sections with per-section save */}
          <div className="mb-10">
            <ArticleContentManager articleId={(article as any).id} onSave={() => fetchArticle()} />
          </div>

          {/* Version History */}
          <div className="mb-10">
            <ArticleVersionHistory
              articleId={(article as any).id}
              articleTitle={(article as any).title}
              onRollback={() => { fetchArticle(); }}
            />
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border-2 border-destructive/30 p-6">
            <h3 className="text-lg font-display font-bold text-destructive mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">Permanently delete this article and all its content.</p>
            <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)} disabled={deleting}>
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Article
            </Button>
          </div>

          <DragToDeleteDialog
            open={showDelete}
            onOpenChange={setShowDelete}
            onConfirm={handleDelete}
            title="Delete Article"
            description="This action cannot be undone. The article and all its content will be permanently deleted."
            deleting={deleting}
          />
        </div>
      </article>
    </Layout>
  );
};

export default ArticleEdit;
