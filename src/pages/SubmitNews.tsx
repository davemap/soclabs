import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const SubmitNews = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = useState<NewsTag[]>([]);

  const toggleTag = (tag: NewsTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Article Submitted",
      description: "Thank you! Your article will be reviewed by the SoC Labs team.",
    });
  };

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Button variant="ghost" size="sm" className="mb-8 -ml-2 rounded-full" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>

            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Submit a News Article</h1>
            <p className="text-muted-foreground mb-10">
              Share your research updates, event announcements, or community milestones with the SoC Labs community.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input id="title" placeholder="e.g. Our Accelerator Tapes Out on 28nm" required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Your Name</Label>
                  <Input id="author" placeholder="Dr. Jane Smith" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input id="institution" placeholder="University of Example" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" placeholder="A brief 1-2 sentence summary of the article…" rows={3} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Article Content (Markdown supported)</Label>
                <Textarea id="content" placeholder="## Introduction&#10;&#10;Write your article here using Markdown…" rows={12} required />
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

              <Button type="submit" size="lg" className="rounded-full px-8 w-full md:w-auto">
                <Send className="mr-2 h-4 w-4" /> Submit Article
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default SubmitNews;
