import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, MapPin, Building2, FolderOpen,
  ExternalLink, Calendar, User, Pencil, X, Save, Loader2, Star,
} from "lucide-react";
import { interests as allInterests } from "@/data/interests";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

  // Only blurb and hide_location are editable here
  const [blurb, setBlurb] = useState(profile.blurb || "");
  const [hideLocation, setHideLocation] = useState(profile.hide_location || false);

  const resetForm = () => {
    setBlurb(profile.blurb || "");
    setHideLocation(profile.hide_location || false);
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          blurb: blurb.trim(),
          hide_location: hideLocation,
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;

      const updated = {
        ...profile,
        blurb: blurb.trim(),
        hide_location: hideLocation,
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
  const showLocation = profile.location && !profile.hide_location;

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
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-1">
                {profile.full_name || profile.username || "Community Member"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {profile.username && (
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> @{profile.username}
                  </span>
                )}
                {showLocation && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Joined{" "}
                  {new Date(profile.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                </span>
              </div>
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

        {/* Expertise */}
        {(profile.expertise || []).length > 0 && !editing && (
          <div className="flex flex-wrap gap-2 mb-5">
            {(profile.expertise as string[]).map((slug: string) => {
              const interest = allInterests.find((i) => i.slug === slug);
              return (
                <Link
                  key={slug}
                  to={`/interests/${slug}`}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                >
                  <Star className="h-3 w-3" />
                  {interest?.name || slug}
                </Link>
              );
            })}
          </div>
        )}

        {/* Hide location toggle (only visible in edit mode) */}
        {editing && profile.location && (
          <div className="flex items-center gap-3 mb-5 p-3 rounded-lg border border-border/60">
            <Switch
              checked={hideLocation}
              onCheckedChange={setHideLocation}
              id="hide-location"
            />
            <Label htmlFor="hide-location" className="text-sm cursor-pointer">
              Hide location from public profile
            </Label>
            {profile.location && (
              <span className="text-xs text-muted-foreground ml-auto">
                Current: {profile.location}
              </span>
            )}
          </div>
        )}

        {/* ORCID (read-only, inherited from private profile) */}
        {profile.orcid && (
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
        )}

        {/* Organisations (read-only, inherited from private profile) */}
        {memberOrgs.length > 0 && (
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
        )}

        {/* Hint for own profile in edit mode */}
        {editing && (
          <p className="text-xs text-muted-foreground mt-4 italic">
            Name, username, ORCID, and organisations are managed from your <Link to="/profile" className="text-primary hover:underline">private profile</Link>.
          </p>
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
