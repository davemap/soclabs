import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface DiscussionComment {
  id: string;
  page_id: string;
  thread_subject: string;
  parent_id: string | null;
  author_id: string;
  author_name: string;
  text: string;
  created_at: string;
  replies: DiscussionComment[];
}

interface RawComment {
  id: string;
  page_id: string;
  thread_subject: string;
  parent_id: string | null;
  author_id: string;
  author_name: string;
  text: string;
  created_at: string;
}

function buildTree(flat: RawComment[]): Map<string, DiscussionComment[]> {
  const byId = new Map<string, DiscussionComment>();
  const roots = new Map<string, DiscussionComment[]>();

  // Create nodes
  for (const c of flat) {
    byId.set(c.id, { ...c, replies: [] });
  }

  // Build tree
  for (const c of flat) {
    const node = byId.get(c.id)!;
    if (c.parent_id && byId.has(c.parent_id)) {
      byId.get(c.parent_id)!.replies.push(node);
    } else {
      // Root comment — group by thread_subject
      const subject = c.thread_subject;
      if (!roots.has(subject)) roots.set(subject, []);
      roots.get(subject)!.push(node);
    }
  }

  return roots;
}

export interface Thread {
  subject: string;
  comments: DiscussionComment[];
}

export function useDiscussionComments(pageId: string) {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from("discussion_comments" as any)
      .select("*")
      .eq("page_id", pageId)
      .order("created_at", { ascending: true });

    const raw = (data || []) as unknown as RawComment[];
    const tree = buildTree(raw);
    const threadList: Thread[] = [];
    tree.forEach((comments, subject) => {
      threadList.push({ subject, comments });
    });
    setThreads(threadList);
    setLoading(false);
  }, [pageId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Mark page as read
  const markAsRead = useCallback(async () => {
    if (!user) return;
    await supabase
      .from("discussion_read_status" as any)
      .upsert(
        { user_id: user.id, page_id: pageId, last_read_at: new Date().toISOString() } as any,
        { onConflict: "user_id,page_id" }
      );
  }, [user, pageId]);

  // Mark as read when viewing
  useEffect(() => {
    if (!loading && user) {
      markAsRead();
    }
  }, [loading, user, markAsRead]);

  const addComment = useCallback(async (threadSubject: string, text: string, parentId?: string) => {
    if (!user) return;

    // Get user's display name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, username")
      .eq("user_id", user.id)
      .maybeSingle();

    const authorName = profile?.full_name || profile?.username || user.email || "Anonymous";

    await supabase.from("discussion_comments" as any).insert({
      page_id: pageId,
      thread_subject: threadSubject,
      parent_id: parentId || null,
      author_id: user.id,
      author_name: authorName,
      text,
    } as any);

    await fetchComments();
    await markAsRead();
  }, [user, pageId, fetchComments, markAsRead]);

  return { threads, loading, addComment, refetch: fetchComments };
}
