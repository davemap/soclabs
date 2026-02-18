import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, MapPin, Building2, FolderOpen,
  ExternalLink, Calendar, User, Pencil, X, Save, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { partners } from "@/data/mockData";

const statusColor = (status: string) => {
  switch (status) {
    case "Completed": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "In Progress": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "Planning": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    default: return "bg-muted text-muted-foreground";
  }
};

interface MemberProfileViewProps {
  profile: any;
  userProjects: any[];
  isOwnProfile: boolean;
  onProfileUpdated?: (updated: any) => void;
}

const MemberProfileView = ({ profile, userProjects, isOwnProfile, onProfileUpdated }: MemberProfileViewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState(profile.full_name || "");
  const [username, setUsername] = useState(profile.username || "");
  const [blurb, setBlurb] = useState(profile.blurb || "");
  const [location, setLocation] = useState(profile.location || "");
  const [orcid, setOrcid] = useState(profile.orcid || "");
  const [orgIds, setOrgIds] = useState<string[]>(profile.organisations || []);

  const resetForm = () => {
    setFullName(profile.full_name || "");
    setUsername(profile.username || "");
    setBlurb(profile.blurb || "");
    setLocation(profile.location || "");
    setOrcid(profile.orcid || "");
    setOrgIds(profile.organisations || []);
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          username: username.trim() || null,
          blurb: blurb.trim(),
          location: location.trim(),
          orcid: orcid.trim() || null,
          organisations: orgIds,
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;

      const updated = {
        ...profile,
        full_name: fullName.trim() || null,
        username: username.trim() || null,
        blurb: blurb.trim(),
        location: location.trim(),
        orcid: orcid.trim() || null,
        organisations: orgIds,
      };
      onProfileUpdated?.(updated);
      setEditing(false);
      toast({ title: "Profile updated!" });
    } catch (err: any) {
      toast({ title: "Error saving profile", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const initials = (profile.full_name || profile.username || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberOrgs = partners.filter((p) => (profile.organisations || []).includes(p.id));

  return (
    <>
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </motion.div>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-5">
            <Avatar className="w-16 h-16 rounded-2xl">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.full_name || profile.username} />
              ) : null}
              <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-display font-bold text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Full Name</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Username</Label>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-1">
                    {profile.full_name || profile.username || "Community Member"}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {profile.username && (
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> @{profile.username}
                      </span>
                    )}
                    {profile.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {profile.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Joined{" "}
                      {new Date(profile.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          {isOwnProfile && !editing && (
            <Button variant="outline" size="sm" className="shrink-0" onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
            </Button>
          )}
          {editing && (
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={resetForm} disabled={saving}>
                <X className="h-3.5 w-3.5 mr-1" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
                Save
              </Button>
            </div>
          )}
        </div>

        {/* Blurb */}
        {editing ? (
          <div className="mb-5">
            <Label className="text-xs text-muted-foreground">Bio / Blurb</Label>
            <Textarea
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
        ) : (
          profile.blurb && (
            <p className="text-muted-foreground leading-relaxed mb-5">{profile.blurb}</p>
          )
        )}

        {/* Location (edit) */}
        {editing && (
          <div className="mb-5">
            <Label className="text-xs text-muted-foreground">Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. London, UK" />
          </div>
        )}

        {/* ORCID */}
        {editing ? (
          <div className="mb-5">
            <Label className="text-xs text-muted-foreground">ORCID</Label>
            <Input value={orcid} onChange={(e) => setOrcid(e.target.value)} placeholder="0000-0000-0000-0000" />
          </div>
        ) : (
          profile.orcid && (
            <div className="mb-4">
              <a
                href={`https://orcid.org/${profile.orcid}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-all"
              >
                <ExternalLink className="h-3 w-3" />
                ORCID: {profile.orcid}
              </a>
            </div>
          )
        )}

        {/* Organisations */}
        {editing ? (
          <div className="mb-5">
            <Label className="text-xs text-muted-foreground">Organisations</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {partners.map((org) => {
                const selected = orgIds.includes(org.id);
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() =>
                      setOrgIds((prev) =>
                        selected ? prev.filter((id) => id !== org.id) : [...prev, org.id]
                      )
                    }
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <Building2 className="h-3 w-3" />
                    {org.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          memberOrgs.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {memberOrgs.map((org) => (
                <Link
                  key={org.id}
                  to={`/partners/${org.id}`}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-all"
                >
                  <Building2 className="h-3 w-3" />
                  {org.name}
                </Link>
              ))}
            </div>
          )
        )}
      </motion.div>

      {/* Projects */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-2 mb-5">
          <FolderOpen className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-display font-bold">Projects</h2>
        </div>

        {userProjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {userProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="group">
                <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/60">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={statusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{project.reference_soc}</Badge>
                    </div>
                    <h3 className="font-display font-bold group-hover:text-primary transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex-1 leading-relaxed line-clamp-3 mb-3">
                      {project.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                      View project <ArrowRight className="h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <FolderOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No projects yet.</p>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default MemberProfileView;
