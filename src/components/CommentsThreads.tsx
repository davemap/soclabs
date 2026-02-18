import { useState } from "react";
import { ChevronDown, ChevronRight, MessageSquare, Reply, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useDiscussionComments, type DiscussionComment, type Thread } from "@/hooks/useDiscussionComments";
import { useNavigate } from "react-router-dom";

const CommentItem = ({
  comment,
  depth = 0,
  onReply,
}: {
  comment: DiscussionComment;
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
          <span className="text-sm font-medium">{comment.author_name}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
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
  onAddComment: (threadSubject: string, text: string) => void;
  onReply: (threadSubject: string, parentId: string, text: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAdd = () => {
    if (!newComment.trim()) return;
    onAddComment(thread.subject, newComment);
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
                onReply={(parentId, text) => onReply(thread.subject, parentId, text)}
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

function countComments(comments: DiscussionComment[]): number {
  return comments.reduce((sum, c) => sum + 1 + countComments(c.replies), 0);
}

interface CommentsThreadsProps {
  pageId: string;
}

const CommentsThreads = ({ pageId }: CommentsThreadsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { threads, loading, addComment } = useDiscussionComments(pageId);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newFirstComment, setNewFirstComment] = useState("");

  const handleAddComment = (threadSubject: string, text: string) => {
    if (!user) { navigate("/auth"); return; }
    addComment(threadSubject, text);
  };

  const handleReply = (threadSubject: string, parentId: string, text: string) => {
    if (!user) { navigate("/auth"); return; }
    addComment(threadSubject, text, parentId);
  };

  const handleCreateThread = () => {
    if (!user) { navigate("/auth"); return; }
    if (!newSubject.trim() || !newFirstComment.trim()) return;
    addComment(newSubject.trim(), newFirstComment.trim());
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

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading discussions…</p>
      ) : threads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No discussions yet. Start a new thread!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <ThreadSection
              key={thread.subject}
              thread={thread}
              onAddComment={handleAddComment}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsThreads;
