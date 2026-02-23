import { useState, useMemo, useCallback } from "react";
import { useUserInterests } from "@/hooks/useUserInterests";
import CommentsThreads from "@/components/CommentsThreads";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, ArrowRight, Users, FolderOpen, Check, Tag, Github, Plus, BookOpen, Linkedin } from "lucide-react";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { technologies, referenceDesigns, communityProjects, communityMembers } from "@/data/mockData";
import { interests } from "@/data/interests";
import { cn } from "@/lib/utils";
import DeregisterConfirmDialog from "@/components/DeregisterConfirmDialog";

// Map subcategory → colors aligned with architecture/hierarchy diagram typeColors
const subcategoryBorderColors: Record<string, string> = {
  Processors: "border-blue-200 dark:border-blue-500/30",
  "System Interconnects": "border-sky-200 dark:border-sky-500/30",
  Peripherals: "border-amber-200 dark:border-amber-500/30",
  "Memory Controllers": "border-emerald-200 dark:border-emerald-500/30",
  "Hardware Acceleration": "border-violet-200 dark:border-violet-500/30",
  "DMA Controllers": "border-indigo-200 dark:border-indigo-500/30",
  "RTL Design": "border-blue-200 dark:border-blue-500/30",
  Verification: "border-rose-200 dark:border-rose-500/30",
  Synthesis: "border-violet-200 dark:border-violet-500/30",
  "Physical Design": "border-amber-200 dark:border-amber-500/30",
  Tapeout: "border-emerald-200 dark:border-emerald-500/30",
  "Silicon Validation": "border-slate-300 dark:border-slate-500/30",
  "FPGA Boards": "border-blue-200 dark:border-blue-500/30",
  "Shuttle Services": "border-rose-200 dark:border-rose-500/30",
  "Bus Protocols": "border-sky-200 dark:border-sky-500/30",
  "Serial Protocols": "border-amber-200 dark:border-amber-500/30",
  "High-Speed Protocols": "border-violet-200 dark:border-violet-500/30",
};

const subcategoryAccentColors: Record<string, string> = {
  Processors: "text-blue-600 dark:text-blue-400",
  "System Interconnects": "text-sky-600 dark:text-sky-400",
  Peripherals: "text-amber-600 dark:text-amber-400",
  "Memory Controllers": "text-emerald-600 dark:text-emerald-400",
  "Hardware Acceleration": "text-violet-600 dark:text-violet-400",
  "DMA Controllers": "text-indigo-600 dark:text-indigo-400",
  "RTL Design": "text-blue-600 dark:text-blue-400",
  Verification: "text-rose-600 dark:text-rose-400",
  Synthesis: "text-violet-600 dark:text-violet-400",
  "Physical Design": "text-amber-600 dark:text-amber-400",
  Tapeout: "text-emerald-600 dark:text-emerald-400",
  "Silicon Validation": "text-slate-600 dark:text-slate-400",
  "FPGA Boards": "text-blue-600 dark:text-blue-400",
  "Shuttle Services": "text-rose-600 dark:text-rose-400",
  "Bus Protocols": "text-sky-600 dark:text-sky-400",
  "Serial Protocols": "text-amber-600 dark:text-amber-400",
  "High-Speed Protocols": "text-violet-600 dark:text-violet-400",
};

const subcategoryBgColors: Record<string, string> = {
  Processors: "bg-blue-50 dark:bg-blue-500/10",
  "System Interconnects": "bg-sky-50 dark:bg-sky-500/10",
  Peripherals: "bg-amber-50 dark:bg-amber-500/10",
  "Memory Controllers": "bg-emerald-50 dark:bg-emerald-500/10",
  "Hardware Acceleration": "bg-violet-50 dark:bg-violet-500/10",
  "DMA Controllers": "bg-indigo-50 dark:bg-indigo-500/10",
  "RTL Design": "bg-blue-50 dark:bg-blue-500/10",
  Verification: "bg-rose-50 dark:bg-rose-500/10",
  Synthesis: "bg-violet-50 dark:bg-violet-500/10",
  "Physical Design": "bg-amber-50 dark:bg-amber-500/10",
  Tapeout: "bg-emerald-50 dark:bg-emerald-500/10",
  "Silicon Validation": "bg-slate-100 dark:bg-slate-500/10",
  "FPGA Boards": "bg-blue-50 dark:bg-blue-500/10",
  "Shuttle Services": "bg-rose-50 dark:bg-rose-500/10",
  "Bus Protocols": "bg-sky-50 dark:bg-sky-500/10",
  "Serial Protocols": "bg-amber-50 dark:bg-amber-500/10",
  "High-Speed Protocols": "bg-violet-50 dark:bg-violet-500/10",
};

const TechnologyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const tech = technologies.find((t) => t.id === id);

  if (!tech) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Technology not found</h1>
          <button onClick={() => navigate(-1)} className="text-primary hover:underline">← Go Back</button>
        </div>
      </Layout>
    );
  }

  const category = tech.category;
  const borderColor = subcategoryBorderColors[category] || "border-border/60";
  const accentColor = subcategoryAccentColors[category] || "text-primary";
  const bgColor = subcategoryBgColors[category] || "bg-primary/10";

  // Find interest slugs linked to this technology
  const linkedInterests = interests.filter((i) => i.technologyName === tech.name);
  const linkedSlugs = linkedInterests.map((i) => i.slug);

  // Find members interested in this technology
  const interestedMembers = communityMembers
    .filter((m) => m.interests?.some((slug: string) => linkedSlugs.includes(slug)))
    .sort((a, b) => {
      // Members with matching expertise come first
      const expertiseStrings = linkedInterests.flatMap((i) => i.relatedMemberExpertise);
      const aHasExpertise = a.expertise.some((e) => expertiseStrings.includes(e));
      const bHasExpertise = b.expertise.some((e) => expertiseStrings.includes(e));
      if (aHasExpertise && !bHasExpertise) return -1;
      if (!aHasExpertise && bHasExpertise) return 1;
      return 0;
    });

  // Find reference SoCs that list this technology
  const relatedDesigns = referenceDesigns.filter(
    (d) => d.relatedTechnologies?.includes(tech.name)
  );

  // Find projects that use reference SoCs which use this technology
  const projectsViaReferenceSoc = communityProjects.filter((p) =>
    p.referenceSoc && relatedDesigns.some((d) => d.name === p.referenceSoc)
  );

  // Find projects that match by tags
  const projectsViaTags = communityProjects.filter((p) => {
    const techNameLower = tech.name.toLowerCase();
    return p.tags?.some((tag) => {
      const tagLower = tag.toLowerCase();
      return techNameLower.includes(tagLower) || tagLower.includes(tech.name.split("/")[0].trim().split(" ").pop()?.toLowerCase() || "");
    });
  });

  // Combine and deduplicate
  const matchedProjects = [...new Map(
    [...projectsViaReferenceSoc, ...projectsViaTags].map((p) => [p.id, p])
  ).values()];

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="flex gap-6 items-start max-w-5xl mx-auto">
            {/* Main column */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className={cn(accentColor)}>{(tech as any).group}</Badge>
                  <Badge variant="outline" className={cn("border-l-2", borderColor, accentColor)}>{tech.category}</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{tech.name}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {tech.longDescription || tech.description}
                </p>
              </motion.div>

              <div className="space-y-12">
                {/* Features */}
                <ScrollReveal>
                  <div className={cn("rounded-2xl border-2 bg-card p-7", borderColor)}>
                    <h2 className={cn("text-lg font-display font-bold mb-4", accentColor)}>Key Features</h2>
                    <ul className="space-y-2">
                      {tech.features?.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ArrowRight className={cn("h-3 w-3 mt-1.5 shrink-0", accentColor)} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>

                {/* Reference SoCs */}
                <ScrollReveal>
                  <div className={cn("rounded-2xl border-2 bg-card/50 p-7", borderColor)}>
                    <h2 className="text-2xl font-display font-bold mb-6">
                      Reference SoCs using <span className={accentColor}>{tech.name}</span>
                    </h2>
                    {relatedDesigns.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {relatedDesigns.map((design) => (
                          <Link key={design.id} to={`/designs/${design.id}`}>
                            <Card className={cn("hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full border-2", borderColor)}>
                              <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-display font-bold">{design.name}</h3>
                                  {design.provenIn?.map((p, i) => (
                                    <Badge key={i} variant="outline" className="text-[10px]">
                                      {p.type}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{design.tagline}</p>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No reference SoCs currently use this technology.</p>
                    )}
                  </div>
                </ScrollReveal>

                {/* Community Projects */}
                <ScrollReveal>
                  <div className={cn("rounded-2xl border-2 bg-card/50 p-7", borderColor)}>
                    <div className="flex items-center gap-2 mb-6">
                      <FolderOpen className={cn("h-5 w-5", accentColor)} />
                      <h2 className="text-2xl font-display font-bold">
                        Projects using <span className={accentColor}>{tech.name}</span>
                      </h2>
                      <span className="text-sm text-muted-foreground ml-1">({matchedProjects.length})</span>
                    </div>
                    {matchedProjects.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {matchedProjects.map((project) => (
                          <Link key={project.id} to={`/projects/${project.id}`}>
                            <Card className={cn("hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full border-2", borderColor)}>
                              <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      project.status === "Completed"
                                        ? "border-green-500/30 text-green-400"
                                        : project.status === "In Progress"
                                        ? "border-primary/30 text-primary"
                                        : "border-border text-muted-foreground"
                                    }
                                  >
                                    {project.status}
                                  </Badge>
                                  {project.referenceSoc && (
                                    <Badge variant="outline" className={cn("text-[10px]", accentColor, borderColor)}>
                                      {project.referenceSoc}
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-display font-semibold mb-1">{project.title}</h3>
                                <p className="text-xs text-muted-foreground mb-2">{project.author} · {project.institution}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{project.description}</p>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                        <FolderOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">No community projects currently use this technology.</p>
                        <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
                          <Link to="/projects">Browse all projects</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollReveal>

                {/* Interested People */}
                <div className={cn("rounded-2xl border-2 bg-card/50 p-7", borderColor)}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 mb-6"
                  >
                    <Users className={cn("h-5 w-5", accentColor)} />
                    <h2 className="text-2xl font-display font-bold">Interested People</h2>
                    <span className="text-sm text-muted-foreground ml-1">({interestedMembers.length})</span>
                  </motion.div>

                  {interestedMembers.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-5">
                      {interestedMembers.map((member, i) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Card className={cn("h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-2", borderColor)}>
                            <CardContent className="p-5">
                              <Link to={`/community/${member.id}`} className="group">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bgColor)}>
                                    <span className={cn("font-display font-bold text-sm", accentColor)}>
                                      {member.name.split(" ").map((n) => n[0]).join("")}
                                    </span>
                                  </div>
                                   <div className="min-w-0 flex-1">
                                    <h3 className="font-display font-bold text-sm truncate group-hover:text-primary transition-colors">{member.name}</h3>
                                    <p className="text-xs text-muted-foreground truncate">{member.institution}</p>
                                  </div>
                                  {member.linkedin && (
                                    <a href={member.linkedin} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
                                      <Linkedin className="h-4 w-4" />
                                    </a>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">{member.location}</p>
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {member.expertise.map((e) => {
                                    const expertiseStrings = linkedInterests.flatMap((i) => i.relatedMemberExpertise);
                                    const isExpert = expertiseStrings.includes(e);
                                    return (
                                      <span key={e} className={cn(
                                        "text-xs px-2 py-0.5 rounded-full font-medium",
                                        isExpert
                                          ? cn("ring-1 ring-offset-1 ring-offset-background", bgColor, accentColor, `ring-current`)
                                          : "bg-secondary text-secondary-foreground"
                                      )}>
                                        {isExpert && "★ "}{e}
                                      </span>
                                    );
                                  })}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {member.projects.map((p) => (
                                    <span key={p} className={cn("text-xs px-2 py-0.5 rounded-full font-medium", bgColor, accentColor)}>
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              </Link>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                      <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">No community members have registered interest in this technology yet.</p>
                      <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
                        <Link to="/about#join">Be the first to join</Link>
                      </Button>
                    </div>
                  )}
                </div>

                <CommentsThreads pageId={`technology-${tech.id}`} />
              </div>
            </div>

            {/* Sticky sidebar */}
            <SidebarPanel
              tech={tech}
              linkedSlug={linkedSlugs[0] || tech.name}
              accentColor={accentColor}
              borderColor={borderColor}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

/* ── Sidebar component ── */
const SidebarPanel = ({ tech, linkedSlug, accentColor, borderColor }: {
  tech: (typeof technologies)[number];
  linkedSlug: string;
  accentColor: string;
  borderColor: string;
}) => {
  const { isRegistered, toggleInterest } = useUserInterests();
  const registered = isRegistered(linkedSlug);
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);

  const handleToggle = () => {
    if (registered) {
      setConfirmSlug(linkedSlug);
    } else {
      toggleInterest(linkedSlug);
    }
  };

  return (
    <>
    <aside className="hidden lg:block w-56 shrink-0 sticky top-24 space-y-3">
      {/* Register Interest */}
      <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <button
          onClick={handleToggle}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-semibold transition-all duration-200",
            registered
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-primary/10"
          )}
        >
          {registered ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {registered ? "Interested" : "Register Interest"}
        </button>
      </div>

      {/* Resources */}
      {tech.links && tech.links.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <h3 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3">Resources</h3>
          <div className="space-y-1.5">
            {tech.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent/40",
                  accentColor
                )}
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <h3 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3">Explore</h3>
        <Button asChild variant="ghost" className="w-full rounded-lg justify-start text-primary" size="sm">
          <Link to="/technologies">
            <ArrowRight className="h-4 w-4 mr-2" /> All Technologies
          </Link>
        </Button>
        <Button asChild variant="ghost" className="w-full rounded-lg justify-start text-primary" size="sm">
          <Link to="/projects/start">
            <ArrowRight className="h-4 w-4 mr-2" /> Start a Project
          </Link>
        </Button>
      </div>
    </aside>
    <DeregisterConfirmDialog
      open={!!confirmSlug}
      interestName={tech.name}
      onConfirm={() => { toggleInterest(confirmSlug!); setConfirmSlug(null); }}
      onCancel={() => setConfirmSlug(null)}
    />
    </>
  );
};

export default TechnologyDetail;
