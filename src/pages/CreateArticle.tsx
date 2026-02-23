import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, PenLine, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { supabase } from "@/integrations/supabase/client";
import { allNewsTags } from "@/data/newsData";
import { toast } from "sonner";

const STEPS = ["Article Details", "Tags", "Review"];

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
};

const CreateArticle = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasRole, loading: rolesLoading } = useUserRoles();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const canWrite = hasRole("news_writer") || hasRole("admin");

  if (!authLoading && !user) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Sign in required</h1>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
      </Layout>
    );
  }

  if (!rolesLoading && !canWrite) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Permission Denied</h1>
          <p className="text-muted-foreground mb-4">You need the News Writer role to create articles.</p>
          <Button variant="outline" onClick={() => navigate("/news")}>Back to News</Button>
        </div>
      </Layout>
    );
  }

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); };

  const toggleTag = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleCreate = async () => {
    if (!user || !title.trim()) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("news_articles" as any)
      .insert({ user_id: user.id, title: title.trim(), summary: summary.trim(), tags } as any)
      .select()
      .single();

    if (error) {
      toast.error("Failed to create article: " + error.message);
      setCreating(false);
      return;
    }
    toast.success("Article created!");
    navigate(`/news/edit/${(data as any).id}`);
  };

  const canProceed = step === 0 ? title.trim().length > 0 : true;

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <h1 className="text-3xl font-display font-bold mb-2">Create Article</h1>
          <p className="text-muted-foreground mb-8">Set up the basics, then use the inline editor to write your content.</p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-10">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                {i < STEPS.length - 1 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <Label>Title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title..." className="mt-1" />
                  </div>
                  <div>
                    <Label>Summary</Label>
                    <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary for the listing card..." rows={3} className="mt-1" />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {allNewsTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${tags.includes(tag) ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60 text-muted-foreground hover:border-primary/50"}`}
                      >
                        {tag}
                        {tags.includes(tag) && <X className="h-3 w-3 ml-1 inline" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
                  <h3 className="font-display font-bold text-lg">{title || "Untitled"}</h3>
                  {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground italic">You'll be taken to the inline editor after creation.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-10">
            <Button variant="outline" onClick={goBack} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={goNext} disabled={!canProceed}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleCreate} disabled={creating || !title.trim()}>
                <PenLine className="h-4 w-4 mr-1" /> {creating ? "Creating..." : "Create Article"}
              </Button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CreateArticle;
