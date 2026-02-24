import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { allNewsTags, type NewsTag } from "@/data/newsData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const SubmitNews = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [selectedTags, setSelectedTags] = useState<NewsTag[]>([]);
  const [creating, setCreating] = useState(false);

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

  const toggleTag = (tag: NewsTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    const formData = new FormData(e.currentTarget);
    const title = (formData.get("title") as string).trim();
    const summary = (formData.get("summary") as string).trim();

    const { data, error } = await supabase
      .from("news_articles" as any)
      .insert({ user_id: user.id, title, summary, tags: selectedTags } as any)
      .select()
      .single();

    if (error) {
      toast({ title: "Failed to create draft", description: error.message, variant: "destructive" });
      setCreating(false);
      return;
    }
    toast({ title: "Draft created!" });
    navigate(`/news/edit/${(data as any).id}`);
  };

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Button variant="ghost" size="sm" className="mb-8 -ml-2 rounded-full" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>

            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Create a Draft Article</h1>
            <p className="text-muted-foreground mb-10">
              Set up the basics for your article. You'll be able to write the full content in the editor.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input id="title" name="title" placeholder="e.g. Our Accelerator Tapes Out on 28nm" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" name="summary" placeholder="A brief 1-2 sentence summary of the article…" rows={3} required />
              </div>

              <div className="space-y-3">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {allNewsTags.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all select-none hover:border-primary/40"
                      style={{
                        background: selectedTags.includes(tag) ? "hsl(var(--primary))" : undefined,
                        color: selectedTags.includes(tag) ? "hsl(var(--primary-foreground))" : undefined,
                        borderColor: selectedTags.includes(tag) ? "hsl(var(--primary))" : undefined,
                      }}
                    >
                      <Checkbox
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                        className="sr-only"
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" size="lg" className="rounded-full px-8 w-full md:w-auto" disabled={creating}>
                <Send className="mr-2 h-4 w-4" /> {creating ? "Creating…" : "Create Draft"}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default SubmitNews;
