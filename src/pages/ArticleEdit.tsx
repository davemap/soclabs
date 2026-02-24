import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Globe, Loader2, Trash2, AlertCircle, History as HistoryIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  const [savingMeta, setSavingMeta] = useState(false);
  const [metaDirty, setMetaDirty] = useState(false);

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    const { data } = await supabase.from("news_articles" as any).select("*").eq("id", id).single();
    if (data) {
      setArticle(data);
      setEditTitle((data as any).title);
      setEditSummary((data as any).summary || "");
      setEditTags((data as any).tags || []);
      setMetaDirty(false);
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

  const saveMeta = async () => {
    if (!article) return;
    setSavingMeta(true);
    const { error } = await supabase.from("news_articles" as any).update({
      title: editTitle.trim(),
      summary: editSummary.trim(),
      tags: editTags,
    } as any).eq("id", (article as any).id);
    if (error) toast.error("Failed to save");
    else { toast.success("Details saved"); setMetaDirty(false); await fetchArticle(); }
    setSavingMeta(false);
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
    // Save meta if dirty
    if (metaDirty) {
      await saveMeta();
    }
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
    setMetaDirty(true);
  };

  if (loading) return <Layout><div className="py-32 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div></Layout>;
  if (!article) return <Layout><div className="py-32 text-center"><h1 className="text-2xl font-display font-bold">Article not found</h1></div></Layout>;
  if (!isOwner) return <Layout><div className="py-32 text-center"><h1 className="text-2xl font-display font-bold">Access denied</h1></div></Layout>;

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{(article as any).status}</Badge>
              {hasUnpublishedChanges && (
                <Badge variant="outline" className="border-amber-500/40 text-amber-600">
                  <AlertCircle className="h-3 w-3 mr-1" /> Unpublished changes
                </Badge>
              )}
            </div>
          </div>

          {/* Inline title editing */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Input
              value={editTitle}
              onChange={(e) => { setEditTitle(e.target.value); setMetaDirty(true); }}
              className="text-3xl md:text-4xl font-display font-bold border-none bg-transparent px-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/40"
              placeholder="Article title..."
            />
            <Textarea
              value={editSummary}
              onChange={(e) => { setEditSummary(e.target.value); setMetaDirty(true); }}
              className="mt-2 border-none bg-transparent px-0 text-muted-foreground resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/40"
              placeholder="Brief summary..."
              rows={2}
            />
          </motion.div>

          {/* Tags inline */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
            <div className="flex flex-wrap gap-1.5">
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
          </motion.div>

          {/* Save meta if dirty */}
          {metaDirty && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6">
              <Button variant="outline" size="sm" onClick={saveMeta} disabled={savingMeta}>
                <Save className="h-3.5 w-3.5 mr-1" /> {savingMeta ? "Saving..." : "Save Details"}
              </Button>
            </motion.div>
          )}

          {/* Content Editor — inline sections with per-section save */}
          <div className="mb-10">
            <ArticleContentManager articleId={(article as any).id} onSave={() => fetchArticle()} />
          </div>

          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-3 mb-10 p-4 rounded-xl border border-border/60 bg-card">
            <Button onClick={handleDoneEditing} variant="outline" className="rounded-full">
              <CheckCircle2 className="h-4 w-4 mr-1.5" /> Done Editing
            </Button>
            <Button onClick={handlePublish} disabled={publishing} className="rounded-full">
              {publishing ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Globe className="h-4 w-4 mr-1.5" />}
              Publish
            </Button>
            {(article as any).status === "Published" && (
              <Button variant="outline" size="sm" asChild className="rounded-full ml-auto">
                <Link to={`/news/db-${(article as any).id}`}>
                  <Globe className="h-3.5 w-3.5 mr-1" /> View Published
                </Link>
              </Button>
            )}
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
      </section>
    </Layout>
  );
};

export default ArticleEdit;
