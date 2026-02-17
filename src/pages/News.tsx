import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { newsArticles, allNewsTags, type NewsTag } from "@/data/newsData";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 9;

const tagCategories = [
  { label: "Special", tags: ["Conferences", "Design Competitions"] as NewsTag[] },
  {
    label: "Technologies",
    tags: [
      "ARM Cortex-M0", "ARM Cortex-M3", "ARM Cortex-A53", "RISC-V",
      "FPGA", "ASIC", "Open Source EDA", "SystemVerilog", "Chisel/FIRRTL",
    ] as NewsTag[],
  },
  {
    label: "Interests",
    tags: [
      "Machine Learning", "Cryptography & Security", "DSP & Signal Processing",
      "Low-Power Design", "IoT & Edge Computing", "Neuromorphic Computing",
      "Formal Verification", "High-Level Synthesis",
    ] as NewsTag[],
  },
];

const News = () => {
  const [selectedTags, setSelectedTags] = useState<NewsTag[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const toggleTag = (tag: NewsTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const sorted = [...newsArticles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filtered =
    selectedTags.length === 0
      ? sorted
      : sorted.filter((a) => a.tags.some((t) => selectedTags.includes(t)));

  const visible = filtered.slice(0, visibleCount);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero mesh-dots py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              <span className="text-gradient">News</span> &amp; Updates
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
              The latest from the SoC Labs community — research milestones, events, competitions, and more.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/news/submit">
                <PenLine className="mr-2 h-4 w-4" /> Submit an Article
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Tag Filters */}
          <ScrollReveal className="mb-10">
            <div className="space-y-4">
              {tagCategories.map((cat) => (
                <div key={cat.label}>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-3">
                    {cat.label}
                  </span>
                  <div className="inline-flex flex-wrap gap-2 mt-1">
                    {cat.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "text-xs px-3 py-1.5 rounded-full border transition-all font-medium",
                          selectedTags.includes(tag)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </ScrollReveal>

          {/* Articles Grid */}
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No articles match the selected filters.</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visible.map((article, i) => (
                  <ScrollReveal key={article.id} delay={i * 0.06}>
                    <Link to={`/news/${article.id}`} className="block h-full">
                      <Card className="h-full hover:shadow-xl hover:shadow-electric/5 hover:-translate-y-1 transition-all duration-300 border-border/60 hover:border-electric/30">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {article.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-[10px]">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="text-lg font-display font-bold mb-2 line-clamp-2">{article.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{article.summary}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" /> {article.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />{" "}
                              {new Date(article.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              {visibleCount < filtered.length && (
                <div className="text-center mt-10">
                  <Button variant="outline" className="rounded-full px-8" onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}>
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default News;
