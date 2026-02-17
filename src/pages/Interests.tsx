import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles, Search, Cpu, FlaskConical, Users, Plus, Send, X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { interests, Interest } from "@/data/interests";
import { toast } from "sonner";

const categories = [
{
  key: "Technologies" as const,
  label: "Technologies",
  icon: Cpu,
  count: interests.filter((i) => i.category === "Technologies").length
},
{
  key: "Research Fields" as const,
  label: "Research Fields",
  icon: FlaskConical,
  count: interests.filter((i) => i.category === "Research Fields").length
},
{
  key: "Activities" as const,
  label: "Activities",
  icon: Users,
  count: interests.filter((i) => i.category === "Activities").length
}];


const categoryColors: Record<string, {card: string;border: string;badge: string;glow: string;icon: string;}> = {
  Technologies: {
    card: "hover:border-primary/40",
    border: "border-primary/30 bg-primary/5",
    badge: "bg-primary/10 text-primary",
    glow: "shadow-primary/10",
    icon: "text-primary"
  },
  "Research Fields": {
    card: "hover:border-coral/40",
    border: "border-coral/30 bg-coral/5",
    badge: "bg-coral/10 text-coral",
    glow: "shadow-coral/10",
    icon: "text-coral"
  },
  Activities: {
    card: "hover:border-violet/40",
    border: "border-violet/30 bg-violet/5",
    badge: "bg-violet/10 text-violet",
    glow: "shadow-violet/10",
    icon: "text-violet"
  }
};

const InterestCard = ({
  interest,
  isSelected,
  onToggle




}: {interest: Interest;isSelected: boolean;onToggle: () => void;}) => {
  const colors = categoryColors[interest.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}>

      <Link
        to={`/interests/${interest.slug}`}
        className={cn(
          "group relative block rounded-xl border bg-card transition-all duration-300",
          isSelected ? `${colors.border} shadow-md ${colors.glow}` : `border-border/50 ${colors.card}`
        )}>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <span className={cn("text-[10px] font-semibold uppercase tracking-wider", colors.icon)}>
                {interest.category}
              </span>
              <h3 className="font-display font-bold text-base mt-1 group-hover:text-primary transition-colors">
                {interest.name}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }}
              className={cn(
                "w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                isSelected ?
                "border-primary bg-primary text-primary-foreground" :
                "border-border/60 hover:border-primary/50"
              )}>

              {isSelected && <Check className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{interest.description}</p>
        </div>
      </Link>
    </motion.div>);

};

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(15);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalName, setProposalName] = useState("");
  const [proposalCategory, setProposalCategory] = useState<string>("Technologies");
  const [proposalDescription, setProposalDescription] = useState("");

  const toggleInterest = (name: string) => {
    setSelectedInterests((prev) => prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]);
  };

  const filteredInterests = useMemo(() => {
    return interests.filter((i) => {
      const matchesCategory = !activeCategory || i.category === activeCategory;
      const matchesSearch =
      !search ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const handlePropose = () => {
    if (!proposalName.trim()) return;
    toast.success("Interest proposed!", { description: `"${proposalName}" has been submitted for review.` });
    setProposalName("");
    setProposalDescription("");
    setProposalOpen(false);
  };

  const selectedCount = selectedInterests.length;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 mesh-dots opacity-40" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-12">

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              What interests
              <span className="text-gradient"> you</span>?
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Explore technologies, research fields, and activities across the SoC Labs community. Select your interests
              to connect with like-minded people and projects.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex justify-center gap-8 md:gap-12 mb-12">

            {categories.map((cat) => {
              const Icon = cat.icon;
              const colors = categoryColors[cat.key];
              return (
                <div key={cat.key} className="text-center">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center",
                      categoryColors[cat.key].badge
                    )}>

                    <Icon className={cn("h-5 w-5", colors.icon)} />
                  </div>
                  <p className="text-2xl font-display font-bold">{cat.count}</p>
                  <p className="text-xs text-muted-foreground">{cat.label}</p>
                </div>);

            })}
          </motion.div>

          {/* Search & Filter bar */}
          <ScrollReveal className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search interests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/60 bg-card text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all" />

              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                    !activeCategory ?
                    "bg-foreground text-background border-foreground" :
                    "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                  )}>

                  All
                </button>
                {categories.map((cat) => {
                  const colors = categoryColors[cat.key];
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                        activeCategory === cat.key ?
                        `${colors.border} font-semibold` :
                        "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                      )}>

                      <span className="hidden sm:inline">{cat.label}</span>
                      <span className="sm:hidden">{cat.label.split(" ")[0]}</span>
                    </button>);

                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Interest grid + sidebar */}
      <section className="py-6 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex gap-8">
            {/* Main grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredInterests.length}</span> interests
                </p>
                {selectedCount > 0 &&
                  <motion.p
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-medium text-primary">
                    {selectedCount} selected
                  </motion.p>
                }
              </div>

              <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredInterests.slice(0, visibleCount).map((interest) =>
                    <InterestCard
                      key={interest.slug}
                      interest={interest}
                      isSelected={selectedInterests.includes(interest.name)}
                      onToggle={() => toggleInterest(interest.name)} />
                  )}
                </AnimatePresence>
              </motion.div>

              {visibleCount < filteredInterests.length &&
                <div className="text-center mt-8">
                  <Button variant="outline" className="rounded-full px-8" onClick={() => setVisibleCount((v) => v + 15)}>
                    Show more ({filteredInterests.length - visibleCount} remaining)
                  </Button>
                </div>
              }

              {filteredInterests.length === 0 &&
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No interests match your search.</p>
                </div>
              }
            </div>

            {/* Sticky sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-4">
                {/* Propose new interest card */}
                <div className="rounded-xl border border-border/60 bg-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-sm">Propose an Interest</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Can't find what you're looking for? Suggest a new interest area for the community.
                  </p>

                  <AnimatePresence>
                    {proposalOpen ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden space-y-3"
                      >
                        <Input
                          placeholder="Interest name"
                          value={proposalName}
                          onChange={(e) => setProposalName(e.target.value)}
                          className="text-sm h-9"
                        />
                        <div className="flex gap-1.5 flex-wrap">
                          {["Technologies", "Research Fields", "Activities"].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setProposalCategory(cat)}
                              className={cn(
                                "text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all",
                                proposalCategory === cat
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border/60 text-muted-foreground hover:border-primary/40"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        <textarea
                          placeholder="Brief description (optional)"
                          value={proposalDescription}
                          onChange={(e) => setProposalDescription(e.target.value)}
                          className="w-full text-sm rounded-lg border border-border/60 bg-background p-2.5 h-20 resize-none placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 rounded-full text-xs" onClick={handlePropose} disabled={!proposalName.trim()}>
                            <Send className="h-3 w-3 mr-1.5" /> Submit
                          </Button>
                          <Button size="sm" variant="ghost" className="rounded-full text-xs" onClick={() => setProposalOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-full text-xs"
                        onClick={() => setProposalOpen(true)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" /> Propose New Interest
                      </Button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Selected interests summary */}
                {selectedCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-primary/20 bg-primary/5 p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display font-bold text-sm">Your Interests</h3>
                      <span className="text-xs text-primary font-semibold">{selectedCount}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {selectedInterests.map((name) => (
                        <button
                          key={name}
                          onClick={() => toggleInterest(name)}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                        >
                          {name}
                          <X className="h-2.5 w-2.5" />
                        </button>
                      ))}
                    </div>
                    <Button asChild size="sm" className="w-full rounded-full text-xs">
                      <Link to="/about#join">
                        Register <ArrowRight className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </aside>
          </div>

          {/* Floating CTA */}
          <AnimatePresence>
            {selectedCount > 0 &&
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">

                <div className="flex items-center gap-4 px-6 py-3 rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-xl shadow-xl shadow-primary/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {selectedCount} interest{selectedCount !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <Button asChild size="sm" className="rounded-full px-5">
                    <Link to="/about#join">
                      Register <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </section>
    </Layout>);

};

export default Interests;