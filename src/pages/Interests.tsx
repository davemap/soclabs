import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles, Search, FlaskConical, Plus, Send, X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { interests as allInterests, Interest } from "@/data/interests";
import { toast } from "sonner";

// Filter to Research Fields only
const interests = allInterests.filter((i) => i.category === "Research Fields");

const categoryColors: Record<string, {card: string; border: string; badge: string; glow: string; icon: string;}> = {
  "Research Fields": {
    card: "hover:border-coral/40",
    border: "border-coral/30 bg-coral/5",
    badge: "bg-coral/10 text-coral",
    glow: "shadow-coral/10",
    icon: "text-coral"
  },
};

const InterestCard = ({
  interest,
  isSelected,
  onToggle
}: {interest: Interest; isSelected: boolean; onToggle: () => void;}) => {
  const colors = categoryColors[interest.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}>
      <Link
        to={`/research/${interest.slug}`}
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
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 hover:border-primary/50"
              )}>
              {isSelected && <Check className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{interest.description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(15);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalName, setProposalName] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");

  const toggleInterest = (name: string) => {
    setSelectedInterests((prev) => prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]);
  };

  const filteredInterests = useMemo(() => {
    return interests.filter((i) => {
      const matchesSearch =
        !search ||
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [search]);

  const handlePropose = () => {
    if (!proposalName.trim()) return;
    toast.success("Research field proposed!", { description: `"${proposalName}" has been submitted for review.` });
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
              Research <span className="text-gradient">Fields</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Explore research fields across the SoC Labs community. Select areas of interest
              to connect with like-minded people and projects.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex justify-center gap-8 md:gap-12 mb-12">
            <div className="text-center">
              <div className={cn("w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center", categoryColors["Research Fields"].badge)}>
                <FlaskConical className={cn("h-5 w-5", categoryColors["Research Fields"].icon)} />
              </div>
              <p className="text-2xl font-display font-bold">{interests.length}</p>
              <p className="text-xs text-muted-foreground">Research Fields</p>
            </div>
          </motion.div>

          {/* Search bar */}
          <ScrollReveal className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search research fields..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/60 bg-card text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Grid + sidebar */}
      <section className="py-6 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex gap-8">
            {/* Main grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredInterests.length}</span> research fields
                </p>
                {selectedCount > 0 && (
                  <motion.p
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-medium text-primary">
                    {selectedCount} selected
                  </motion.p>
                )}
              </div>

              <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredInterests.slice(0, visibleCount).map((interest) => (
                    <InterestCard
                      key={interest.slug}
                      interest={interest}
                      isSelected={selectedInterests.includes(interest.name)}
                      onToggle={() => toggleInterest(interest.name)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {visibleCount < filteredInterests.length && (
                <div className="text-center mt-8">
                  <Button variant="outline" className="rounded-full px-8" onClick={() => setVisibleCount((v) => v + 15)}>
                    Show more ({filteredInterests.length - visibleCount} remaining)
                  </Button>
                </div>
              )}

              {filteredInterests.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No research fields match your search.</p>
                </div>
              )}
            </div>

            {/* Sticky sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-4">
                {/* Propose new research field */}
                <div className="rounded-xl border border-border/60 bg-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-sm">Propose a Research Field</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Can't find what you're looking for? Suggest a new research field for the community.
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
                          placeholder="Research field name"
                          value={proposalName}
                          onChange={(e) => setProposalName(e.target.value)}
                          className="text-sm h-9"
                        />
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
                        <Plus className="h-3.5 w-3.5 mr-1.5" /> Propose New Field
                      </Button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Selected summary */}
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
            {selectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                <div className="flex items-center gap-4 px-6 py-3 rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-xl shadow-xl shadow-primary/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {selectedCount} field{selectedCount !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <Button asChild size="sm" className="rounded-full px-5">
                    <Link to="/about#join">
                      Register <ArrowRight className="ml-1.5 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default Interests;
