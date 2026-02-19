import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Cpu, Box, Layers, Info, ExternalLink, CircuitBoard } from "lucide-react";
import { Link } from "react-router-dom";

export interface HierarchyNode {
  name: string;
  type: string;
  description?: string;
  language?: string;
  techId?: string;
  userDesigned?: boolean;
  children?: HierarchyNode[];
}

interface InteractiveHierarchyDiagramProps {
  hierarchy: HierarchyNode[];
  designName: string;
}

const depthColors = [
  { border: "border-slate-300 dark:border-slate-600", bg: "bg-slate-50/50 dark:bg-slate-800/20", accent: "text-slate-500" },
  { border: "border-sky-200 dark:border-sky-700/50", bg: "bg-sky-50/40 dark:bg-sky-900/10", accent: "text-sky-500" },
  { border: "border-violet-200 dark:border-violet-700/40", bg: "bg-violet-50/30 dark:bg-violet-900/10", accent: "text-violet-500" },
  { border: "border-emerald-200 dark:border-emerald-700/40", bg: "bg-emerald-50/30 dark:bg-emerald-900/10", accent: "text-emerald-500" },
  { border: "border-amber-200 dark:border-amber-700/40", bg: "bg-amber-50/30 dark:bg-amber-900/10", accent: "text-amber-500" },
];

const HierarchyNodeItem = ({ node, depth = 0 }: { node: HierarchyNode; depth?: number }) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const [showInfo, setShowInfo] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isGroup = hasChildren;
  const colors = depthColors[Math.min(depth, depthColors.length - 1)];

  if (isGroup) {
    return (
      <div className={`rounded-xl border-2 ${colors.border} ${colors.bg} ${node.userDesigned ? "border-dashed !border-rose-300 dark:!border-rose-500/40" : ""}`}>
        {/* Group header */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-muted/40 rounded-t-xl transition-colors duration-150"
        >
          {expanded ? <ChevronDown className={`h-4 w-4 ${colors.accent} shrink-0`} /> : <ChevronRight className={`h-4 w-4 ${colors.accent} shrink-0`} />}
          {depth === 0 ? <CircuitBoard className={`h-4.5 w-4.5 ${colors.accent} shrink-0`} /> : <Layers className={`h-4 w-4 ${colors.accent} shrink-0`} />}
          <span className="font-display font-bold text-sm text-foreground">{node.name}</span>
          {node.userDesigned && (
            <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">USER IP</span>
          )}
          {node.children && (
            <span className="text-[10px] text-muted-foreground ml-auto">{node.children.length} {node.children.length === 1 ? "block" : "blocks"}</span>
          )}
          {node.description && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowInfo((s) => !s); }}
              className="shrink-0 p-0.5 rounded hover:bg-muted ml-1"
            >
              <Info className={`h-3.5 w-3.5 ${showInfo ? "text-primary" : "text-muted-foreground/40"}`} />
            </button>
          )}
        </button>

        {/* Group info */}
        <AnimatePresence>
          {showInfo && node.description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="text-xs text-muted-foreground bg-background/60 border-t border-border/30 px-4 py-2.5 mx-3 mb-2 rounded-lg">
                <p>{node.description}</p>
                {node.techId && (
                  <Link to={`/technologies/${node.techId}`} className="inline-flex items-center gap-1 mt-1.5 text-primary hover:underline text-xs font-medium">
                    Learn more <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Children */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-2">
                {node.children!.map((child) => (
                  <HierarchyNodeItem key={child.name} node={child} depth={depth + 1} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Leaf node (individual module/block)
  return (
    <div className={`rounded-lg border ${colors.border} bg-background/80 ${node.userDesigned ? "border-dashed !border-rose-300 dark:!border-rose-500/40 bg-rose-50/20 dark:bg-rose-500/5" : ""}`}>
      <button
        onClick={() => setShowInfo((s) => !s)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-muted/40 rounded-lg transition-colors duration-150"
      >
        <Box className={`h-3.5 w-3.5 ${colors.accent} shrink-0`} />
        <span className="text-sm font-medium text-foreground/85">{node.name}</span>
        {node.userDesigned && (
          <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">USER IP</span>
        )}
        {node.description && (
          <Info className={`h-3.5 w-3.5 ml-auto shrink-0 ${showInfo ? "text-primary" : "text-muted-foreground/40"}`} />
        )}
      </button>
      <AnimatePresence>
        {showInfo && node.description && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="text-xs text-muted-foreground border-t border-border/30 px-3 py-2.5">
              <p>{node.description}</p>
              {node.techId && (
                <Link to={`/technologies/${node.techId}`} className="inline-flex items-center gap-1 mt-1.5 text-primary hover:underline text-xs font-medium">
                  Learn more <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InteractiveHierarchyDiagram = ({ hierarchy, designName }: InteractiveHierarchyDiagramProps) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-white dark:bg-card p-5 md:p-8">
      <div className="space-y-3">
        {hierarchy.map((node) => (
          <HierarchyNodeItem key={node.name} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
};

export default InteractiveHierarchyDiagram;
