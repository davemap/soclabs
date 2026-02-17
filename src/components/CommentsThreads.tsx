import { useState } from "react";
import { ChevronDown, ChevronRight, MessageSquare, Reply, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author: string;
  date: string;
  text: string;
  replies: Comment[];
}

interface Thread {
  id: string;
  subject: string;
  comments: Comment[];
}

const mockThreads: Record<string, Thread[]> = {};

function getInitialThreads(pageId: string): Thread[] {
  if (mockThreads[pageId]) return mockThreads[pageId];

  const threads: Thread[] = [
    {
      id: "t1",
      subject: "General Discussion",
      comments: [
        {
          id: "c1",
          author: "Dr. Sarah Chen",
          date: "2026-02-12",
          text: "Great work on this! I'd love to see how it integrates with the NanoSoC extension port.",
          replies: [
            {
              id: "c1r1",
              author: "Maria Gonzalez",
              date: "2026-02-13",
              text: "Agreed — we tested a similar approach in our DSP project. Happy to share notes.",
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: "t2",
      subject: "Technical Questions",
      comments: [
        {
          id: "c2",
          author: "Dr. Kenji Tanaka",
          date: "2026-02-14",
          text: "What clock frequency are you targeting for the FPGA implementation?",
          replies: [],
        },
      ],
    },
  ];

  mockThreads[pageId] = threads;
  return threads;
}

const CommentItem = ({
  comment,
  depth = 0,
  onReply,
}: {
  comment: Comment;
  depth?: number;
  onReply: (parentId: string, text: string) => void;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText("");
    setShowReplyForm(false);
  };

  return (
    <div className={cn("relative", depth > 0 && "ml-6 pl-4 border-l-2 border-border/40")}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-3 w-3 text-primary" />
          </div>
          <span className="text-sm font-medium">{comment.author}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed ml-8">{comment.text}</p>
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="ml-8 mt-1.5 text-xs text-primary hover:underline inline-flex items-center gap-1"
        >
          <Reply className="h-3 w-3" /> Reply
        </button>

        {showReplyForm && (
          <div className="ml-8 mt-2 flex gap-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply…"
              className="text-sm h-9"
              onKeyDown={(e) => e.key === "Enter" && handleReply()}
            />
            <Button size="sm" onClick={handleReply} className="h-9 px-3">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
      ))}
    </div>
  );
};

const ThreadSection = ({
  thread,
  onAddComment,
  onReply,
}: {
  thread: Thread;
  onAddComment: (threadId: string, text: string) => void;
  onReply: (threadId: string, parentId: string, text: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAdd = () => {
    if (!newComment.trim()) return;
    onAddComment(thread.id, newComment);
    setNewComment("");
  };

  const totalComments = countComments(thread.comments);

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-display font-semibold text-sm">{thread.subject}</span>
        </div>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <MessageSquare className="h-3 w-3" /> {totalComments}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-border/40">
          <div className="divide-y divide-border/30">
            {thread.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={(parentId, text) => onReply(thread.id, parentId, text)}
              />
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment…"
              className="text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button size="sm" onClick={handleAdd} className="px-4">
              <Send className="h-3.5 w-3.5 mr-1.5" /> Post
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

function countComments(comments: Comment[]): number {
  return comments.reduce((sum, c) => sum + 1 + countComments(c.replies), 0);
}

function addReplyToComments(comments: Comment[], parentId: string, reply: Comment): Comment[] {
  return comments.map((c) => {
    if (c.id === parentId) {
      return { ...c, replies: [...c.replies, reply] };
    }
    return { ...c, replies: addReplyToComments(c.replies, parentId, reply) };
  });
}

interface CommentsThreadsProps {
  pageId: string;
}

const CommentsThreads = ({ pageId }: CommentsThreadsProps) => {
  const { toast } = useToast();
  const [threads, setThreads] = useState<Thread[]>(() => getInitialThreads(pageId));
  const [showNewThread, setShowNewThread] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newFirstComment, setNewFirstComment] = useState("");

  const handleAddComment = (threadId: string, text: string) => {
    const comment: Comment = {
      id: `c-${Date.now()}`,
      author: "You",
      date: new Date().toISOString().split("T")[0],
      text,
      replies: [],
    };
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, comments: [...t.comments, comment] } : t))
    );
  };

  const handleReply = (threadId: string, parentId: string, text: string) => {
    const reply: Comment = {
      id: `r-${Date.now()}`,
      author: "You",
      date: new Date().toISOString().split("T")[0],
      text,
      replies: [],
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, comments: addReplyToComments(t.comments, parentId, reply) } : t
      )
    );
  };

  const handleCreateThread = () => {
    if (!newSubject.trim() || !newFirstComment.trim()) return;
    const thread: Thread = {
      id: `t-${Date.now()}`,
      subject: newSubject,
      comments: [
        {
          id: `c-${Date.now()}`,
          author: "You",
          date: new Date().toISOString().split("T")[0],
          text: newFirstComment,
          replies: [],
        },
      ],
    };
    setThreads((prev) => [...prev, thread]);
    setNewSubject("");
    setNewFirstComment("");
    setShowNewThread(false);
    toast({ title: "Thread Created", description: "Your new discussion thread has been posted." });
  };

  return (
    <div className="mt-16 pt-10 border-t border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" /> Discussion
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => setShowNewThread(!showNewThread)}
        >
          {showNewThread ? "Cancel" : "New Thread"}
        </Button>
      </div>

      {showNewThread && (
        <div className="mb-6 p-5 rounded-xl border border-border/60 bg-muted/20 space-y-3">
          <Input
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Thread subject…"
            className="font-medium"
          />
          <Textarea
            value={newFirstComment}
            onChange={(e) => setNewFirstComment(e.target.value)}
            placeholder="Your opening comment…"
            rows={3}
          />
          <Button size="sm" className="rounded-full px-6" onClick={handleCreateThread}>
            <Send className="h-3.5 w-3.5 mr-1.5" /> Create Thread
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {threads.map((thread) => (
          <ThreadSection
            key={thread.id}
            thread={thread}
            onAddComment={handleAddComment}
            onReply={handleReply}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsThreads;
