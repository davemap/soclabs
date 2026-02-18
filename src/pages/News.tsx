import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, PenLine, Filter, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { newsArticles, allNewsTags, type NewsTag, newsImages } from "@/data/newsData";
import { cn } from "@/lib/utils";

// Import images
import imgFpgaWorkshop from "@/assets/news/fpga-workshop.jpg";
import imgAsicTapeout from "@/assets/news/asic-tapeout.jpg";
import imgDesignComp from "@/assets/news/design-competition.jpg";
import imgRiscvSummit from "@/assets/news/riscv-summit.jpg";
import imgMlAccel from "@/assets/news/ml-accelerator.jpg";
import imgOpenEda from "@/assets/news/open-eda.jpg";
import imgDvfs from "@/assets/news/dvfs-power.jpg";

const articleImages: Record<string, string> = {
  "nanosoc-fpga-workshop-2026": imgFpgaWorkshop,
  "ecosoc-tapeout-tsmc-28nm": imgAsicTapeout,
  "design-competition-2026": imgDesignComp,
  "risc-v-summit-talk": imgRiscvSummit,
  "ml-accelerator-tinyml-benchmark": imgMlAccel,
  "open-eda-flow-yosys": imgOpenEda,
  "dvfs-controller-results": imgDvfs,
};

const ITEMS_PER_PAGE = 9;

const tagCategories = [
  { label: "Special", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30", activeColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent", tags: ["Conferences", "Design Competitions"] as NewsTag[] },
  {
    label: "Technologies", color: "from-primary/20 to-electric/20 border-primary/30", activeColor: "bg-gradient-to-r from-primary to-electric text-white border-transparent",
    tags: [
      "ARM Cortex-M0", "ARM Cortex-M3", "ARM Cortex-A53", "RISC-V",
      "FPGA", "ASIC", "Open Source EDA", "SystemVerilog", "Chisel/FIRRTL",
    ] as NewsTag[],
  },
  {
    label: "Interests", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30", activeColor: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent",
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      <section className="bg-gradient-hero mesh-dots py-14 md:py-20">
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
      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Filter toggle */}
          <ScrollReveal className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant={filtersOpen ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                Filters
                {selectedTags.length > 0 && (
                  <span className="ml-1.5 bg-primary-foreground/20 text-[10px] rounded-full px-1.5 py-0.5 font-bold">
                    {selectedTags.length}
                  </span>
                )}
              </Button>

              {selectedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-medium"
                >
                  {tag}
                  <X className="h-3 w-3" />
                </button>
              ))}

              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </ScrollReveal>

          {/* Collapsible filter panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-8"
              >
                <div className="rounded-xl border border-border/60 bg-card/50 p-5 space-y-4">
                  {tagCategories.map((cat) => (
                    <div key={cat.label}>
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        {cat.label}
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {cat.tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={cn(
                              "text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium",
                              selectedTags.includes(tag)
                                ? cat.activeColor
                                : `bg-gradient-to-r ${cat.color} hover:brightness-110`
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Articles Grid */}
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No articles match the selected filters.</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visible.map((article, i) => (
                  <ScrollReveal key={article.id} delay={i * 0.06}>
                    <Link to={`/news/${article.id}`} className="block h-full">
                      <Card className="h-full hover:shadow-xl hover:shadow-electric/5 hover:-translate-y-1 transition-all duration-300 border-border/60 hover:border-electric/30 overflow-hidden">
                        {/* Article image */}
                        <div className="relative h-40 overflow-hidden bg-muted">
                          <img
                            src={articleImages[article.id] || "/placeholder.svg"}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                        </div>
                        <CardContent className="p-5 flex flex-col flex-1">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {article.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-[10px]">
                                {tag}
                              </Badge>
                            ))}
                            {article.tags.length > 3 && (
                              <Badge variant="outline" className="text-[10px]">+{article.tags.length - 3}</Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-display font-bold mb-2 line-clamp-2">{article.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{article.summary}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                            <span className="flex items-center gap-1.5">
                              <Avatar className="h-4 w-4 text-[7px]">
                                <AvatarFallback>{article.author.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              {article.author}
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
