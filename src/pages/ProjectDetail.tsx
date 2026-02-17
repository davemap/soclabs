import { useState, useCallback, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Calendar, ExternalLink, Tag, User, Cpu, Building2, Users, BookOpen, Settings, FileText, ListChecks, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { communityProjects, communityMembers, referenceDesigns, partners } from "@/data/mockData";
import ReactMarkdown from "react-markdown";
import CommentsThreads from "@/components/CommentsThreads";
import MilestoneTracker from "@/components/MilestoneTracker";
import ProjectMilestones from "@/components/ProjectMilestones";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ProjectContentManager from "@/components/project-manage/ProjectContentManager";
import ProjectMilestonesManager from "@/components/project-manage/ProjectMilestonesManager";
import ProjectJoinRequestsManager from "@/components/project-manage/ProjectJoinRequestsManager";
import ProjectSettingsManager from "@/components/project-manage/ProjectSettingsManager";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
  const { user } = useAuth();
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
  const mockProject = communityProjects.find((p) => p.id === id);
  const [dbProject, setDbProject] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(!mockProject);

  useEffect(() => {
    if (!mockProject && id) {
      supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle()
        .then(async ({ data }) => {
          if (data) {
            // Fetch the profile separately since there's no FK relationship
            const { data: profile } = await supabase
              .from("profiles")
              .select("username, full_name")
              .eq("user_id", data.user_id)
              .maybeSingle();
            setDbProject({ ...data, profile });
          }
          setDbLoading(false);
        });
    }
  }, [id, mockProject]);

  // Use mock project if found, otherwise use database project
  const project = mockProject || null;
  const author = project ? communityMembers.find((m) => m.id === project.authorId) : null;
  const referenceSocDesign = project ? referenceDesigns.find((d) => d.name.toLowerCase() === project.referenceSoc.toLowerCase()) : null;
  const collaborators = project ? communityMembers.filter((m) => project.collaboratorIds?.includes(m.id)) : [];
  const organisations = project ? partners.filter((p) => project.organisationIds?.includes(p.id)) : [];

  // Join request state
  const [joinMessage, setJoinMessage] = useState("");
  const [joinSending, setJoinSending] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);
  const [dbContent, setDbContent] = useState<any[]>([]);
  const [dbMilestones, setDbMilestones] = useState<any[]>([]);

  // Fetch join request status and content for DB projects
  useEffect(() => {
    if (dbProject && user && user.id !== dbProject.user_id) {
      supabase
        .from("project_join_requests")
        .select("*")
        .eq("project_id", dbProject.id)
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => setExistingRequest(data));
    }
  }, [dbProject, user]);

  useEffect(() => {
    if (dbProject) {
      supabase
        .from("project_content")
        .select("*")
        .eq("project_id", dbProject.id)
        .order("sort_order")
        .then(({ data }) => setDbContent(data || []));
      supabase
        .from("project_milestones")
        .select("*")
        .eq("project_id", dbProject.id)
        .order("sort_order")
        .then(({ data }) => setDbMilestones(data || []));
    }
  }, [dbProject]);

  const sendJoinRequest = async () => {
    if (!user || !dbProject) return;
    setJoinSending(true);
    const { error } = await supabase
      .from("project_join_requests")
      .insert({ project_id: dbProject.id, user_id: user.id, message: joinMessage });
    if (error) {
      toast.error(error.code === "23505" ? "You already sent a request" : "Failed to send request");
    } else {
      toast.success("Join request sent!");
      setExistingRequest({ status: "pending" });
      setJoinMessage("");
    }
    setJoinSending(false);
  };

  const refreshDbProject = async () => {
    if (!id) return;
    const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
    if (data) {
      const { data: profile } = await supabase.from("profiles").select("username, full_name").eq("user_id", data.user_id).maybeSingle();
      setDbProject({ ...data, profile });
    }
  };

  // If we have a database project but no mock project, render a simplified view
  if (!project && dbProject) {
    const dbRefSoc = referenceDesigns.find((d) => d.id === dbProject.reference_soc);
    const isOwner = user?.id === dbProject.user_id;

    // Compute milestone progress for tracker
    const milestonePhaseProgress: Record<string, number> = {};
    if (dbMilestones.length > 0) {
      const phases = [...new Set(dbMilestones.map((m: any) => m.phase))];
      phases.forEach((phase) => {
        const phaseTasks = dbMilestones.filter((m: any) => m.phase === phase);
        const done = phaseTasks.filter((m: any) => m.done).length;
        milestonePhaseProgress[phase] = Math.round((done / phaseTasks.length) * 100);
      });
    }

    return (
      <Layout>
        <article className="py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            </motion.div>

            <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="outline" className={statusColor(dbProject.status)}>{dbProject.status}</Badge>
                {dbRefSoc && <Badge variant="outline">{dbRefSoc.name}</Badge>}
                {dbProject.target_technology && <Badge variant="outline">{dbProject.target_technology}</Badge>}
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{dbProject.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="font-medium text-foreground">
                  {dbProject.profile?.full_name || dbProject.profile?.username || "Community Member"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(dbProject.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>

              {dbProject.interests?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {dbProject.interests.map((tag: string) => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      <Tag className="h-2.5 w-2.5" />{tag}
                    </span>
                  ))}
                </div>
              )}

              {dbProject.description && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">{dbProject.description}</p>
              )}

              <div className="flex flex-wrap gap-3 mt-6">
                {dbProject.github_url && (
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <a href={dbProject.github_url} target="_blank" rel="noreferrer">
                      <Github className="h-4 w-4 mr-2" /> GitHub
                    </a>
                  </Button>
                )}
                {dbProject.docs_url && (
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <a href={dbProject.docs_url} target="_blank" rel="noreferrer">
                      <BookOpen className="h-4 w-4 mr-2" /> Documentation
                    </a>
                  </Button>
                )}
                {/* Join Request Button for non-owners */}
                {user && !isOwner && !existingRequest && (
                  <Button variant="default" size="sm" className="rounded-full" onClick={() => document.getElementById("join-request-section")?.scrollIntoView({ behavior: "smooth" })}>
                    <UserPlus className="h-4 w-4 mr-2" /> Request to Join
                  </Button>
                )}
                {existingRequest && (
                  <Badge variant="outline" className="text-xs">
                    Join request: {existingRequest.status}
                  </Badge>
                )}
              </div>
            </motion.header>

            {dbRefSoc && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
                <h2 className="text-xl font-display font-bold mb-4">Reference SoC Platform</h2>
                <Link to={`/designs/${dbRefSoc.id}`} className="block group">
                  <div className="rounded-xl border bg-card p-5 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                        <Cpu className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">{dbRefSoc.name}</h3>
                        <p className="text-sm text-muted-foreground">{dbRefSoc.tagline}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {dbProject.target_technology && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border bg-muted/30 p-5 mb-10">
                <h3 className="text-sm font-display font-bold mb-2">Target Technology</h3>
                <p className="text-sm text-muted-foreground">
                  {dbProject.target_technology}
                  {dbProject.fpga_family && ` — ${dbProject.fpga_family}`}
                  {dbProject.asic_process && ` — ${dbProject.asic_process}`}
                </p>
                {dbProject.timeframe && (
                  <p className="text-sm text-muted-foreground mt-1">Timeline: {dbProject.timeframe}</p>
                )}
              </motion.div>
            )}

            {/* DB Milestones display (for everyone) */}
            {dbMilestones.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mb-10">
                <ProjectMilestones
                  milestones={dbMilestones.map((m: any) => ({ phase: m.phase, task: m.task, done: m.done }))}
                  technology={dbProject.target_technology?.toLowerCase().includes("fpga") ? "FPGA" : "ASIC"}
                  trackerSlot={
                    Object.keys(milestonePhaseProgress).length > 0
                      ? (togglePhase: (phase: string) => void) => (
                          <MilestoneTracker
                            phaseProgress={milestonePhaseProgress}
                            milestones={dbMilestones.map((m: any) => ({ phase: m.phase, task: m.task, done: m.done }))}
                            onPhaseClick={(phase) => togglePhase(phase)}
                            technology={dbProject.target_technology?.toLowerCase().includes("fpga") ? "FPGA" : "ASIC"}
                            isFloating={false}
                            isSticky={false}
                            compact
                          />
                        )
                      : undefined
                  }
                />
              </motion.div>
            )}

            {/* DB Content sections display (for everyone) */}
            {dbContent.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
                <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                  {dbContent.map((section: any) => (
                    <div key={section.id} className="mb-8">
                      {section.title && <h2>{section.title}</h2>}
                      <ReactMarkdown>{section.body}</ReactMarkdown>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Join Request Form for non-owners */}
            {user && !isOwner && !existingRequest && (
              <div id="join-request-section" className="rounded-xl border bg-card p-6 mb-10">
                <h3 className="text-lg font-display font-bold mb-3 flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" /> Request to Join This Project
                </h3>
                <Textarea
                  placeholder="Introduce yourself and explain why you'd like to join... (optional)"
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  rows={3}
                  className="mb-3"
                />
                <Button onClick={sendJoinRequest} disabled={joinSending}>
                  {joinSending ? "Sending..." : "Send Join Request"}
                </Button>
              </div>
            )}

            {/* Owner Management Tabs */}
            {isOwner && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-10">
                <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" /> Manage Project
                </h2>
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="content" className="gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Content
                    </TabsTrigger>
                    <TabsTrigger value="milestones" className="gap-1.5">
                      <ListChecks className="h-3.5 w-3.5" /> Milestones
                    </TabsTrigger>
                    <TabsTrigger value="requests" className="gap-1.5">
                      <Users className="h-3.5 w-3.5" /> Requests
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-1.5">
                      <Settings className="h-3.5 w-3.5" /> Settings
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="content" className="mt-4">
                    <ProjectContentManager projectId={dbProject.id} />
                  </TabsContent>
                  <TabsContent value="milestones" className="mt-4">
                    <ProjectMilestonesManager projectId={dbProject.id} />
                  </TabsContent>
                  <TabsContent value="requests" className="mt-4">
                    <ProjectJoinRequestsManager projectId={dbProject.id} />
                  </TabsContent>
                  <TabsContent value="settings" className="mt-4">
                    <ProjectSettingsManager project={dbProject} onUpdate={refreshDbProject} />
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}

            <CommentsThreads pageId={`project-${dbProject.id}`} />
          </div>
        </article>
      </Layout>
    );
  }

  if (!project && !dbProject) {
    if (dbLoading) {
      return (
        <Layout>
          <div className="py-24 flex items-center justify-center min-h-[60vh]">
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </Layout>
      );
    }
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

  if (!project) return null;

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
                  {(() => {
                    const institutionOrg = organisations.find((o) => o.name === project.institution)
                      || partners.find((p) => p.name === project.institution);
                    return institutionOrg ? (
                      <Link
                        to={`/partners/${institutionOrg.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {project.institution}
                      </Link>
                    ) : (
                      <span>{project.institution}</span>
                    );
                  })()}
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
              {referenceSocDesign && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-10 mb-10"
                >
                  <h2 className="text-xl font-display font-bold mb-4">Reference SoC Platform</h2>
                  <Link to={`/designs/${referenceSocDesign.id}`} className="block group">
                    <div className={`rounded-xl border bg-card p-5 ${techBorder} ${techBorderHover} hover:shadow-lg transition-all duration-300`}>
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                          <Cpu className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">{referenceSocDesign.name}</h3>
                          <p className="text-sm text-muted-foreground">{referenceSocDesign.tagline}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <Badge variant="secondary" className="text-xs">{referenceSocDesign.processor}</Badge>
                            <Badge variant="outline" className="text-xs">{referenceSocDesign.busArchitecture}</Badge>
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
                      project.phaseProgress
                        ? (togglePhase, expandedPhases) => (
                            <MilestoneTracker
                              phaseProgress={project.phaseProgress!}
                              milestones={project.milestones}
                              onPhaseClick={(phase) => {
                                togglePhase(phase);
                              }}
                              technology={project.technology}
                              isFloating={false}
                              isSticky={false}
                              compact
                            />
                          )
                        : undefined
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
