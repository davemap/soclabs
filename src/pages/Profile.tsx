import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera, Copy, Check, ExternalLink, Plus, Eye, Building2, Settings,
  MoreHorizontal, Trash2, LogOut, UserCog, Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { communityProjects, communityMembers, partners } from "@/data/mockData";

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  orcid: string | null;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [copied, setCopied] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Delete project state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  // Leave project state
  const [leaveTarget, setLeaveTarget] = useState<string | null>(null);
  // Transfer ownership state
  const [transferTarget, setTransferTarget] = useState<string | null>(null);
  const [transferMembers, setTransferMembers] = useState<any[]>([]);
  const [selectedNewOwner, setSelectedNewOwner] = useState("");
  const [loadingTransferMembers, setLoadingTransferMembers] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchDbProjects();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) setProfile(data as Profile);
    setLoadingProfile(false);
  };

  const fetchDbProjects = async () => {
    if (!user) return;
    // Get projects where user is owner OR invited member
    const { data: ownedProjects } = await supabase
      .from("projects")
      .select("id, title, description, status, user_id, invited_members")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: memberProjects } = await supabase
      .from("projects")
      .select("id, title, description, status, user_id, invited_members")
      .contains("invited_members", [user.id])
      .order("created_at", { ascending: false });

    // Merge and deduplicate
    const all = [...(ownedProjects || []), ...(memberProjects || [])];
    const unique = Array.from(new Map(all.map((p) => [p.id, p])).values());
    setDbProjects(unique);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB.", variant: "destructive" });
      return;
    }
    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error: updateError } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
      if (updateError) throw updateError;
      setProfile((prev) => prev ? { ...prev, avatar_url: publicUrl } : prev);
      toast({ title: "Avatar updated!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const copyUserId = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      const { error } = await supabase
        .from("projects")
        .update({ invited_members: updatedMembers })
        .eq("id", leaveTarget);
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

      if (memberIds.length === 0) {
        setTransferMembers([]);
        setLoadingTransferMembers(false);
        return;
      }

      // Fetch profiles for these member IDs
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, username")
        .in("user_id", memberIds);
      setTransferMembers(profiles || []);
    } catch {
      setTransferMembers([]);
    } finally {
      setLoadingTransferMembers(false);
    }
  };

  const handleTransferOwnership = async () => {
    if (!transferTarget || !selectedNewOwner || !user) return;
    try {
      const project = dbProjects.find((p) => p.id === transferTarget);
      if (!project) return;

      // Remove new owner from invited_members, add current owner
      const updatedMembers = [
        ...(project.invited_members || []).filter((m: string) => m !== selectedNewOwner),
        user.id,
      ];

      const { error } = await supabase
        .from("projects")
        .update({
          user_id: selectedNewOwner,
          invited_members: updatedMembers,
        })
        .eq("id", transferTarget);
      if (error) throw error;

      // Update local state
      setDbProjects((prev) =>
        prev.map((p) =>
          p.id === transferTarget
            ? { ...p, user_id: selectedNewOwner, invited_members: updatedMembers }
            : p
        )
      );
      toast({ title: "Ownership transferred" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setTransferTarget(null);
      setSelectedNewOwner("");
    }
  };

  // Match mock data
  const matchedMember = communityMembers.find(
    (m) => profile?.username && m.id === profile.username
  );
  const mockProjects = matchedMember
    ? communityProjects.filter(
        (p) => p.authorId === matchedMember.id || p.collaboratorIds?.includes(matchedMember.id)
      )
    : [];

  const userOrgs = matchedMember
    ? partners.filter((o) => matchedMember.organisations.includes(o.id))
    : [];

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
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
                    {profile?.username && (
                      <p className="text-sm text-muted-foreground truncate">@{profile.username}</p>
                    )}
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    {profile?.orcid && (
                      <a
                        href={`https://orcid.org/${profile.orcid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                      >
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User ID */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">User ID</CardTitle>
                <CardDescription>Your unique identifier on SoC Labs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted px-3 py-2 rounded text-xs font-mono truncate">{user?.id}</code>
                  <Button size="icon" variant="outline" onClick={copyUserId} className="shrink-0">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                                    <DropdownMenuItem
                                      onClick={() => openTransferDialog(p.id)}
                                      className="cursor-pointer"
                                    >
                                      <UserCog className="h-4 w-4 mr-2" /> Transfer Ownership
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => setDeleteTarget(p.id)}
                                      className="cursor-pointer text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {!isOwner && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => setLeaveTarget(p.id)}
                                      className="cursor-pointer text-destructive focus:text-destructive"
                                    >
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

            {/* Organisations */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">My Organisations</h3>
              </div>
              {userOrgs.length > 0 && (
                <div className="space-y-3 mb-4">
                  {userOrgs.map((o) => (
                    <Link key={o.id} to={`/partners/${o.id}`}>
                      <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                        <CardContent className="py-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{o.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{o.description}</p>
                          </div>
                          <Badge variant="outline">{o.type}</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
              <Card className="border-dashed">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Associate with an Organisation</p>
                      <Select
                        onValueChange={(orgId) => {
                          if (orgId && !userOrgs.find((o) => o.id === orgId)) {
                            navigate(`/partners/${orgId}`);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Browse organisations..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border shadow-md z-50">
                          {partners.map((org) => (
                            <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
            <AlertDialogDescription>
              This will permanently delete the project and all its content. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Confirmation */}
      <AlertDialog open={!!leaveTarget} onOpenChange={(open) => !open && setLeaveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave project?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be removed from this project. You can request to rejoin later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveProject}>
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transfer Ownership Dialog */}
      <Dialog open={!!transferTarget} onOpenChange={(open) => !open && setTransferTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Ownership</DialogTitle>
            <DialogDescription>
              Select a project member to become the new owner. You will become a regular member.
            </DialogDescription>
          </DialogHeader>
          {loadingTransferMembers ? (
            <p className="text-sm text-muted-foreground py-4">Loading members...</p>
          ) : transferMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No other members in this project. Invite someone first before transferring ownership.
            </p>
          ) : (
            <Select value={selectedNewOwner} onValueChange={setSelectedNewOwner}>
              <SelectTrigger>
                <SelectValue placeholder="Select new owner..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-md z-50">
                {transferMembers.map((m) => (
                  <SelectItem key={m.user_id} value={m.user_id}>
                    {m.full_name || m.username || m.user_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferTarget(null)}>Cancel</Button>
            <Button onClick={handleTransferOwnership} disabled={!selectedNewOwner}>
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Profile;
