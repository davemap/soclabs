import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useUserRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    if (!user) { setRoles([]); setLoading(false); return; }
    const { data } = await supabase
      .from("user_roles" as any)
      .select("role")
      .eq("user_id", user.id);
    setRoles((data || []).map((r: any) => r.role));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const hasRole = useCallback((role: string) => roles.includes(role), [roles]);

  return { roles, loading, hasRole, refetch: fetchRoles };
}
