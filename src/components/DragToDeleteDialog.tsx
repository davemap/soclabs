import { useState, useRef, useCallback } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DragToDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  deleting?: boolean;
}

export default function DragToDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete Project",
  description = "This action cannot be undone. All project data, milestones, and content will be permanently deleted.",
  deleting = false,
}: DragToDeleteDialogProps) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const threshold = 220;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (deleting) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [deleting]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 24;
    setDragX(Math.max(0, Math.min(x, threshold)));
  }, [isDragging, threshold]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX >= threshold - 10) {
      onConfirm();
    } else {
      setDragX(0);
    }
  }, [isDragging, dragX, threshold, onConfirm]);

  const progress = Math.min(dragX / threshold, 1);
  const isNearComplete = progress > 0.85;

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!deleting) { setDragX(0); onOpenChange(v); } }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="font-display">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm">{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {/* Drag track */}
        <div className="my-4">
          <div
            ref={trackRef}
            className={cn(
              "relative h-14 rounded-2xl border-2 border-dashed transition-colors duration-200 overflow-hidden select-none",
              isNearComplete
                ? "border-destructive/60 bg-destructive/5"
                : "border-border/60 bg-muted/30"
            )}
          >
            {/* Fill bar */}
            <div
              className="absolute inset-y-0 left-0 rounded-2xl transition-colors duration-200"
              style={{
                width: `${(dragX + 48) }px`,
                background: isNearComplete
                  ? "hsl(var(--destructive) / 0.15)"
                  : "hsl(var(--muted) / 0.5)",
              }}
            />

            {/* Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className={cn(
                "text-xs font-medium transition-opacity duration-200",
                dragX > 40 ? "opacity-0" : "opacity-60"
              )}>
                {deleting ? "Deleting..." : "Drag to delete →"}
              </span>
            </div>

            {/* Trash icon at end */}
            <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
              <Trash2 className={cn(
                "h-5 w-5 transition-all duration-200",
                isNearComplete ? "text-destructive scale-125" : "text-muted-foreground/40"
              )} />
            </div>

            {/* Draggable thumb */}
            {!deleting && (
              <motion.div
                className={cn(
                  "absolute top-1.5 left-1.5 w-11 h-11 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-shadow",
                  isNearComplete
                    ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30"
                    : "bg-card border-2 border-border text-muted-foreground shadow-sm"
                )}
                style={{ transform: `translateX(${dragX}px)` }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                <Trash2 className="h-4 w-4" />
              </motion.div>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting} className="rounded-xl">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
