import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Returns a map of page_id → unread comment count for a set of page IDs.
 * Only counts comments created after the user's last read timestamp.
 */
export function useUnreadDiscussions(pageIds: string[]) {
  const { user } = useAuth();
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchUnread = useCallback(async () => {
    if (!user || pageIds.length === 0) {
      setUnreadCounts({});
      setLoading(false);
      return;
    }

    // Get user's read timestamps
    const { data: readStatuses } = await supabase
      .from("discussion_read_status" as any)
      .select("page_id, last_read_at")
      .eq("user_id", user.id)
      .in("page_id", pageIds);

    const readMap = new Map<string, string>();
    for (const rs of (readStatuses || []) as any[]) {
      readMap.set(rs.page_id, rs.last_read_at);
    }

    // Get comment counts per page_id
    const counts: Record<string, number> = {};

    // Fetch all comments for these pages
    const { data: comments } = await supabase
      .from("discussion_comments" as any)
      .select("page_id, created_at")
      .in("page_id", pageIds);

    for (const c of (comments || []) as any[]) {
      const lastRead = readMap.get(c.page_id);
      if (!lastRead || new Date(c.created_at) > new Date(lastRead)) {
        counts[c.page_id] = (counts[c.page_id] || 0) + 1;
      }
    }

    setUnreadCounts(counts);
    setLoading(false);
  }, [user, pageIds.join(",")]);

  useEffect(() => {
    fetchUnread();
  }, [fetchUnread]);

  return { unreadCounts, loading, refetch: fetchUnread };
}
