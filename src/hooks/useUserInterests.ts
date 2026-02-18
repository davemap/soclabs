import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useUserInterests() {
  const { user } = useAuth();
  const [registeredSlugs, setRegisteredSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchInterests = useCallback(async () => {
    if (!user) { setRegisteredSlugs(new Set()); setLoading(false); return; }
    const { data } = await supabase
      .from("user_interests" as any)
      .select("interest_slug")
      .eq("user_id", user.id);
    setRegisteredSlugs(new Set((data || []).map((r: any) => r.interest_slug)));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchInterests(); }, [fetchInterests]);

  const toggleInterest = useCallback(async (slug: string) => {
    if (!user) return;
    const isRegistered = registeredSlugs.has(slug);
    if (isRegistered) {
      await supabase.from("user_interests" as any).delete().eq("user_id", user.id).eq("interest_slug", slug);
      setRegisteredSlugs((prev) => { const next = new Set(prev); next.delete(slug); return next; });
    } else {
      await supabase.from("user_interests" as any).insert({ user_id: user.id, interest_slug: slug } as any);
      setRegisteredSlugs((prev) => new Set(prev).add(slug));
    }
  }, [user, registeredSlugs]);

  const isRegistered = useCallback((slug: string) => registeredSlugs.has(slug), [registeredSlugs]);

  return { registeredSlugs, loading, toggleInterest, isRegistered, refetch: fetchInterests };
}
