import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Calendar, ExternalLink, Tag, User, Cpu, Building2, Users, BookOpen, Settings, FileText, ListChecks, UserPlus, CircuitBoard, Save, Plus, Trash2 } from "lucide-react";
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
import AddMilestoneTaskDialog from "@/components/project-manage/AddMilestoneTaskDialog";
import CompleteTaskDialog from "@/components/project-manage/CompleteTaskDialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const fpgaFamilies = [
  "Xilinx Artix-7", "Xilinx Kintex-7", "Xilinx Zynq-7000", "Xilinx UltraScale+",
  "Intel Cyclone V", "Intel Cyclone 10", "Intel Arria 10", "Intel Stratix 10",
  "Lattice iCE40", "Lattice ECP5", "Gowin GW1N", "Undecided",
];
const asicProcessNodes = [
  "TSMC 180nm", "TSMC 130nm", "TSMC 65nm", "TSMC 40nm", "TSMC 28nm",
  "GlobalFoundries 180nm", "GlobalFoundries 130nm", "GlobalFoundries 22nm",
  "SkyWater 130nm", "IHP 130nm", "Undecided",
];
const editTimeframeSteps = [
  { value: 0, label: "1 Month" },
  { value: 1, label: "3 Months" },
  { value: 2, label: "6 Months" },
  { value: 3, label: "1 Year" },
  { value: 4, label: "2 Years" },
  { value: 5, label: "3 Years" },
  { value: 6, label: "Unknown" },
];
const timeframeLabelToIndex = (label: string | null): number => {
  if (!label) return 3;
  const idx = editTimeframeSteps.findIndex((s) => s.label === label);
  return idx >= 0 ? idx : 3;
};

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
  const [editMode, setEditMode] = useState(false);

  // Inline edit state for target technology
  const [editTech, setEditTech] = useState("");
  const [editFpga, setEditFpga] = useState("");
  const [editAsic, setEditAsic] = useState("");
  const [savingTech, setSavingTech] = useState(false);

  // Inline edit state for timeline
  const [editTimeIdx, setEditTimeIdx] = useState<number[]>([3]);
  const [savingTime, setSavingTime] = useState(false);

  // Sync inline edit state when dbProject changes or edit mode is toggled
  useEffect(() => {
    if (dbProject && editMode) {
      setEditTech(dbProject.target_technology || "");
      setEditFpga(dbProject.fpga_family || "");
      setEditAsic(dbProject.asic_process || "");
      setEditTimeIdx([timeframeLabelToIndex(dbProject.timeframe)]);
    }
  }, [dbProject, editMode]);

  const saveTargetTech = async () => {
    if (!dbProject) return;
    setSavingTech(true);
    const { error } = await supabase.from("projects").update({
      target_technology: editTech,
      fpga_family: editTech === "FPGA" ? editFpga : "",
      asic_process: editTech === "ASIC" ? editAsic : "",
    }).eq("id", dbProject.id);
    if (error) toast.error("Failed to save");
    else { toast.success("Target technology updated"); refreshDbProject(); }
    setSavingTech(false);
  };

  const saveTimeline = async () => {
    if (!dbProject) return;
    setSavingTime(true);
    const label = editTimeframeSteps[editTimeIdx[0]]?.label ?? "1 Year";
    const { error } = await supabase.from("projects").update({ timeframe: label }).eq("id", dbProject.id);
    if (error) toast.error("Failed to save");
    else { toast.success("Timeline updated"); refreshDbProject(); }
    setSavingTime(false);
  };

  // Inline edit state for title & description
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);
  const [savingDesc, setSavingDesc] = useState(false);

  // Sync title/desc when entering edit mode
  useEffect(() => {
    if (dbProject && editMode) {
      setEditTitle(dbProject.title || "");
      setEditDesc(dbProject.description || "");
    }
  }, [dbProject, editMode]);

  const saveTitle = async () => {
    if (!dbProject || !editTitle.trim()) return;
    setSavingTitle(true);
    const { error } = await supabase.from("projects").update({ title: editTitle }).eq("id", dbProject.id);
    if (error) toast.error("Failed to save");
    else { toast.success("Title updated"); refreshDbProject(); }
    setSavingTitle(false);
  };

  const saveDesc = async () => {
    if (!dbProject) return;
    setSavingDesc(true);
    const { error } = await supabase.from("projects").update({ description: editDesc }).eq("id", dbProject.id);
    if (error) toast.error("Failed to save");
    else { toast.success("Description updated"); refreshDbProject(); }
    setSavingDesc(false);
  };

  // Track unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!dbProject || !editMode) return false;
    return (
      editTitle !== (dbProject.title || "") ||
      editDesc !== (dbProject.description || "") ||
      editTech !== (dbProject.target_technology || "") ||
      editFpga !== (dbProject.fpga_family || "") ||
      editAsic !== (dbProject.asic_process || "") ||
      editTimeframeSteps[editTimeIdx[0]]?.label !== (dbProject.timeframe || "")
    );
  }, [dbProject, editMode, editTitle, editDesc, editTech, editFpga, editAsic, editTimeIdx]);

  // Warn on browser close / refresh
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  // Inline edit state for milestones
  const [editMilestones, setEditMilestones] = useState<{ id?: string; phase: string; task: string; done: boolean; sort_order: number; blurb?: string; assignee_id?: string | null; start_date?: string | null; projected_end_date?: string | null; learning_topic_ids?: string[] }[]>([]);
  const [savingMilestones, setSavingMilestones] = useState(false);
  const [addTaskDialogPhase, setAddTaskDialogPhase] = useState<string | null>(null);
  const [editTaskIndex, setEditTaskIndex] = useState<number | null>(null);
  const [projectCollaborators, setProjectCollaborators] = useState<{ user_id: string; full_name: string | null; username: string | null }[]>([]);

  // Complete task/phase dialog state
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [completeDialogTitle, setCompleteDialogTitle] = useState("");
  const [completeDialogSubtitle, setCompleteDialogSubtitle] = useState("");
  const [completeTarget, setCompleteTarget] = useState<{ type: "task"; index: number } | { type: "phase"; phase: string } | null>(null);

  const handleCompleteTask = (milestoneIndex: number) => {
    const m = dbMilestones[milestoneIndex];
    if (!m) return;
    setCompleteTarget({ type: "task", index: milestoneIndex });
    setCompleteDialogTitle("Complete Task");
    setCompleteDialogSubtitle(m.task);
    setCompleteDialogOpen(true);
  };

  const handleCompletePhase = (phase: string) => {
    const phaseLabels: Record<string, string> = {
      architecture: "Architecture", rtl: "RTL Design", verification: "Verification",
      synthesis: "Synthesis", "physical-design": "Physical Design", tapeout: "Tapeout",
      "silicon-validation": "Silicon Validation",
    };
    setCompleteTarget({ type: "phase", phase });
    setCompleteDialogTitle("Complete Phase");
    setCompleteDialogSubtitle(phaseLabels[phase] || phase);
    setCompleteDialogOpen(true);
  };

  const handleCompleteSubmit = async (data: { completed_date: string; effort_rating: number; uncertainty_rating: number }) => {
    if (!completeTarget || !dbProject) return;
    try {
      if (completeTarget.type === "task") {
        const m = dbMilestones[completeTarget.index];
        if (m) {
          await supabase.from("project_milestones").update({
            done: true,
            completed_date: data.completed_date,
            effort_rating: data.effort_rating,
            uncertainty_rating: data.uncertainty_rating,
          }).eq("id", m.id);
        }
      } else {
        // Complete all tasks in the phase
        const phaseMilestones = dbMilestones.filter((m: any) => m.phase === completeTarget.phase);
        for (const m of phaseMilestones) {
          if (!m.done) {
            await supabase.from("project_milestones").update({
              done: true,
              completed_date: data.completed_date,
              effort_rating: data.effort_rating,
              uncertainty_rating: data.uncertainty_rating,
            }).eq("id", m.id);
          }
        }
      }
      toast.success(completeTarget.type === "task" ? "Task completed!" : "Phase completed!");
      refreshMilestones();
    } catch {
      toast.error("Failed to complete");
    }
    setCompleteDialogOpen(false);
    setCompleteTarget(null);
  };

  const handleUncompleteTask = async (milestoneIndex: number) => {
    const m = dbMilestones[milestoneIndex];
    if (!m || !dbProject) return;
    await supabase.from("project_milestones").update({
      done: false, completed_date: null, effort_rating: null, uncertainty_rating: null,
    }).eq("id", m.id);
    toast.success("Task marked as incomplete");
    refreshMilestones();
  };

  const handleUncompletePhase = async (phase: string) => {
    if (!dbProject) return;
    const phaseMilestones = dbMilestones.filter((m: any) => m.phase === phase);
    for (const m of phaseMilestones) {
      await supabase.from("project_milestones").update({
        done: false, completed_date: null, effort_rating: null, uncertainty_rating: null,
      }).eq("id", m.id);
    }
    toast.success("Phase marked as incomplete");
    refreshMilestones();
  };

  useEffect(() => {
    if (!dbProject) return;
    const fetchCollabs = async () => {
      const collabs: { user_id: string; full_name: string | null; username: string | null }[] = [];
      // Add owner
      const { data: ownerProfile } = await supabase.from("profiles").select("user_id, full_name, username").eq("user_id", dbProject.user_id).maybeSingle();
      if (ownerProfile) collabs.push(ownerProfile);
      // Add accepted members
      const { data: accepted } = await supabase.from("project_join_requests").select("user_id").eq("project_id", dbProject.id).eq("status", "accepted");
      if (accepted) {
        for (const req of accepted) {
          if (req.user_id !== dbProject.user_id) {
            const { data: profile } = await supabase.from("profiles").select("user_id, full_name, username").eq("user_id", req.user_id).maybeSingle();
            if (profile) collabs.push(profile);
          }
        }
      }
      setProjectCollaborators(collabs);
    };
    fetchCollabs();
  }, [dbProject]);

  useEffect(() => {
    if (editMode && dbMilestones.length > 0) {
      setEditMilestones(dbMilestones.map((m: any) => ({ id: m.id, phase: m.phase, task: m.task, done: m.done, sort_order: m.sort_order, blurb: m.blurb || "", assignee_id: m.assignee_id || null, start_date: m.start_date || null, projected_end_date: m.projected_end_date || null, learning_topic_ids: m.learning_topic_ids || [] })));
    } else if (editMode) {
      setEditMilestones([]);
    }
  }, [editMode, dbMilestones]);

  const handleEditMilestoneAdd = (phase: string) => {
    setEditTaskIndex(null);
    setAddTaskDialogPhase(phase);
  };

  const handleEditExistingTask = (index: number) => {
    const m = editMilestones[index];
    if (!m) return;
    setEditTaskIndex(index);
    setAddTaskDialogPhase(m.phase);
  };

  const handleDialogSubmit = (data: any) => {
    if (!addTaskDialogPhase) return;
    if (editTaskIndex !== null) {
      // Update existing task
      setEditMilestones(prev => prev.map((m, i) => i === editTaskIndex ? {
        ...m,
        task: data.task,
        blurb: data.blurb,
        assignee_id: data.assignee_id === "unassigned" ? null : data.assignee_id,
        start_date: data.start_date,
        projected_end_date: data.projected_end_date,
        learning_topic_ids: data.learning_topic_ids,
      } : m));
    } else {
      // Add new task
      setEditMilestones(prev => [...prev, {
        phase: addTaskDialogPhase,
        task: data.task,
        done: false,
        sort_order: prev.length,
        blurb: data.blurb,
        assignee_id: data.assignee_id === "unassigned" ? null : data.assignee_id,
        start_date: data.start_date,
        projected_end_date: data.projected_end_date,
        learning_topic_ids: data.learning_topic_ids,
      }]);
    }
    setAddTaskDialogPhase(null);
    setEditTaskIndex(null);
  };

  const handleEditMilestoneRemove = async (index: number) => {
    const m = editMilestones[index];
    if (m.id) {
      await supabase.from("project_milestones").delete().eq("id", m.id);
    }
    setEditMilestones(prev => prev.filter((_, i) => i !== index));
    toast.success("Task removed");
    refreshMilestones();
  };

  const handleEditMilestoneUpdate = (index: number, field: string, value: any) => {
    setEditMilestones(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
  };

  const handleEditMilestonesSave = async () => {
    setSavingMilestones(true);
    try {
      for (let i = 0; i < editMilestones.length; i++) {
        const m = editMilestones[i];
        if (!m.task.trim()) continue;
        const payload = {
          phase: m.phase,
          task: m.task,
          done: m.done,
          sort_order: i,
          blurb: m.blurb || "",
          assignee_id: m.assignee_id || null,
          start_date: m.start_date || null,
          projected_end_date: m.projected_end_date || null,
          learning_topic_ids: m.learning_topic_ids || [],
        };
        if (m.id) {
          await supabase.from("project_milestones").update(payload).eq("id", m.id);
        } else {
          const { data } = await supabase.from("project_milestones").insert({ project_id: dbProject?.id, ...payload }).select().single();
          if (data) editMilestones[i] = { ...m, id: data.id, sort_order: i };
        }
      }
      setEditMilestones([...editMilestones]);
      toast.success("Milestones saved");
      refreshMilestones();
    } catch {
      toast.error("Failed to save milestones");
    }
    setSavingMilestones(false);
  };

  // Wrap "Done Editing" toggle with unsaved check
  const handleToggleEditMode = useCallback(() => {
    if (editMode && hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to exit edit mode?")) return;
    }
    setEditMode(!editMode);
  }, [editMode, hasUnsavedChanges]);

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

  const refreshContent = async () => {
    if (!dbProject) return;
    const { data } = await supabase
      .from("project_content")
      .select("*")
      .eq("project_id", dbProject.id)
      .order("sort_order");
    setDbContent(data || []);
  };

  const refreshMilestones = async () => {
    if (!dbProject) return;
    const { data } = await supabase
      .from("project_milestones")
      .select("*")
      .eq("project_id", dbProject.id)
      .order("sort_order");
    setDbMilestones(data || []);
  };

  useEffect(() => {
    if (dbProject) {
      refreshContent();
      refreshMilestones();
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

    // Compute milestone progress for tracker — always show all phases, default to 0%
    const defaultPhases = ["architecture", "rtl", "verification", "synthesis", "physical-design", "tapeout", "silicon-validation"];
    const milestonePhaseProgress: Record<string, number> = {};
    defaultPhases.forEach((phase) => { milestonePhaseProgress[phase] = 0; });
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
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {isOwner && (
                <Button
                  variant={editMode ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={handleToggleEditMode}
                >
                  <Settings className="h-4 w-4 mr-1.5" />
                  {editMode ? "Done Editing" : "Edit This Page"}
                </Button>
              )}
            </motion.div>

            <div className="flex gap-8">
              <div className="flex-1 min-w-0">

            <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="outline" className={statusColor(dbProject.status)}>{dbProject.status}</Badge>
                {dbRefSoc && <Badge variant="outline">{dbRefSoc.name}</Badge>}
                {dbProject.target_technology && <Badge variant="outline">{dbProject.target_technology}</Badge>}
              </div>

              {editMode && isOwner ? (
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 text-3xl md:text-4xl font-display font-bold bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none py-1"
                  />
                  <Button size="sm" variant="outline" className="rounded-full h-8 shrink-0" onClick={saveTitle} disabled={savingTitle}>
                    <Save className="h-3.5 w-3.5 mr-1" /> {savingTitle ? "Saving..." : "Save"}
                  </Button>
                </div>
              ) : (
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{dbProject.title}</h1>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <Link
                  to={`/community/${dbProject.user_id}`}
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  {dbProject.profile?.full_name || dbProject.profile?.username || "Community Member"}
                </Link>
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

              {editMode && isOwner ? (
                <div className="mb-4">
                  <div className="flex items-start gap-2">
                    <Textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      rows={3}
                      className="flex-1 text-lg leading-relaxed"
                      placeholder="Add a project description..."
                    />
                    <Button size="sm" variant="outline" className="rounded-full h-8 shrink-0 mt-1" onClick={saveDesc} disabled={savingDesc}>
                      <Save className="h-3.5 w-3.5 mr-1" /> {savingDesc ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              ) : dbProject.description ? (
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">{dbProject.description}</p>
              ) : null}

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

            {/* Non-sticky milestone tracker (always visible) */}
            <div className="mb-2">
              <MilestoneTracker
                phaseProgress={milestonePhaseProgress}
                milestones={dbMilestones.map((m: any) => ({ phase: m.phase, task: m.task, done: m.done }))}
                onPhaseClick={handlePhaseClick}
                technology={dbProject.target_technology?.toLowerCase().includes("fpga") ? "FPGA" : "ASIC"}
                isFloating={false}
                isSticky={false}
              />
            </div>

            {/* Target Technology card */}
            {(dbProject.target_technology || (editMode && isOwner)) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-4">
                {editMode && isOwner ? (
                  <div className="rounded-xl border bg-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-display font-bold flex items-center gap-2">
                        <CircuitBoard className="h-4 w-4 text-primary" /> Target Technology
                      </h3>
                      <Button size="sm" variant="outline" className="rounded-full h-8" onClick={saveTargetTech} disabled={savingTech}>
                        <Save className="h-3.5 w-3.5 mr-1" /> {savingTech ? "Saving..." : "Save"}
                      </Button>
                    </div>
                    <div className="flex gap-2 mb-3">
                      {["FPGA", "ASIC", "Undecided"].map((t) => (
                        <button key={t} type="button"
                          onClick={() => { setEditTech(t); setEditFpga(""); setEditAsic(""); }}
                          className={cn("flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                            editTech === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                          )}>
                          {t}
                        </button>
                      ))}
                    </div>
                    {editTech === "FPGA" && (
                      <Select value={editFpga} onValueChange={setEditFpga}>
                        <SelectTrigger><SelectValue placeholder="Select FPGA family" /></SelectTrigger>
                        <SelectContent>
                          {fpgaFamilies.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    )}
                    {editTech === "ASIC" && (
                      <Select value={editAsic} onValueChange={setEditAsic}>
                        <SelectTrigger><SelectValue placeholder="Select process node" /></SelectTrigger>
                        <SelectContent>
                          {asicProcessNodes.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ) : (() => {
                  const isFpga = dbProject.target_technology === "FPGA";
                  const isAsic = dbProject.target_technology === "ASIC";
                  const accentClass = isFpga
                    ? "border-sky-500/30 bg-sky-500/5"
                    : isAsic
                      ? "border-violet-500/30 bg-violet-500/5"
                      : "border-border bg-muted/30";
                  const iconBgClass = isFpga
                    ? "bg-sky-500/10 text-sky-600"
                    : isAsic
                      ? "bg-violet-500/10 text-violet-600"
                      : "bg-muted text-muted-foreground";
                  const badgeClass = isFpga
                    ? "bg-sky-500/10 text-sky-600 border-sky-500/20"
                    : isAsic
                      ? "bg-violet-500/10 text-violet-600 border-violet-500/20"
                      : "bg-muted text-muted-foreground border-border";
                  return (
                    <div className={cn("rounded-xl border p-5", accentClass)}>
                      <div className="flex items-start gap-4">
                        <div className={cn("p-3 rounded-xl shrink-0", iconBgClass)}>
                          <CircuitBoard className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-display font-bold mb-1">Target Technology</h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className={badgeClass}>
                              {dbProject.target_technology}
                            </Badge>
                            {dbProject.fpga_family && (
                              <Badge variant="outline" className="text-xs">
                                {dbProject.fpga_family}
                              </Badge>
                            )}
                            {dbProject.asic_process && (
                              <Badge variant="outline" className="text-xs">
                                {dbProject.asic_process}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* Timeframe visual bar */}
            {(dbProject.timeframe || (editMode && isOwner)) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10">
                {editMode && isOwner ? (
                  <div className="rounded-xl border bg-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-display font-bold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" /> Project Timeline
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">{editTimeframeSteps[editTimeIdx[0]]?.label}</span>
                        <Button size="sm" variant="outline" className="rounded-full h-8" onClick={saveTimeline} disabled={savingTime}>
                          <Save className="h-3.5 w-3.5 mr-1" /> {savingTime ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                    <Slider value={editTimeIdx} onValueChange={setEditTimeIdx} min={0} max={6} step={1} className="w-full mb-2" />
                    <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                      {editTimeframeSteps.map((s) => (<span key={s.value}>{s.label}</span>))}
                    </div>
                  </div>
                ) : (() => {
                  const timeframeSteps = ["1 Month", "3 Months", "6 Months", "1 Year", "2 Years", "3 Years", "Unknown"];
                  const currentIndex = timeframeSteps.indexOf(dbProject.timeframe);
                  const knownSteps = timeframeSteps.filter(s => s !== "Unknown");
                  const isUnknown = dbProject.timeframe === "Unknown" || currentIndex === -1;
                  return (
                    <div className="rounded-xl border bg-card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-display font-bold flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" /> Project Timeline
                        </h3>
                        <span className="text-sm font-semibold text-primary">{dbProject.timeframe}</span>
                      </div>
                      {isUnknown ? (
                        <p className="text-xs text-muted-foreground">Timeline not yet determined</p>
                      ) : (
                        <div className="space-y-2">
                          <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/80 to-primary"
                              initial={{ width: 0 }}
                              animate={{ width: `${((currentIndex + 1) / knownSteps.length) * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                          <div className="flex justify-between">
                            {knownSteps.map((step, i) => (
                              <span
                                key={step}
                                className={cn(
                                  "text-[10px] font-medium",
                                  i <= currentIndex ? "text-primary" : "text-muted-foreground/50"
                                )}
                              >
                                {step}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* DB Content sections display / inline edit */}
            {editMode && isOwner ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
                <ProjectContentManager projectId={dbProject.id} onSave={refreshContent} />
              </motion.div>
            ) : dbContent.length > 0 ? (
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
            ) : null}

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

            {/* DB Milestones display / inline edit */}
            <div id="project-milestones">
              <ProjectMilestones
                milestones={dbMilestones.map((m: any) => ({ phase: m.phase, task: m.task, done: m.done, effort: m.effort_rating, uncertainty: m.uncertainty_rating, blurb: m.blurb, startDate: m.start_date, projectedEndDate: m.projected_end_date, completedDate: m.completed_date, assigneeId: m.assignee_id, learningTopicIds: m.learning_topic_ids }))}
                expandPhase={expandPhase}
                expandTaskIndex={expandTaskIndex}
                technology={dbProject.target_technology?.toLowerCase().includes("fpga") ? "FPGA" : "ASIC"}
                trackerSlot={
                  !editMode
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
                editMode={editMode && isOwner}
                editMilestones={editMode && isOwner ? editMilestones : undefined}
                onEditAdd={handleEditMilestoneAdd}
                onEditRemove={handleEditMilestoneRemove}
                onEditUpdate={handleEditMilestoneUpdate}
                onEditSave={handleEditMilestonesSave}
                editSaving={savingMilestones}
                isOwner={isOwner}
                onCompleteTask={handleCompleteTask}
                onCompletePhase={handleCompletePhase}
                onUncompleteTask={handleUncompleteTask}
                onUncompletePhase={handleUncompletePhase}
                onEditTask={handleEditExistingTask}
              />
              {addTaskDialogPhase && (
                <AddMilestoneTaskDialog
                  open={!!addTaskDialogPhase}
                  onOpenChange={(v) => { if (!v) { setAddTaskDialogPhase(null); setEditTaskIndex(null); } }}
                  phase={addTaskDialogPhase}
                  phaseLabel={{
                    architecture: "Architecture", rtl: "RTL Design", verification: "Verification",
                    synthesis: "Synthesis", "physical-design": "Physical Design", tapeout: "Tapeout",
                    "silicon-validation": "Silicon Validation",
                  }[addTaskDialogPhase] || addTaskDialogPhase}
                  collaborators={projectCollaborators}
                  onSubmit={handleDialogSubmit}
                  initialData={editTaskIndex !== null ? {
                    task: editMilestones[editTaskIndex]?.task || "",
                    blurb: editMilestones[editTaskIndex]?.blurb || "",
                    assignee_id: editMilestones[editTaskIndex]?.assignee_id || null,
                    start_date: editMilestones[editTaskIndex]?.start_date || null,
                    projected_end_date: editMilestones[editTaskIndex]?.projected_end_date || null,
                    learning_topic_ids: editMilestones[editTaskIndex]?.learning_topic_ids || [],
                  } : null}
                />
              )}
              <CompleteTaskDialog
                open={completeDialogOpen}
                onOpenChange={setCompleteDialogOpen}
                title={completeDialogTitle}
                subtitle={completeDialogSubtitle}
                onSubmit={handleCompleteSubmit}
              />
            </div>

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
            {isOwner && editMode && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" /> Manage Project
                </h2>
                <Tabs defaultValue="requests" className="w-full">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="requests" className="gap-1.5">
                      <Users className="h-3.5 w-3.5" /> Requests
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-1.5">
                      <Settings className="h-3.5 w-3.5" /> Settings
                    </TabsTrigger>
                  </TabsList>
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

              {/* Sticky author & resources sidebar */}
              <aside className="hidden lg:block w-56 shrink-0">
                <div className="sticky top-24 space-y-3">
                  {/* Author card */}
                  <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-16 w-16 mb-3">
                        <AvatarFallback className="text-lg font-display font-bold bg-primary/10 text-primary">
                          {(dbProject.profile?.full_name || dbProject.profile?.username || "U")
                            .split(" ")
                            .filter((w: string) => /^[A-Z]/i.test(w))
                            .map((w: string) => w[0].toUpperCase())
                            .join("")
                            .slice(0, 2) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-display font-bold">
                        {dbProject.profile?.full_name || dbProject.profile?.username || "Community Member"}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">Project Owner</span>
                    </div>
                  </div>

                  {/* Resources card */}
                  {(dbProject.github_url || dbProject.docs_url) && (
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Resources</h4>
                      <div className="flex flex-col gap-2">
                        {dbProject.github_url && (
                          <Button asChild size="sm" className="w-full rounded-lg">
                            <a href={dbProject.github_url} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-2" /> Repository
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                        {dbProject.docs_url && (
                          <Button asChild size="sm" variant="outline" className="w-full rounded-lg">
                            <a href={dbProject.docs_url} target="_blank" rel="noopener noreferrer">
                              <BookOpen className="h-4 w-4 mr-2" /> Documentation
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </aside>
            </div>
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
