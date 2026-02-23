import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Globe, Pencil, Loader2, Trash2, X, Tag, AlertCircle, History as HistoryIcon } from "lucide-react";
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
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

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

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    const { data } = await supabase.from("news_articles" as any).select("*").eq("id", id).single();
    if (data) {
      setArticle(data);
      setEditTitle((data as any).title);
      setEditSummary((data as any).summary || "");
      setEditTags((data as any).tags || []);
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
    else { toast.success("Details updated"); await fetchArticle(); }
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

      // Commit to GitLab in the background
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
  };

  if (loading) return <Layout><div className="py-32 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div></Layout>;
  if (!article) return <Layout><div className="py-32 text-center"><h1 className="text-2xl font-display font-bold">Article not found</h1></div></Layout>;
  if (!isOwner) return <Layout><div className="py-32 text-center"><h1 className="text-2xl font-display font-bold">Access denied</h1></div></Layout>;

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          {/* Status bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{(article as any).status}</Badge>
              {hasUnpublishedChanges && (
                <Badge variant="outline" className="border-amber-500/40 text-amber-600">
                  <AlertCircle className="h-3 w-3 mr-1" /> Unpublished changes
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {(article as any).status === "Published" && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/news/db-${(article as any).id}`}>
                    <Globe className="h-3.5 w-3.5 mr-1" /> View Published
                  </Link>
                </Button>
              )}
              <Button size="sm" onClick={handlePublish} disabled={publishing}>
                {publishing ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Globe className="h-3.5 w-3.5 mr-1" />}
                Publish
              </Button>
            </div>
          </div>

          {/* Editable metadata */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 mb-10">
            <div>
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="text-xl font-display font-bold" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Summary</Label>
              <Textarea value={editSummary} onChange={(e) => setEditSummary(e.target.value)} rows={2} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Tags</Label>
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
            </div>
            <Button variant="outline" size="sm" onClick={saveMeta} disabled={savingMeta}>
              <Save className="h-3.5 w-3.5 mr-1" /> {savingMeta ? "Saving..." : "Save Details"}
            </Button>
          </motion.div>

          {/* Content Editor */}
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
      </section>
    </Layout>
  );
};

export default ArticleEdit;
