import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ArrowRight, Sparkles, Search, FlaskConical, Plus, Send, X, Lightbulb,
  ChevronDown, Brain, Shield, Wrench, Cpu, Radio, Zap, CheckCircle, Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { interests as allInterests, Interest } from "@/data/interests";
import { toast } from "sonner";

// Filter to Research Fields only
const interests = allInterests.filter((i) => i.category === "Research Fields");

// Groups definition
const groups = [
  { key: "AI & Computing", label: "AI & Computing", icon: Brain, description: "Machine learning, neuromorphic, and synthesis research" },
  { key: "Security & Communications", label: "Security & Communications", icon: Shield, description: "Cryptography, DSP, and signal processing" },
  { key: "Design Methodology", label: "Design Methodology", icon: Wrench, description: "Low-power, verification, and systems research" },
];

const subcategoryIconMap: Record<string, React.ElementType> = {
  "Hardware AI": Brain,
  "Synthesis": Code,
  "Security": Shield,
  "Signal Processing": Radio,
  "Power": Zap,
  "Systems": Cpu,
  "Verification": CheckCircle,
};

const groupColors: Record<string, string> = {
  "AI & Computing": "border-primary/30",
  "Security & Communications": "border-violet/30",
  "Design Methodology": "border-coral/30",
};

const subcategoryColors: Record<string, string> = {
  "Hardware AI": "bg-primary/10 text-primary",
  "Synthesis": "bg-violet/10 text-violet",
  "Security": "bg-violet/10 text-violet",
  "Signal Processing": "bg-coral/10 text-coral",
  "Power": "bg-amber/10 text-amber",
  "Systems": "bg-emerald-500/10 text-emerald-500",
  "Verification": "bg-sky-500/10 text-sky-500",
};

function getSubcategories(groupKey: string) {
  const items = interests.filter((i) => i.group === groupKey);
  return [...new Set(items.map((i) => i.subcategory).filter(Boolean))] as string[];
}

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(groups.map((g) => g.key)));
  const [collapsedSubcats, setCollapsedSubcats] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<Record<string, string | null>>({});
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalName, setProposalName] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");

  const toggleInterest = (name: string) => {
    setSelectedInterests((prev) => prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]);
  };

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleSubcat = (key: string) => {
    setCollapsedSubcats((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

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
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Research <span className="text-gradient">Fields</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore research fields across the SoC Labs community. Select areas of interest to connect with like-minded people and projects.
            </p>
          </motion.div>

          {/* Search bar + collapse toggle */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search research fields..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    if (e.target.value) {
                      setCollapsedGroups(new Set());
                    }
                  }}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/60 bg-card text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-3 rounded-xl text-xs whitespace-nowrap"
                onClick={() => {
                  const allCollapsed = collapsedGroups.size === groups.length;
                  setCollapsedGroups(allCollapsed ? new Set() : new Set(groups.map((g) => g.key)));
                }}
              >
                <ChevronDown className={cn(
                  "h-4 w-4 mr-1.5 transition-transform",
                  collapsedGroups.size === groups.length && "-rotate-90"
                )} />
                {collapsedGroups.size === groups.length ? "Expand All" : "Collapse All"}
              </Button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto flex gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {groups.map((group, gi) => {
                const Icon = group.icon;
                const subcats = getSubcategories(group.key);
                const matchingCount = interests.filter(
                  (i) => i.group === group.key &&
                    (!search || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()))
                ).length;
                const isGroupCollapsed = search ? matchingCount === 0 : collapsedGroups.has(group.key);
                const totalCount = interests.filter((i) => i.group === group.key).length;

                return (
                  <motion.div
                    key={group.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.1 }}
                    className="mb-8"
                  >
                    <div className={cn("rounded-2xl border bg-card/50 overflow-hidden", groupColors[group.key])}>
                      {/* Group header */}
                      <button
                        onClick={() => toggleGroup(group.key)}
                        className="w-full flex items-center gap-3 p-6 md:p-8 text-left hover:bg-accent/30 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-2xl font-display font-bold">{group.label}</h2>
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground font-medium">{totalCount}</span>
                          <ChevronDown className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform duration-300",
                            isGroupCollapsed && "-rotate-90"
                          )} />
                        </div>
                      </button>

                      {/* Group content */}
                      <AnimatePresence initial={false}>
                        {!isGroupCollapsed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-6">
                              {/* Subcategory filter bar */}
                              {subcats.length > 1 && (() => {
                                const colorStyles: Record<string, { bar: string; active: string; inactive: string; label: string }> = {
                                  "AI & Computing": {
                                    bar: "border-primary/30 bg-gradient-to-r from-primary/5 via-card to-primary/5 shadow-primary/5",
                                    active: "bg-primary/20 border-primary text-primary scale-110 shadow-lg shadow-primary/25",
                                    inactive: "bg-card border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5",
                                    label: "text-primary",
                                  },
                                  "Security & Communications": {
                                    bar: "border-violet/30 bg-gradient-to-r from-violet/5 via-card to-violet/5 shadow-violet/5",
                                    active: "bg-violet/20 border-violet text-violet scale-110 shadow-lg shadow-violet/25",
                                    inactive: "bg-card border-border/50 text-muted-foreground hover:border-violet/50 hover:text-violet hover:bg-violet/5",
                                    label: "text-violet",
                                  },
                                  "Design Methodology": {
                                    bar: "border-coral/30 bg-gradient-to-r from-coral/5 via-card to-coral/5 shadow-coral/5",
                                    active: "bg-coral/20 border-coral text-coral scale-110 shadow-lg shadow-coral/25",
                                    inactive: "bg-card border-border/50 text-muted-foreground hover:border-coral/50 hover:text-coral hover:bg-coral/5",
                                    label: "text-coral",
                                  },
                                };
                                const colors = colorStyles[group.key] || colorStyles["AI & Computing"];
                                const activeSubcat = activeFilter[group.key] || null;

                                return (
                                  <div className="mb-2">
                                    <div className={cn("relative flex items-center justify-around rounded-2xl border-2 px-6 py-4 shadow-sm", colors.bar)}>
                                      {subcats.map((subcatName) => {
                                        const SubIcon = subcategoryIconMap[subcatName] || FlaskConical;
                                        const isActive = activeSubcat === subcatName;
                                        return (
                                          <button
                                            key={subcatName}
                                            onClick={() => setActiveFilter((prev) => ({
                                              ...prev,
                                              [group.key]: isActive ? null : subcatName,
                                            }))}
                                            className="relative z-10 flex flex-col items-center gap-1.5 group/phase"
                                            title={subcatName}
                                          >
                                            <div className={cn(
                                              "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 border-2",
                                              isActive ? colors.active : colors.inactive
                                            )}>
                                              <SubIcon className="h-4 w-4" />
                                            </div>
                                            <span className={cn(
                                              "text-[10px] font-display font-semibold transition-colors hidden sm:block",
                                              isActive ? colors.label : "text-muted-foreground/70"
                                            )}>
                                              {subcatName}
                                            </span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                    {activeSubcat && (
                                      <div className="flex items-center gap-2 mt-2 ml-1">
                                        <span className={cn("text-xs font-medium", colorStyles[group.key]?.label || "text-primary")}>Filtering: {activeSubcat}</span>
                                        <button
                                          onClick={() => setActiveFilter((prev) => ({ ...prev, [group.key]: null }))}
                                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                          (clear)
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                              {/* Subcategory sections */}
                              {subcats
                                .filter((subcat) => {
                                  const active = activeFilter[group.key];
                                  if (active) return subcat === active;
                                  return true;
                                })
                                .map((subcat) => {
                                  const subcatKey = `${group.key}::${subcat}`;
                                  const isSubcatCollapsed = collapsedSubcats.has(subcatKey);
                                  const itemsInSubcat = interests.filter(
                                    (i) => i.group === group.key && i.subcategory === subcat &&
                                      (!search || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()))
                                  );

                                  if (search && itemsInSubcat.length === 0) return null;

                                  return (
                                    <div key={subcat}>
                                      <button
                                        onClick={() => toggleSubcat(subcatKey)}
                                        className="flex items-center gap-2 mb-3 ml-1 group/sub w-full text-left"
                                      >
                                        <div className="w-1 h-5 rounded-full bg-primary/30" />
                                        <span className={cn(
                                          "text-xs px-3 py-1 rounded-full font-semibold",
                                          subcategoryColors[subcat] || "bg-muted text-muted-foreground"
                                        )}>
                                          {subcat}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground ml-0.5">
                                          {itemsInSubcat.length}
                                        </span>
                                        <ChevronDown className={cn(
                                          "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ml-auto",
                                          isSubcatCollapsed && "-rotate-90"
                                        )} />
                                      </button>

                                      <AnimatePresence initial={false}>
                                        {!isSubcatCollapsed && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                          >
                                            <div className="grid sm:grid-cols-2 gap-3 mb-4">
                                              {itemsInSubcat.map((interest) => {
                                                const isSelected = selectedInterests.includes(interest.name);
                                                return (
                                                  <Link
                                                    key={interest.slug}
                                                    to={`/research/${interest.slug}`}
                                                    className={cn(
                                                      "group relative block rounded-xl border bg-card transition-all duration-300",
                                                      isSelected
                                                        ? "border-primary/40 shadow-md shadow-primary/10 bg-primary/5"
                                                        : "border-border/50 hover:border-primary/30"
                                                    )}
                                                  >
                                                    <div className="p-4">
                                                      <div className="flex items-start justify-between gap-3 mb-2">
                                                        <h3 className="font-display font-bold text-sm group-hover:text-primary transition-colors">
                                                          {interest.name}
                                                        </h3>
                                                        <button
                                                          onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            toggleInterest(interest.name);
                                                          }}
                                                          className={cn(
                                                            "w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                                                            isSelected
                                                              ? "border-primary bg-primary text-primary-foreground"
                                                              : "border-border/60 hover:border-primary/50"
                                                          )}
                                                        >
                                                          {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 text-muted-foreground" />}
                                                        </button>
                                                      </div>
                                                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                                        {interest.description}
                                                      </p>
                                                    </div>
                                                  </Link>
                                                );
                                              })}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Sticky sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-4">
                {/* Register interest hint */}
                <div className="rounded-xl border border-primary/20 bg-card/95 backdrop-blur-xl shadow-lg shadow-primary/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="font-display font-bold text-sm">Register Interest</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Click on any section to expand it. Use the <Plus className="inline h-3 w-3 text-primary -mt-0.5" /> button on each card to register your interest.
                  </p>
                  {selectedCount > 0 && (
                    <div className="border-t border-border/40 pt-3 mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-primary">{selectedCount} selected</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {selectedInterests.slice(0, 5).map((name) => (
                          <button
                            key={name}
                            onClick={() => toggleInterest(name)}
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                          >
                            {name}
                            <X className="h-2 w-2" />
                          </button>
                        ))}
                        {selectedInterests.length > 5 && (
                          <span className="text-[10px] text-muted-foreground">+{selectedInterests.length - 5} more</span>
                        )}
                      </div>
                      <Button asChild size="sm" className="w-full rounded-full text-xs">
                        <Link to="/about#join">
                          Register <ArrowRight className="ml-1.5 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>

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
        </div>
      </section>

      {/* Floating CTA — mobile/smaller screens */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden"
          >
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
    </Layout>
  );
};

export default Interests;
