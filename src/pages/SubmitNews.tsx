import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    const formData = new FormData(e.currentTarget);
    const title = (formData.get("title") as string).trim();

    let image_url: string | null = null;
    if (imageFile) {
      const path = `${user.id}/${Date.now()}-${imageFile.name}`;
      const { error: uploadErr } = await supabase.storage.from("news-images").upload(path, imageFile);
      if (uploadErr) {
        toast({ title: "Image upload failed", description: uploadErr.message, variant: "destructive" });
        setCreating(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("news-images").getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("news_articles" as any)
      .insert({ user_id: user.id, title, summary: ((formData.get("summary") as string) || "").trim(), tags: selectedTags, image_url } as any)
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
                <Label htmlFor="summary">Summary <span className="text-muted-foreground font-normal text-xs">(shown on article card)</span></Label>
                <Input id="summary" name="summary" placeholder="A brief summary for the news listing..." />
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                {imagePreview ? (
                  <div className="relative group overflow-hidden rounded-lg">
                    <img src={imagePreview} alt="Cover preview" className="w-full object-contain max-h-[28rem] border border-border/60 rounded-lg" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-background/80 backdrop-blur rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-12 rounded-lg border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                    <ImagePlus className="h-8 w-8" />
                    <span className="text-sm font-medium">Click to upload cover image</span>
                  </button>
                )}
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
