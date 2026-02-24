import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera, ExternalLink, Plus, Eye, Building2, Settings, Search, UserPlus,
  MoreHorizontal, Trash2, LogOut, UserCog, Crown, Clock, X, Save, Loader2, AtSign, MessageSquare, Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { communityProjects, communityMembers, technologies as techList } from "@/data/mockData";
import { interests } from "@/data/interests";
import { useUserInterests } from "@/hooks/useUserInterests";
import CreateOrganisationDialog from "@/components/CreateOrganisationDialog";
import AvatarCropDialog from "@/components/AvatarCropDialog";
import DeregisterConfirmDialog from "@/components/DeregisterConfirmDialog";
import DragToDeleteDialog from "@/components/DragToDeleteDialog";
import { useUnreadDiscussions } from "@/hooks/useUnreadDiscussions";
import { useUserRoles } from "@/hooks/useUserRoles";

interface ProfileData {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  orcid: string | null;
  organisations: string[] | null;
  expertise: string[] | null;
}

// Interests & expertise picker
const RegisteredInterestsSection = ({ profile, onExpertiseUpdate }: { profile: ProfileData | null; onExpertiseUpdate: (next: string[]) => void }) => {
  const { toast } = useToast();
  const { registeredSlugs, loading, toggleInterest, refetch } = useUserInterests();
  const registered = interests.filter((i) => registeredSlugs.has(i.slug));
  const expertise = profile?.expertise || [];
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);
  const [showRemoveAll, setShowRemoveAll] = useState(false);
  const [removingAll, setRemovingAll] = useState(false);

  const handleRemoveAll = async () => {
    setRemovingAll(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("user_interests" as any).delete().eq("user_id", user.id);
      // Clear expertise too since interests are gone
      if (profile?.user_id) {
        await supabase.from("profiles").update({ expertise: [] }).eq("user_id", profile.user_id);
        onExpertiseUpdate([]);
      }
      await refetch();
      toast({ title: "All interests removed" });
    } catch (err: any) {
      toast({ title: "Failed to remove interests", description: err.message, variant: "destructive" });
    }
    setRemovingAll(false);
    setShowRemoveAll(false);
  };
  // Build page IDs for unread tracking (both technology and interest pages)
  const pageIds = useMemo(() => {
    return registered.map((i) => {
      if (i.technologyName) {
        const tech = techList.find((t: any) => t.name === i.technologyName);
        return tech ? `technology-${tech.id}` : `interest-${i.slug}`;
      }
      return `interest-${i.slug}`;
    });
  }, [registered]);

  const { unreadCounts } = useUnreadDiscussions(pageIds);

  const toggleExpertise = (slug: string) => {
    const isSelected = expertise.includes(slug);
    const next = isSelected ? expertise.filter((s) => s !== slug) : [...expertise, slug];
    if (!isSelected && next.length > 4) return;
    onExpertiseUpdate(next);
  };

  // Total unread across all registered interests
  const totalUnread = Object.values(unreadCounts).reduce((sum, n) => sum + n, 0);

  return (
    <>
    <div className="mb-8 space-y-6">
      {/* Registered Interests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">My Interests</h3>
            {totalUnread > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                <MessageSquare className="h-2.5 w-2.5" />
                {totalUnread} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{registered.length} registered</span>
            {registered.length > 1 && (
              <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive h-7 px-2" onClick={() => setShowRemoveAll(true)}>
                <Trash2 className="h-3 w-3 mr-1" /> Remove All
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Register your interests on the{" "}
          <Link to="/technologies" className="text-primary hover:underline font-medium">Technologies</Link> and{" "}
          <Link to="/interests" className="text-primary hover:underline font-medium">Discussions</Link>{" "}
          pages — they'll appear here automatically.
        </p>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : registered.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {registered.map((interest, idx) => {
              const unread = unreadCounts[pageIds[idx]] || 0;
              return (
                <button
                  key={interest.slug}
                  onClick={() => setConfirmSlug(interest.slug)}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground border border-primary font-medium hover:bg-primary/80 transition-colors group"
                >
                  {interest.name}
                  {unread > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-primary-foreground text-primary text-[10px] font-bold">
                      {unread}
                    </span>
                  )}
                  <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">No interests registered yet.</p>
            <div className="flex justify-center gap-2">
              <Button size="sm" variant="outline" className="rounded-full" asChild>
                <Link to="/technologies">Browse Technologies</Link>
              </Button>
              <Button size="sm" variant="outline" className="rounded-full" asChild>
                <Link to="/interests">Browse Discussions</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Expertise Selection */}
      {registered.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Expertise</h3>
            <span className="text-xs text-muted-foreground">{expertise.length}/4 selected — shown on public profile</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Choose up to 4 of your registered interests to highlight as expertise on your public profile.
          </p>
          <div className="flex flex-wrap gap-2">
            {registered.map((interest) => {
              const isExpertise = expertise.includes(interest.slug);
              const atLimit = expertise.length >= 4 && !isExpertise;
              return (
                <button
                  key={interest.slug}
                  disabled={atLimit}
                  onClick={() => toggleExpertise(interest.slug)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                    isExpertise
                      ? "bg-primary text-primary-foreground border-primary"
                      : atLimit
                        ? "bg-muted text-muted-foreground/50 border-border/40 cursor-not-allowed"
                        : "bg-card text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {interest.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
      <DragToDeleteDialog
        open={showRemoveAll}
        onOpenChange={setShowRemoveAll}
        onConfirm={handleRemoveAll}
        title="Remove All Interests"
        description={`This will remove all ${registered.length} registered interests and clear your expertise selections. You can re-register at any time.`}
        deleting={removingAll}
      />
      <DeregisterConfirmDialog
        open={!!confirmSlug}
        interestName={interests.find((i) => i.slug === confirmSlug)?.name}
        onConfirm={() => { toggleInterest(confirmSlug!); setConfirmSlug(null); }}
        onCancel={() => setConfirmSlug(null)}
      />
    </>
  );
};

const NewsWriterSection = ({ userId }: { userId?: string }) => {
  const { hasRole, loading } = useUserRoles();
  const isWriter = hasRole("news_writer") || hasRole("admin");
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;
    supabase.from("news_articles" as any).select("id, title, status, updated_at").eq("user_id", userId).order("updated_at", { ascending: false }).then(({ data }) => setArticles(data || []));
  }, [userId]);

  if (loading) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">My Articles</h3>
          {isWriter && <Badge variant="outline" className="text-[10px]">News Writer</Badge>}
        </div>
        {isWriter && (
          <Button size="sm" className="rounded-full" asChild>
            <Link to="/news/create"><Plus className="h-3.5 w-3.5 mr-1" /> New Article</Link>
          </Button>
        )}
      </div>
      {!isWriter ? (
        <p className="text-sm text-muted-foreground">You don't have the News Writer role. Contact an admin to get access.</p>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">No articles yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map((a: any) => (
            <Link key={a.id} to={`/news/edit/${a.id}`}>
              <Card className="hover:shadow-md transition-all border-border/60">
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.updated_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{a.status}</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const LinkedInSection = ({ profile, userId, onUpdate }: { profile: any; userId?: string; onUpdate: (url: string) => void }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(profile?.linkedin_url || "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const url = value.trim() || null;
      const { error } = await supabase.from("profiles").update({ linkedin_url: url } as any).eq("user_id", userId);
      if (error) throw error;
      onUpdate(url || "");
      setEditing(false);
      toast({ title: "LinkedIn updated!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 flex items-center gap-2">
      <Linkedin className="h-4 w-4 text-muted-foreground shrink-0" />
      {editing ? (
        <div className="flex items-center gap-2 flex-1">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://linkedin.com/in/your-profile"
            className="h-8 text-sm flex-1"
          />
          <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setValue(profile?.linkedin_url || ""); }} disabled={saving}>
            <X className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          </Button>
        </div>
      ) : profile?.linkedin_url ? (
        <div className="flex items-center gap-2">
          <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
            LinkedIn
          </a>
          <button onClick={() => setEditing(true)} className="text-xs text-muted-foreground hover:text-foreground">(edit)</button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Add LinkedIn URL
        </button>
      )}
    </div>
  );
};

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasRole } = useUserRoles();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);

  // Delete project state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [leaveTarget, setLeaveTarget] = useState<string | null>(null);
  const [transferTarget, setTransferTarget] = useState<string | null>(null);
  const [transferMembers, setTransferMembers] = useState<any[]>([]);
  const [selectedNewOwner, setSelectedNewOwner] = useState("");
  const [loadingTransferMembers, setLoadingTransferMembers] = useState(false);

  // Organisations
  const [allOrgs, setAllOrgs] = useState<any[]>([]);
  const [orgSearch, setOrgSearch] = useState("");
  const [pendingOrgRequests, setPendingOrgRequests] = useState<any[]>([]);
  const [joiningOrg, setJoiningOrg] = useState<string | null>(null);
  const [projectJoinRequests, setProjectJoinRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchDbProjects();
      fetchOrganisations();
      fetchPendingOrgRequests();
      fetchProjectJoinRequests();
    }
  }, [user]);

  const fetchProjectJoinRequests = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("project_join_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) {
      // Fetch project titles
      const projectIds = [...new Set(data.map((r) => r.project_id))];
      const { data: projects } = await supabase
        .from("projects")
        .select("id, title")
        .in("id", projectIds);
      const projectMap = new Map(projects?.map((p) => [p.id, p.title]) || []);
      setProjectJoinRequests(data.map((r) => ({ ...r, projectTitle: projectMap.get(r.project_id) || "Unknown Project" })));
    }
  };

  // Unread discussion counts for projects
  const projectPageIds = useMemo(() => dbProjects.map((p) => `project-${p.id}`), [dbProjects]);
  const { unreadCounts: projectUnreadCounts } = useUnreadDiscussions(projectPageIds);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
    if (data) {
      setProfile(data as ProfileData);
      setNewUsername(data.username || "");
    }
    setLoadingProfile(false);
  };

  const fetchDbProjects = async () => {
    if (!user) return;
    const { data: owned } = await supabase
      .from("projects")
      .select("id, title, description, status, user_id, invited_members")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    const { data: member } = await supabase
      .from("projects")
      .select("id, title, description, status, user_id, invited_members")
      .contains("invited_members", [user.id])
      .order("created_at", { ascending: false });
    const all = [...(owned || []), ...(member || [])];
    setDbProjects(Array.from(new Map(all.map((p) => [p.id, p])).values()));
  };

  const fetchOrganisations = async () => {
    const { data } = await supabase.from("organisations").select("*").order("name");
    setAllOrgs(data || []);
  };

  const fetchPendingOrgRequests = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("organisation_join_requests")
      .select("*, organisations(*)")
      .eq("user_id", user.id)
      .eq("status", "pending");
    setPendingOrgRequests(data || []);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB.", variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropSave = async (blob: Blob) => {
    if (!user) return;
    setUploadingAvatar(true);
    try {
      const path = `${user.id}/avatar.png`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, blob, { upsert: true, contentType: "image/png" });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      const avatarUrl = `${publicUrl}?t=${Date.now()}`;
      const { error: updateError } = await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("user_id", user.id);
      if (updateError) throw updateError;
      setProfile((prev) => prev ? { ...prev, avatar_url: avatarUrl } : prev);
      toast({ title: "Avatar updated!" });
      setCropDialogOpen(false);
      setCropImageSrc(null);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!user) return;
    setSavingUsername(true);
    try {
      const { error } = await supabase.from("profiles").update({ username: newUsername.trim() || null }).eq("user_id", user.id);
      if (error) throw error;
      setProfile((prev) => prev ? { ...prev, username: newUsername.trim() || null } : prev);
      setEditingUsername(false);
      toast({ title: "Username updated!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingUsername(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", deleteTarget);
      if (error) throw error;
      setDbProjects((prev) => prev.filter((p) => p.id !== deleteTarget));
      toast({ title: "Project deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleLeaveProject = async () => {
    if (!leaveTarget || !user) return;
    try {
      const project = dbProjects.find((p) => p.id === leaveTarget);
      if (!project) return;
      const updatedMembers = (project.invited_members || []).filter((m: string) => m !== user.id);
      const { error } = await supabase.from("projects").update({ invited_members: updatedMembers }).eq("id", leaveTarget);
      if (error) throw error;
      setDbProjects((prev) => prev.filter((p) => p.id !== leaveTarget));
      toast({ title: "Left project" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLeaveTarget(null);
    }
  };

  const openTransferDialog = async (projectId: string) => {
    setTransferTarget(projectId);
    setLoadingTransferMembers(true);
    setSelectedNewOwner("");
    try {
      const project = dbProjects.find((p) => p.id === projectId);
      const memberIds = (project?.invited_members || []).filter((m: string) => m !== user?.id);
      if (memberIds.length === 0) { setTransferMembers([]); setLoadingTransferMembers(false); return; }
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, username").in("user_id", memberIds);
      setTransferMembers(profiles || []);
    } catch { setTransferMembers([]); }
    finally { setLoadingTransferMembers(false); }
  };

  const handleTransferOwnership = async () => {
    if (!transferTarget || !selectedNewOwner || !user) return;
    try {
      const project = dbProjects.find((p) => p.id === transferTarget);
      if (!project) return;
      const updatedMembers = [...(project.invited_members || []).filter((m: string) => m !== selectedNewOwner), user.id];
      const { error } = await supabase.from("projects").update({ user_id: selectedNewOwner, invited_members: updatedMembers }).eq("id", transferTarget);
      if (error) throw error;
      setDbProjects((prev) => prev.map((p) => p.id === transferTarget ? { ...p, user_id: selectedNewOwner, invited_members: updatedMembers } : p));
      toast({ title: "Ownership transferred" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setTransferTarget(null); setSelectedNewOwner(""); }
  };

  const handleJoinOrg = async (orgId: string) => {
    if (!user) return;
    setJoiningOrg(orgId);
    try {
      const { error } = await supabase.from("organisation_join_requests").insert({
        user_id: user.id,
        organisation_id: orgId,
      });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already requested", description: "You've already sent a request to this organisation.", variant: "destructive" });
        } else throw error;
      } else {
        toast({ title: "Request sent!", description: "Your join request is pending approval." });
        fetchPendingOrgRequests();
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setJoiningOrg(null); }
  };

  const handleCancelOrgRequest = async (requestId: string) => {
    try {
      const { error } = await supabase.from("organisation_join_requests").delete().eq("id", requestId);
      if (error) throw error;
      setPendingOrgRequests((prev) => prev.filter((r) => r.id !== requestId));
      toast({ title: "Request cancelled" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Mock member matching
  const matchedMember = communityMembers.find((m) => profile?.username && m.id === profile.username);
  const mockProjects = matchedMember
    ? communityProjects.filter((p) => p.authorId === matchedMember.id || p.collaboratorIds?.includes(matchedMember.id))
    : [];

  // Filter orgs for search
  const profileOrgIds = profile?.organisations || [];
  const pendingOrgIds = pendingOrgRequests.map((r) => r.organisation_id);
  const filteredOrgs = allOrgs.filter((org) => {
    if (profileOrgIds.includes(org.id)) return false;
    if (pendingOrgIds.includes(org.id)) return false;
    if (!orgSearch) return true;
    return org.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
      org.country?.toLowerCase().includes(orgSearch.toLowerCase());
  });

  // Org objects for user's current orgs
  const userOrgObjects = allOrgs.filter((o) => profileOrgIds.includes(o.id));

  if (authLoading || loadingProfile) {
    return (
      <Layout>
        <div className="py-24 min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  const initials = (profile?.full_name || profile?.username || user?.email || "U")
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Layout>
      <section className="py-24 min-h-[80vh]">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold mb-8">My Profile</h1>

            {/* Avatar & Name */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-20 w-20 text-lg">
                      <AvatarImage src={profile?.avatar_url ?? undefined} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="h-5 w-5 text-white" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold truncate">
                      {profile?.full_name || profile?.username || "User"}
                    </h2>
                    {/* Username / Tag */}
                    <div className="flex items-center gap-2 mt-1">
                      {editingUsername ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                              value={newUsername}
                              onChange={(e) => setNewUsername(e.target.value)}
                              className="h-7 w-40 text-sm"
                              placeholder="username"
                            />
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => { setEditingUsername(false); setNewUsername(profile?.username || ""); }} disabled={savingUsername}>
                            <X className="h-3 w-3" />
                          </Button>
                          <Button size="sm" className="h-7 px-2" onClick={handleSaveUsername} disabled={savingUsername}>
                            {savingUsername ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingUsername(true)}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                          <AtSign className="h-3.5 w-3.5" />
                          {profile?.username || "Set username"}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">{user?.email}</p>
                    {profile?.orcid && (
                      <a href={`https://orcid.org/${profile.orcid}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                        ORCID: {profile.orcid}
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="rounded-full" asChild>
                      <Link to={`/community/${user?.id}`}>
                        <Eye className="h-3.5 w-3.5 mr-1.5" /> View Public Profile
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full" asChild>
                      <Link to="/account-settings">
                        <Settings className="h-3.5 w-3.5 mr-1.5" /> Account Settings
                      </Link>
                    </Button>
                    {hasRole("admin") && (
                      <Button size="sm" variant="ghost" className="rounded-full text-primary" asChild>
                        <Link to="/admin">
                          <Crown className="h-3.5 w-3.5 mr-1.5" /> Admin Panel
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LinkedIn URL */}
            <LinkedInSection profile={profile} userId={user?.id} onUpdate={(url) => setProfile((prev) => prev ? { ...prev, linkedin_url: url } : prev)} />

            <Separator className="my-8" />

            {/* Registered Interests */}
            <RegisteredInterestsSection
              profile={profile}
              onExpertiseUpdate={async (next) => {
                if (!user) return;
                const { error } = await supabase.from("profiles").update({ expertise: next } as any).eq("user_id", user.id);
                if (!error) setProfile((prev) => prev ? { ...prev, expertise: next } : prev);
              }}
            />

            <Separator className="my-8" />

            {/* News Writer Section */}
            <NewsWriterSection userId={user?.id} />

            <Separator className="my-8" />

            {/* Projects */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">My Projects</h3>
                <Button size="sm" className="rounded-full" asChild>
                  <Link to="/projects/start">
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Project
                  </Link>
                </Button>
              </div>
              {dbProjects.length > 0 || mockProjects.length > 0 ? (
                <div className="space-y-3">
                  {dbProjects.map((p) => {
                    const isOwner = p.user_id === user?.id;
                    return (
                      <Card key={p.id} className="hover:border-primary/30 transition-colors">
                        <CardContent className="py-4 flex items-center justify-between gap-3">
                          <Link to={`/projects/${p.id}`} className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-medium truncate">{p.title}</p>
                              {isOwner && (
                                <Badge variant="secondary" className="text-[10px] gap-1 shrink-0">
                                  <Crown className="h-3 w-3" /> Owner
                                </Badge>
                              )}
                              {(projectUnreadCounts[`project-${p.id}`] || 0) > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground shrink-0">
                                  <MessageSquare className="h-2.5 w-2.5" />
                                  {projectUnreadCounts[`project-${p.id}`]}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{p.description}</p>
                          </Link>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="secondary">{p.status}</Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover border border-border shadow-md z-50">
                                <DropdownMenuItem asChild>
                                  <Link to={`/projects/${p.id}`} className="cursor-pointer">
                                    <ExternalLink className="h-4 w-4 mr-2" /> View Project
                                  </Link>
                                </DropdownMenuItem>
                                {isOwner && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => openTransferDialog(p.id)} className="cursor-pointer">
                                      <UserCog className="h-4 w-4 mr-2" /> Transfer Ownership
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setDeleteTarget(p.id)} className="cursor-pointer text-destructive focus:text-destructive">
                                      <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {!isOwner && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setLeaveTarget(p.id)} className="cursor-pointer text-destructive focus:text-destructive">
                                      <LogOut className="h-4 w-4 mr-2" /> Leave Project
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {mockProjects.map((p) => (
                    <Link key={p.id} to={`/projects/${p.id}`}>
                      <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                        <CardContent className="py-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{p.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{p.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{p.status}</Badge>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No projects associated with your account yet.</p>
              )}
            </div>

            {/* Project Join Requests */}
            {projectJoinRequests.length > 0 && (
              <>
                <Separator className="my-8" />
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">My Project Join Requests</h3>
                  </div>
                  <div className="space-y-2">
                    {projectJoinRequests.map((req) => (
                      <Card key={req.id} className={req.status === "pending" ? "border-dashed border-amber-500/30" : "border-border/60"}>
                        <CardContent className="py-3 flex items-center justify-between gap-3">
                          <Link to={`/projects/${req.project_id}`} className="flex-1 min-w-0 hover:text-primary transition-colors">
                            <p className="font-medium text-sm truncate">{req.projectTitle}</p>
                            {req.message && (
                              <p className="text-xs text-muted-foreground truncate">{req.message}</p>
                            )}
                          </Link>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge
                              variant={req.status === "approved" || req.status === "accepted" ? "secondary" : "outline"}
                              className="text-xs capitalize"
                            >
                              {req.status}
                            </Badge>
                            {req.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
                                onClick={async () => {
                                  try {
                                    const { error } = await supabase.from("project_join_requests").delete().eq("id", req.id);
                                    if (error) throw error;
                                    setProjectJoinRequests((prev) => prev.filter((r) => r.id !== req.id));
                                    toast({ title: "Request cancelled" });
                                  } catch (err: any) {
                                    toast({ title: "Error", description: err.message, variant: "destructive" });
                                  }
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator className="my-8" />

            {/* Organisations */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">My Organisations</h3>
                <CreateOrganisationDialog onCreated={fetchOrganisations} />
              </div>

              {/* Current orgs */}
              {userOrgObjects.length > 0 && (
                <div className="space-y-2 mb-4">
                  {userOrgObjects.map((o) => (
                    <Card key={o.id} className="border-border/60">
                      <CardContent className="py-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{o.name}</p>
                          <p className="text-xs text-muted-foreground">{o.country}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">{o.type}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pending requests */}
              {pendingOrgRequests.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Pending Requests
                  </p>
                  <div className="space-y-2">
                    {pendingOrgRequests.map((req) => (
                      <Card key={req.id} className="border-dashed border-amber-500/30">
                        <CardContent className="py-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{(req as any).organisations?.name || "Organisation"}</p>
                            <p className="text-xs text-muted-foreground">Awaiting approval</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground hover:text-destructive"
                            onClick={() => handleCancelOrgRequest(req.id)}
                          >
                            Cancel
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Search & Join */}
              <Card className="border-dashed">
                <CardContent className="py-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
                    <p className="text-sm font-medium">Join an Organisation</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={orgSearch}
                      onChange={(e) => setOrgSearch(e.target.value)}
                      placeholder="Search organisations by name or country..."
                      className="pl-9"
                    />
                  </div>
                  {orgSearch && (
                    <div className="max-h-60 overflow-y-auto space-y-1.5">
                      {filteredOrgs.length > 0 ? (
                        filteredOrgs.map((org) => (
                          <div
                            key={org.id}
                            className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 hover:border-border transition-colors"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{org.name}</p>
                              <p className="text-xs text-muted-foreground">{org.country} · {org.type}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="shrink-0 text-xs"
                              disabled={joiningOrg === org.id}
                              onClick={() => handleJoinOrg(org.id)}
                            >
                              {joiningOrg === org.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Request to Join"}
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No matching organisations found. Try creating a new one!
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the project and all its content. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Confirmation */}
      <AlertDialog open={!!leaveTarget} onOpenChange={(open) => !open && setLeaveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave project?</AlertDialogTitle>
            <AlertDialogDescription>You will be removed from this project. You can request to rejoin later.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveProject}>Leave</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transfer Ownership Dialog */}
      <Dialog open={!!transferTarget} onOpenChange={(open) => !open && setTransferTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Ownership</DialogTitle>
            <DialogDescription>Select a project member to become the new owner. You will become a regular member.</DialogDescription>
          </DialogHeader>
          {loadingTransferMembers ? (
            <p className="text-sm text-muted-foreground py-4">Loading members...</p>
          ) : transferMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No other members in this project. Invite someone first before transferring ownership.</p>
          ) : (
            <Select value={selectedNewOwner} onValueChange={setSelectedNewOwner}>
              <SelectTrigger><SelectValue placeholder="Select new owner..." /></SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-md z-50">
                {transferMembers.map((m) => (
                  <SelectItem key={m.user_id} value={m.user_id}>{m.full_name || m.username || m.user_id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferTarget(null)}>Cancel</Button>
            <Button onClick={handleTransferOwnership} disabled={!selectedNewOwner}>Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {cropImageSrc && (
        <AvatarCropDialog
          open={cropDialogOpen}
          imageSrc={cropImageSrc}
          onClose={() => { setCropDialogOpen(false); setCropImageSrc(null); }}
          onCropComplete={handleCropSave}
          saving={uploadingAvatar}
        />
      )}
    </Layout>
  );
};

export default Profile;
