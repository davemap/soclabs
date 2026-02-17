import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Mail, Lock, Copy, Check, ExternalLink, Plus, Eye, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchDbProjects();
      setNewEmail(user.email ?? "");
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
    const { data } = await supabase
      .from("projects")
      .select("id, title, description, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setDbProjects(data);
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

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", user.id);
      if (updateError) throw updateError;

      setProfile((prev) => prev ? { ...prev, avatar_url: publicUrl } : prev);
      toast({ title: "Avatar updated!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail) return;
    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      toast({ title: "Confirmation sent", description: "Check your new email to confirm the change." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Password updated!" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  const copyUserId = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Match mock data by email or username
  const matchedMember = communityMembers.find(
    (m) => profile?.username && m.id === profile.username
  );

  const mockProjects = matchedMember
    ? communityProjects.filter(
        (p) => p.authorId === matchedMember.id || p.collaboratorIds?.includes(matchedMember.id)
      )
    : [];

  // Combine mock + real database projects
  const allProjects = [
    ...dbProjects.map((p) => ({ id: p.id, title: p.title, description: p.description, status: p.status, isDb: true })),
    ...mockProjects.map((p) => ({ id: p.id, title: p.title, description: p.description, status: p.status, isDb: false })),
  ];

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
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
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
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" className="rounded-full" asChild>
                      <Link to={`/community/${user?.id}`}>
                        <Eye className="h-3.5 w-3.5 mr-1.5" /> View Public Profile
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
                  <code className="flex-1 bg-muted px-3 py-2 rounded text-xs font-mono truncate">
                    {user?.id}
                  </code>
                  <Button size="icon" variant="outline" onClick={copyUserId} className="shrink-0">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Email Address</CardTitle>
                <CardDescription>Update your email — a confirmation will be sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleUpdateEmail} disabled={updating || newEmail === user?.email}>
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Password */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Change Password</CardTitle>
                <CardDescription>Set a new password (min 6 characters)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="new-password" className="text-xs">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="text-xs">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <Button onClick={handleUpdatePassword} disabled={updating || !newPassword}>
                  Change Password
                </Button>
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
              {allProjects.length > 0 ? (
                <div className="space-y-3">
                  {allProjects.map((p) => (
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
                        <SelectContent>
                          {partners.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
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
    </Layout>
  );
};

export default Profile;
