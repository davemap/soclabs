import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Clock, Users } from "lucide-react";
import { toast } from "sonner";

interface JoinRequest {
  id: string;
  user_id: string;
  message: string;
  status: string;
  created_at: string;
  profile?: { username: string | null; full_name: string | null };
}

export default function ProjectJoinRequestsManager({ projectId }: { projectId: string }) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("project_join_requests")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (data) {
      // Fetch profiles for each request
      const userIds = data.map((d) => d.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, full_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);
      setRequests(
        data.map((d) => ({
          ...d,
          profile: profileMap.get(d.user_id) || undefined,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [projectId]);

  const updateStatus = async (requestId: string, status: "approved" | "denied") => {
    const { error } = await supabase
      .from("project_join_requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      toast.error("Failed to update request");
      return;
    }

    toast.success(`Request ${status}`);
    fetchRequests();
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading requests...</p>;

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-display font-bold">Join Requests</h3>
        {pending.length > 0 && (
          <Badge variant="destructive" className="text-xs">{pending.length} pending</Badge>
        )}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No join requests yet.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">Pending</h4>
          {pending.map((req) => {
            const name = req.profile?.full_name || req.profile?.username || "Unknown User";
            const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div key={req.id} className="flex items-center gap-3 rounded-lg border p-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{name}</p>
                  {req.message && (
                    <p className="text-xs text-muted-foreground truncate">{req.message}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    {new Date(req.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button size="sm" variant="outline" className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => updateStatus(req.id, "approved")}>
                    <Check className="h-3.5 w-3.5 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => updateStatus(req.id, "denied")}>
                    <X className="h-3.5 w-3.5 mr-1" /> Deny
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">Resolved</h4>
          {resolved.map((req) => {
            const name = req.profile?.full_name || req.profile?.username || "Unknown User";
            const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div key={req.id} className="flex items-center gap-3 rounded-lg border p-3 opacity-60">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{name}</p>
                  {req.message && (
                    <p className="text-xs text-muted-foreground truncate">{req.message}</p>
                  )}
                </div>
                <Badge variant={req.status === "approved" ? "secondary" : "outline"} className="text-xs">
                  {req.status}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
