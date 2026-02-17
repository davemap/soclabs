import { useState, useCallback, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Calendar, ExternalLink, Tag, User, Cpu, Building2, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Layout from "@/components/Layout";
import { communityProjects, communityMembers, referenceDesigns, partners } from "@/data/mockData";
import ReactMarkdown from "react-markdown";
import CommentsThreads from "@/components/CommentsThreads";
import MilestoneTracker from "@/components/MilestoneTracker";
import ProjectMilestones from "@/components/ProjectMilestones";

const statusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "In Progress":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "Planning":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const ProjectDetail = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandPhase, setExpandPhase] = useState<string | null>(null);
  const [expandTaskIndex, setExpandTaskIndex] = useState<number | undefined>(undefined);
  const [expandTopicId, setExpandTopicId] = useState<string | null>(null);

  // Handle ?phase= and ?topic= query params
  useEffect(() => {
    const phase = searchParams.get("phase");
    const topic = searchParams.get("topic");
    if (phase) {
      setExpandPhase(phase);
      setSearchParams({}, { replace: true });
      setTimeout(() => {
        const el = document.getElementById(`milestone-phase-${phase}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
    if (topic) {
      setExpandTopicId(topic);
      setSearchParams({}, { replace: true });
      // Scroll to milestones section
      setTimeout(() => {
        const el = document.getElementById("project-milestones");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [searchParams, setSearchParams]);

  const handlePhaseClick = useCallback((phase: string, taskIndex?: number) => {
    setExpandPhase(phase);
    setExpandTaskIndex(taskIndex);
    setTimeout(() => {
      const el = document.getElementById(`milestone-phase-${phase}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }, []);
  const { id } = useParams<{ id: string }>();
  const project = communityProjects.find((p) => p.id === id);
  const author = project ? communityMembers.find((m) => m.id === project.authorId) : null;
  const referenceSoc = project ? referenceDesigns.find((d) => d.name.toLowerCase() === project.referenceSoc.toLowerCase()) : null;
  const collaborators = project ? communityMembers.filter((m) => project.collaboratorIds?.includes(m.id)) : [];
  const organisations = project ? partners.filter((p) => project.organisationIds?.includes(p.id)) : [];

  if (!project) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Project not found</h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const isFpga = project.technology === "FPGA";
  const techBorder = isFpga ? "border-sky-500/40" : "border-violet-500/40";
  const techBorderHover = isFpga ? "hover:border-sky-500/70" : "hover:border-violet-500/70";

  const initials = project.author
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <Layout>
      <article className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back link */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </motion.div>

          <div className="flex gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0 max-w-4xl">
              {/* Header */}
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="outline" className={statusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge variant="outline">{project.referenceSoc}</Badge>
                  <Badge variant="outline">{project.technology}</Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                  {project.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  {author ? (
                    <Link
                      to={`/community/${author.id}`}
                      className="font-medium text-primary hover:underline transition-colors"
                    >
                      {project.author}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground">{project.author}</span>
                  )}
                  <span>{project.institution}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(project.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>
              </motion.header>


              {/* Non-sticky milestone tracker in its original position */}
              {project.phaseProgress && (
                <div className="mb-10">
                  <MilestoneTracker
                    phaseProgress={project.phaseProgress}
                    milestones={project.milestones}
                    onPhaseClick={handlePhaseClick}
                    technology={project.technology}
                    isFloating={false}
                    isSticky={false}
                  />
                </div>
              )}

              {/* Project image */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className={`mb-10 rounded-xl border overflow-hidden bg-muted/20 ${techBorder}`}
              >
                <img
                  src="/placeholder.svg"
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />
              </motion.div>

              {/* Architecture sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-xl border bg-muted/30 p-5 mb-10 ${techBorder}`}
              >
                <h3 className="text-sm font-display font-bold mb-2">Architecture Overview</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.architecture}
                </p>
              </motion.div>

              {/* Blog content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="prose prose-neutral dark:prose-invert max-w-none 
                  prose-headings:font-display prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                  prose-p:leading-relaxed prose-p:text-muted-foreground
                  prose-li:text-muted-foreground
                  prose-strong:text-foreground
                  prose-table:text-sm
                  prose-th:text-left prose-th:font-display prose-th:font-semibold prose-th:text-foreground prose-th:border-b prose-th:border-border prose-th:pb-2 prose-th:pr-4
                  prose-td:border-b prose-td:border-border/40 prose-td:py-2 prose-td:pr-4 prose-td:text-muted-foreground
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              >
                <ReactMarkdown>{project.content}</ReactMarkdown>
              </motion.div>

              {/* Collaborators */}
              {collaborators.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="mt-10"
                >
                  <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" /> Collaborators
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {collaborators.map((member) => {
                      const initials = member.name.split(" ").filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join("").slice(0, 2);
                      return (
                        <Link key={member.id} to={`/community/${member.id}`} className="group">
                          <div className={`rounded-xl border bg-card p-4 ${techBorder} ${techBorderHover} hover:shadow-md transition-all duration-300 flex items-center gap-3`}>
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-display font-bold truncate group-hover:text-primary transition-colors">{member.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{member.institution}</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Organisations */}
              {organisations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="mt-10"
                >
                  <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" /> Associated Organisations
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {organisations.map((org) => (
                      <Link key={org.id} to={`/partners/${org.id}`} className="group">
                        <div className={`rounded-xl border bg-card p-4 ${techBorder} ${techBorderHover} hover:shadow-md transition-all duration-300 flex items-center gap-3`}>
                          <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-display font-bold truncate group-hover:text-primary transition-colors">{org.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{org.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Reference SoC card */}
              {referenceSoc && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-10 mb-10"
                >
                  <h2 className="text-xl font-display font-bold mb-4">Reference SoC Platform</h2>
                  <Link to={`/designs/${referenceSoc.id}`} className="block group">
                    <div className={`rounded-xl border bg-card p-5 ${techBorder} ${techBorderHover} hover:shadow-lg transition-all duration-300`}>
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                          <Cpu className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">{referenceSoc.name}</h3>
                          <p className="text-sm text-muted-foreground">{referenceSoc.tagline}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <Badge variant="secondary" className="text-xs">{referenceSoc.processor}</Badge>
                            <Badge variant="outline" className="text-xs">{referenceSoc.busArchitecture}</Badge>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Project Milestones */}
              {project.milestones && project.milestones.length > 0 && (
                <div id="project-milestones">
                  <ProjectMilestones
                    milestones={project.milestones}
                    expandPhase={expandPhase}
                    expandTaskIndex={expandTaskIndex}
                    expandTopicId={expandTopicId}
                    phaseEffort={project.phaseEffort}
                    phaseUncertainty={project.phaseUncertainty}
                    phaseDates={project.phaseDates}
                    technology={project.technology}
                    trackerSlot={
                      project.phaseProgress && (
                        <MilestoneTracker
                          phaseProgress={project.phaseProgress}
                          milestones={project.milestones}
                          onPhaseClick={handlePhaseClick}
                          technology={project.technology}
                          isFloating={false}
                          isSticky={false}
                        />
                      )
                    }
                  />
                </div>
              )}

              <CommentsThreads pageId={`project-${project.id}`} />
            </div>

            {/* Sticky author sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24 space-y-3">
                <div className={`rounded-xl border bg-card p-4 shadow-sm ${techBorder}`}>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-16 w-16 mb-3">
                      <AvatarFallback className="text-lg font-display font-bold bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {author ? (
                      <Link
                        to={`/community/${author.id}`}
                        className="text-sm font-display font-bold hover:text-primary transition-colors"
                      >
                        {project.author}
                      </Link>
                    ) : (
                      <span className="text-sm font-display font-bold">{project.author}</span>
                    )}
                    <span className="text-xs text-muted-foreground mt-0.5">{project.institution}</span>
                  </div>

                  {author && (
                    <>
                      <div className="border-t border-border/60 mt-3 pt-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-1">
                          {author.expertise.map((e) => (
                            <Badge key={e} variant="secondary" className="text-[10px] px-2 py-0.5">
                              {e}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-border/60 mt-3 pt-3">
                        <Button asChild variant="outline" size="sm" className="w-full rounded-lg justify-start">
                          <Link to={`/community/${author.id}`}>
                            <User className="h-3.5 w-3.5 mr-2" /> View Profile
                          </Link>
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* Links card */}
                <div className={`rounded-xl border bg-card p-4 shadow-sm ${techBorder}`}>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Resources</h4>
                  <div className="flex flex-col gap-2">
                    <Button asChild size="sm" className="w-full rounded-lg">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" /> Repository
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                    {project.docsUrl && (
                      <Button asChild size="sm" variant="outline" className="w-full rounded-lg">
                        <a href={project.docsUrl} target="_blank" rel="noopener noreferrer">
                          <BookOpen className="h-4 w-4 mr-2" /> Documentation
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ProjectDetail;
